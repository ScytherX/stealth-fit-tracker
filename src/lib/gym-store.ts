import { useCallback, useEffect, useRef, useState } from "react";
import { dbRead, dbWrite } from "./db";
import { DATASET_EXERCISES } from "./dataset";

export type Category = "Pecho" | "Espalda" | "Piernas" | "Hombros" | "Brazos" | "Cardio" | "Abdomen";

export const CATEGORIES: Category[] = [
  "Pecho",
  "Espalda",
  "Piernas",
  "Hombros",
  "Brazos",
  "Abdomen",
  "Cardio",
];

export type Exercise = {
  id: string;
  name: string;
  nameEs?: string;
  nameEn?: string;
  category: Category;
  custom?: boolean;
};

export type LogEntry = {
  id: string;
  date: string;
  exerciseId: string;
  exerciseName: string;
  exerciseNameEs?: string;
  exerciseNameEn?: string;
  category: Category;
  weight?: number | undefined;
  sets?: number | undefined;
  reps?: number | undefined;
  minutes?: number | undefined;
  speed?: number | undefined;
  incline?: number | undefined;
  rest?: number | undefined;
  notes?: string | undefined;
  rir?: number | undefined;
};

// Start with our basic ones, then append the dataset avoiding duplicates by id
const baseExercises: Exercise[] = [
  { id: "press-banca", name: "Press de banca", nameEn: "Bench Press", nameEs: "Press de banca", category: "Pecho" },
  { id: "aperturas", name: "Aperturas", nameEn: "Chest Fly", nameEs: "Aperturas", category: "Pecho" },
  { id: "fondos", name: "Fondos", nameEn: "Dips", nameEs: "Fondos", category: "Pecho" },
  { id: "dominadas", name: "Dominadas", nameEn: "Pull-ups", nameEs: "Dominadas", category: "Espalda" },
  { id: "remo-barra", name: "Remo con barra", nameEn: "Barbell Row", nameEs: "Remo con barra", category: "Espalda" },
  { id: "jalon-pecho", name: "Jalón al pecho", nameEn: "Lat Pulldown", nameEs: "Jalón al pecho", category: "Espalda" },
  { id: "sentadillas", name: "Sentadillas", nameEn: "Squats", nameEs: "Sentadillas", category: "Piernas" },
  { id: "prensa", name: "Prensa", nameEn: "Leg Press", nameEs: "Prensa", category: "Piernas" },
  { id: "peso-muerto-rumano", name: "Peso muerto rumano", nameEn: "Romanian Deadlift", nameEs: "Peso muerto rumano", category: "Piernas" },
  { id: "press-militar", name: "Press militar", category: "Hombros" },
  { id: "elevaciones-laterales", name: "Elevaciones laterales", category: "Hombros" },
  { id: "curl-biceps", name: "Curl de bíceps", category: "Brazos" },
  { id: "extension-triceps", name: "Extensión de tríceps", category: "Brazos" },
  { id: "caminadora", name: "Caminadora", category: "Cardio" },
];

const baseIds = new Set(baseExercises.map(e => e.id));
const uniqueDataset = DATASET_EXERCISES.filter(e => !baseIds.has(e.id));

export const DEFAULT_EXERCISES: Exercise[] = [...baseExercises, ...uniqueDataset];

const EX_KEY = "gymlog.customExercises.v1";
const LOG_KEY = "gymlog.logs.v1";
const ROUTINE_KEY = "gymlog.routines.v1";
const BODYWEIGHT_KEY = "gymlog.bodyweights.v1";
const LANGUAGE_KEY = "gymlog.language.v1";

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * useStoreValue — React hook backed by IndexedDB.
 *
 * - Loads the initial value asynchronously from IndexedDB on mount.
 * - Writes back to IndexedDB on every update.
 * - Syncs across hook instances in the same tab via the "gymlog:change" event.
 * - Syncs across tabs via the "storage" event.
 */
function useStoreValue<T>(key: string, fallback: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(fallback);
  const loadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    // Initial async load from IndexedDB
    dbRead<T>(key, fallback).then((stored) => {
      if (!cancelled) {
        setValue(stored);
        loadedRef.current = true;
      }
    });

    // Re-read whenever any gymlog hook writes a change (same tab or other tab)
    const sync = () => {
      dbRead<T>(key, fallback).then((stored) => {
        if (!cancelled) setValue(stored);
      });
    };

    window.addEventListener("gymlog:change", sync);
    window.addEventListener("storage", sync);

    return () => {
      cancelled = true;
      window.removeEventListener("gymlog:change", sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (v: React.SetStateAction<T>) => {
      setValue((prev) => {
        const next = v instanceof Function ? (v as (prev: T) => T)(prev) : v;
        void dbWrite(key, next);
        return next;
      });
    },
    [key],
  );

  return [value, set];
}

export function useExercises() {
  const [custom, setCustom] = useStoreValue<Exercise[]>(EX_KEY, []);
  const all = [...DEFAULT_EXERCISES, ...custom];

  const addExercise = useCallback(
    (name: string, category: Category) => {
      const ex: Exercise = { id: uid(), name: name.trim(), category, custom: true };
      setCustom([...custom, ex]);
      return ex;
    },
    [custom, setCustom],
  );

  const removeExercise = useCallback(
    (id: string) => setCustom(custom.filter((e) => e.id !== id)),
    [custom, setCustom],
  );

  return { exercises: all, customExercises: custom, addExercise, removeExercise };
}

export function useLogs() {
  const [logs, setLogs] = useStoreValue<LogEntry[]>(LOG_KEY, []);

  const addLog = useCallback(
    (entry: Omit<LogEntry, "id">) => setLogs([{ ...entry, id: uid() }, ...logs]),
    [logs, setLogs],
  );

  const addLogs = useCallback(
    (entries: Omit<LogEntry, "id">[]) =>
      setLogs([...entries.map((e) => ({ ...e, id: uid() })).reverse(), ...logs]),
    [logs, setLogs],
  );

  const removeLog = useCallback(
    (id: string) => setLogs(logs.filter((l) => l.id !== id)),
    [logs, setLogs],
  );

  const lastFor = useCallback(
    (exerciseId: string) =>
      [...logs]
        .filter((l) => l.exerciseId === exerciseId)
        .sort((a, b) => b.date.localeCompare(a.date))[0],
    [logs],
  );

  return { logs, addLog, addLogs, removeLog, lastFor };
}

export function describeLog(l: LogEntry) {
  const rest = l.rest != null ? ` · descanso ${l.rest}s` : "";
  if (l.category === "Cardio") {
    return `${l.minutes ?? 0} min · ${l.speed ?? 0} km/h · ${l.incline ?? 0}% inclinación${rest}`;
  }
  const rirStr = l.rir != null ? ` · RIR ${l.rir}` : "";
  return `${l.weight ?? 0} kg · ${l.sets ?? 0} series × ${l.reps ?? 0} reps${rirStr}${rest}`;
}

/** Volumen de un registro de fuerza: peso × series × reps (0 para cardio). */
export function logVolume(l: LogEntry) {
  if (l.category === "Cardio") return 0;
  const weight = l.weight ?? 0;
  const sets = l.sets && l.sets > 0 ? l.sets : 1;
  const reps = l.reps && l.reps > 0 ? l.reps : 1;
  return weight * sets * reps;
}

export type RoutineItem = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  exerciseNameEs?: string;
  exerciseNameEn?: string;
  category: Category;
  weight?: number | undefined;
  sets?: number | undefined;
  reps?: number | undefined;
  minutes?: number | undefined;
  speed?: number | undefined;
  incline?: number | undefined;
  rest?: number | undefined;
  rir?: number | undefined;
};

export type Routine = {
  id: string;
  name: string;
  items: RoutineItem[];
};

export function useRoutines() {
  const [routines, setRoutines] = useStoreValue<Routine[]>(ROUTINE_KEY, []);

  const saveRoutine = useCallback(
    (routine: Routine) => {
      setRoutines((prev) => {
        const exists = prev.some((r) => r.id === routine.id);
        return exists
          ? prev.map((r) => (r.id === routine.id ? routine : r))
          : [...prev, routine];
      });
    },
    [setRoutines],
  );

  const removeRoutine = useCallback(
    (id: string) => setRoutines((prev) => prev.filter((r) => r.id !== id)),
    [setRoutines],
  );

  return { routines, saveRoutine, removeRoutine };
}

export function describeRoutineItem(i: RoutineItem) {
  const rest = i.rest != null ? ` · descanso ${i.rest}s` : "";
  if (i.category === "Cardio") {
    return `${i.minutes ?? 0} min · ${i.speed ?? 0} km/h · ${i.incline ?? 0}%${rest}`;
  }
  const rirStr = i.rir != null ? ` · RIR ${i.rir}` : "";
  return `${i.weight ?? 0} kg · ${i.sets ?? 0} × ${i.reps ?? 0}${rirStr}${rest}`;
}

export type BodyWeightEntry = {
  id: string;
  date: string;
  weight: number;
  /** Altura en cm, usada para calcular el IMC. */
  height?: number | undefined;
  /** Índice de masa corporal. */
  bmi?: number | undefined;
  /** Índice de Masa Libre de Grasa. */
  ffmi?: number | undefined;
  /** Grasa corporal en %. */
  bodyFat?: number | undefined;
  /** Masa muscular en kg. */
  muscleMass?: number | undefined;
};

/** IMC = peso (kg) / altura (m)². */
/** FFMI = masa magra (kg) / altura (m)². Masa magra = peso * (1 - grasa/100). */
export function computeFFMI(weight: number, heightCm: number, bodyFat: number) {
  if (!weight || !heightCm || !bodyFat) return undefined;
  const m = heightCm / 100;
  const leanMass = weight * (1 - bodyFat / 100);
  return Math.round((leanMass / (m * m)) * 10) / 10;
}

export function computeBMI(weight: number, heightCm: number) {
  if (!weight || !heightCm) return undefined;
  const m = heightCm / 100;
  return Math.round((weight / (m * m)) * 10) / 10;
}

export function useBodyWeights() {
  const [entries, setEntries] = useStoreValue<BodyWeightEntry[]>(BODYWEIGHT_KEY, []);

  const addBodyWeight = useCallback(
    (entry: Omit<BodyWeightEntry, "id">) =>
      setEntries([{ ...entry, id: uid() }, ...entries]),
    [entries, setEntries],
  );

  const removeBodyWeight = useCallback(
    (id: string) => setEntries(entries.filter((e) => e.id !== id)),
    [entries, setEntries],
  );

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return { bodyWeights: sorted, latest: sorted[0], addBodyWeight, removeBodyWeight };
}

export function toCSV(logs: LogEntry[]) {
  const headers = [
    "fecha",
    "categoria",
    "ejercicio",
    "peso_kg",
    "series",
    "repeticiones",
    "tiempo_min",
    "velocidad_kmh",
    "inclinacion_pct",
    "descanso_seg",
    "notas",
  ];
  const rows = logs.map((l) => [
    new Date(l.date).toISOString(),
    l.category,
    l.exerciseName,
    l.category === "Cardio" ? "" : (l.weight ?? ""),
    l.category === "Cardio" ? "" : (l.sets ?? ""),
    l.category === "Cardio" ? "" : (l.reps ?? ""),
    l.category === "Cardio" ? (l.minutes ?? "") : "",
    l.category === "Cardio" ? (l.speed ?? "") : "",
    l.category === "Cardio" ? (l.incline ?? "") : "",
    l.rest ?? "",
    l.notes ?? "",
  ]);
  return [headers, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export function downloadCSV(logs: LogEntry[], filename = "entrenamientos.csv") {
  const blob = new Blob(["\ufeff" + toCSV(logs)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
export function useLanguage() {
  const [lang, setLang] = useStoreValue<"es" | "en">(LANGUAGE_KEY, "es");
  return { lang, setLang };
}

export function useLocalizedName() {
  const { lang } = useLanguage();
  return (exercise: { name: string; nameEs?: string; nameEn?: string }) => {
    if (lang === "es") return exercise.nameEs || exercise.name;
    if (lang === "en") return exercise.nameEn || exercise.name;
    return exercise.name;
  };
}

import { DICTIONARY, TranslationKey } from "./i18n";
export function useTranslation() {
  const { lang } = useLanguage();
  return (key: TranslationKey) => DICTIONARY[lang][key] || key;
}
