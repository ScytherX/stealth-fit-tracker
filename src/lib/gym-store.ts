import { useCallback, useEffect, useState } from "react";

export type Category = "Pecho" | "Espalda" | "Piernas" | "Hombros" | "Brazos" | "Cardio";

export const CATEGORIES: Category[] = [
  "Pecho",
  "Espalda",
  "Piernas",
  "Hombros",
  "Brazos",
  "Cardio",
];

export type Exercise = {
  id: string;
  name: string;
  category: Category;
  custom?: boolean;
};

export type LogEntry = {
  id: string;
  date: string;
  exerciseId: string;
  exerciseName: string;
  category: Category;
  weight?: number | undefined;
  sets?: number | undefined;
  reps?: number | undefined;
  minutes?: number | undefined;
  speed?: number | undefined;
  incline?: number | undefined;
  rest?: number | undefined;
  notes?: string | undefined;
};

export const DEFAULT_EXERCISES: Exercise[] = [
  { id: "press-banca", name: "Press de banca", category: "Pecho" },
  { id: "aperturas", name: "Aperturas", category: "Pecho" },
  { id: "fondos", name: "Fondos", category: "Pecho" },
  { id: "dominadas", name: "Dominadas", category: "Espalda" },
  { id: "remo-barra", name: "Remo con barra", category: "Espalda" },
  { id: "jalon-pecho", name: "Jalón al pecho", category: "Espalda" },
  { id: "sentadillas", name: "Sentadillas", category: "Piernas" },
  { id: "prensa", name: "Prensa", category: "Piernas" },
  { id: "peso-muerto-rumano", name: "Peso muerto rumano", category: "Piernas" },
  { id: "press-militar", name: "Press militar", category: "Hombros" },
  { id: "elevaciones-laterales", name: "Elevaciones laterales", category: "Hombros" },
  { id: "curl-biceps", name: "Curl de bíceps", category: "Brazos" },
  { id: "extension-triceps", name: "Extensión de tríceps", category: "Brazos" },
  { id: "caminadora", name: "Caminadora", category: "Cardio" },
];

const EX_KEY = "gymlog.customExercises.v1";
const LOG_KEY = "gymlog.logs.v1";
const ROUTINE_KEY = "gymlog.routines.v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("gymlog:change"));
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function useStoreValue<T>(key: string, fallback: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    const sync = () => setValue(read<T>(key, fallback));
    sync();
    window.addEventListener("gymlog:change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("gymlog:change", sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (v: T) => {
      write(key, v);
      setValue(v);
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
  return `${l.weight ?? 0} kg · ${l.sets ?? 0} series × ${l.reps ?? 0} reps${rest}`;
}

/** Volumen de un registro de fuerza: peso × series × reps (0 para cardio). */
export function logVolume(l: LogEntry) {
  if (l.category === "Cardio") return 0;
  const weight = l.weight ?? 0;
  const sets = l.sets && l.sets > 0 ? l.sets : 1;
  const reps = l.reps && l.reps > 0 ? l.reps : 1;
  return weight * sets * reps;
}

function describeLogLegacy(l: LogEntry) {
  const rest = l.rest != null ? ` · descanso ${l.rest}s` : "";
  if (l.category === "Cardio") {
    return `${l.minutes ?? 0} min · ${l.speed ?? 0} km/h · ${l.incline ?? 0}% inclinación${rest}`;
  }
  return `${l.weight ?? 0} kg · ${l.sets ?? 0} series × ${l.reps ?? 0} reps${rest}`;
}

export type RoutineItem = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  category: Category;
  weight?: number | undefined;
  sets?: number | undefined;
  reps?: number | undefined;
  minutes?: number | undefined;
  speed?: number | undefined;
  incline?: number | undefined;
  rest?: number | undefined;
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
      const exists = routines.some((r) => r.id === routine.id);
      setRoutines(
        exists ? routines.map((r) => (r.id === routine.id ? routine : r)) : [...routines, routine],
      );
    },
    [routines, setRoutines],
  );

  const removeRoutine = useCallback(
    (id: string) => setRoutines(routines.filter((r) => r.id !== id)),
    [routines, setRoutines],
  );

  return { routines, saveRoutine, removeRoutine };
}

export function describeRoutineItem(i: RoutineItem) {
  const rest = i.rest != null ? ` · descanso ${i.rest}s` : "";
  if (i.category === "Cardio") {
    return `${i.minutes ?? 0} min · ${i.speed ?? 0} km/h · ${i.incline ?? 0}%${rest}`;
  }
  return `${i.weight ?? 0} kg · ${i.sets ?? 0} × ${i.reps ?? 0}${rest}`;
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