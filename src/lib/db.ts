/**
 * db.ts — IndexedDB wrapper for GymLog
 *
 * Uses the native IndexedDB API (no extra dependencies).
 * Provides a simple key/value store interface that the gym-store hooks consume.
 *
 * Database name : "gymlog"
 * Object store  : "kv"  (key-value, one record per data collection)
 *
 * Migration: on first open it reads any existing data from localStorage and
 * imports it, so users don't lose their history.
 */

const DB_NAME = "gymlog";
const DB_VERSION = 1;
const STORE = "kv";

// Keys that may exist in localStorage from the old implementation
const LS_KEYS = [
  "gymlog.customExercises.v1",
  "gymlog.logs.v1",
  "gymlog.routines.v1",
  "gymlog.bodyweights.v1",
];

let _db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db);

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };

    req.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      _db = db;

      // Migrate data from localStorage on first open
      migrateFromLocalStorage(db).finally(() => resolve(db));
    };

    req.onerror = () => reject(req.error);
  });
}

async function migrateFromLocalStorage(db: IDBDatabase): Promise<void> {
  if (typeof window === "undefined") return;

  const pending: Array<{ key: string; value: unknown }> = [];

  for (const key of LS_KEYS) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;

      // Only migrate if IndexedDB doesn't already have a value for this key
      const existing = await dbGet(db, key);
      if (existing !== undefined) continue;

      pending.push({ key, value: JSON.parse(raw) });
    } catch {
      // ignore malformed entries
    }
  }

  if (pending.length === 0) return;

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    for (const { key, value } of pending) {
      store.put(value, key);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function dbGet<T>(db: IDBDatabase, key: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
  });
}

function dbPut(db: IDBDatabase, key: string, value: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Read a value from IndexedDB. Returns `fallback` if not found or on error. */
export async function dbRead<T>(key: string, fallback: T): Promise<T> {
  try {
    const db = await openDB();
    const value = await dbGet<T>(db, key);
    return value !== undefined ? value : fallback;
  } catch {
    // Fall back to localStorage if IndexedDB is unavailable (e.g. private mode
    // on some older browsers)
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }
}

/** Write a value to IndexedDB and dispatch a cross-component sync event. */
export async function dbWrite(key: string, value: unknown): Promise<void> {
  try {
    const db = await openDB();
    await dbPut(db, key, value);
  } catch {
    // Fall back to localStorage
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable — nothing we can do
    }
  }
  // Notify all hook instances in this tab
  window.dispatchEvent(new CustomEvent("gymlog:change"));
}
