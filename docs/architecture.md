# Stealth Fit Tracker — Architecture Document

This document explains the purpose and function of every major element in the project, organized by the architecture tree below. Each entry includes its file location and a plain-language description of what it does and why it exists.

```
Stealth Fit Tracker
│
├── UI
│   ├── Navigation
│   ├── Exercise Form
│   ├── History
│   └── Progress
│
├── Business Logic
│   ├── Workout tracking
│   ├── Exercise management
│   └── Progress calculations
│
├── Data
│   ├── Exercises
│   └── Workout records
│
└── Tests
```

---

## UI

The UI layer contains everything the user sees and interacts with. It is built with React and TanStack Router, split into **routes** (full pages) and **components** (reusable building blocks).

---

### Navigation

Navigation gives the user the ability to move between the five main sections of the app.

#### `src/routes/__root.tsx`
The root layout that wraps every page. It renders the global header, the notification toaster, and the `<Outlet />` placeholder where child routes are injected. It also defines the HTML shell (`<html>`, `<head>`, `<body>`), global meta tags, font links, and the `404 / error` fallback screens.

#### `src/components/AppHeader.tsx`
A fixed hamburger menu button in the top-left corner. When tapped, it slides in a drawer panel from the left side of the screen. The drawer lists all five navigation destinations (Ejercicios, Cuerpo, Por día, Progreso, Historial) with their icons. It uses a CSS `:target` trick — no JavaScript needed to open or close the overlay — which keeps it lightweight and accessible.

#### `src/components/BottomNav.tsx`
A persistent bottom navigation bar, visible on all pages. It shows the same five destinations as the drawer but as a compact icon + label strip. Designed for thumb-friendly one-handed use on mobile. The active route is highlighted automatically via TanStack Router's `activeProps`.

#### `src/router.tsx`
Bootstraps the TanStack Router instance and attaches a shared `QueryClient` (for potential async data fetching). Also installs the chunk-recovery handler so that if a JavaScript code-split chunk fails to load (e.g., after a deploy), the app silently retries rather than showing a blank screen.

#### `src/routeTree.gen.ts`
Auto-generated file produced by TanStack Router's file-based routing. Maps each file in `src/routes/` to its URL path. **Do not edit by hand** — it regenerates whenever routes change.

---

### Exercise Form

The exercise form is the core of the app: it is where users log individual workouts.

#### `src/routes/index.tsx` — `RegistroPage`
The home page (`/`). Presents a card-based form where the user picks a date, selects a muscle group and exercise, enters performance data (weight / sets / reps for strength, or time / speed / incline for cardio), and optionally logs rest time. Hitting **Guardar registro** writes the entry to local storage and shows a toast confirmation. The last four saved entries appear below the form for quick reference.

Key behaviors:
- Fields start empty on every new exercise selection, so the user always enters fresh data.
- A hint line shows the stats from the user's most recent session for that same exercise, making it easy to compare.
- Validation prevents saving if any required field is below 1 or non-numeric.
- The **+ Nuevo** button opens an inline dialog to create a custom exercise on the fly.

#### `src/components/CategorySelector.tsx`
A 3 × 2 grid of icon buttons (Pecho, Espalda, Piernas, Hombros, Brazos, Cardio). Each icon is a custom inline SVG that visually represents the muscle group. Selecting a category instantly filters the exercise dropdown on the form. This is a controlled component — it receives `value` and `onChange` as props.

#### `src/components/WorkoutCalendar.tsx`
A date-picker disguised as a button. Tapping it opens a modal calendar that shows the current month. Days that already have logged workouts display small colored dots, one per muscle-group category. The user can navigate between months, and a `maxDate` prop prevents selecting future dates (used on the logging form). Imported by three different pages (index, historial, dia).

#### `src/components/RoutinesFab.tsx`
A floating action button (the circular button above the bottom nav on the home page). Tapping it opens a dialog that lists all saved routines. From there the user can:
- **Registrar** a routine — logs all its exercises at once to the selected date.
- **Editar** a routine — opens a second dialog (`RoutineEditor`) to rename it or add/remove exercises.
- **Eliminar** a routine permanently.
- Create a **Nueva rutina** from scratch.

`RoutineEditor` is an inner component in the same file. It reuses the same category + exercise selectors and numeric fields as the main form.

---

### History

The history section lets users review and manage past workout entries.

#### `src/routes/historial.tsx` — `HistorialPage`
Located at `/historial`. Displays all logged entries grouped by date in reverse chronological order. Offers two filters:
1. **Category filter** — a dropdown to narrow down to one muscle group or show all.
2. **Date filter** — the `WorkoutCalendar` component to zoom into a specific day.

Each entry card shows the exercise name, performance summary, category, and time. A trash-can button deletes individual entries. An **Exportar datos (CSV)** button downloads the currently filtered results as a UTF-8 CSV file (compatible with Excel and Google Sheets).

#### `src/routes/dia.tsx` — `DiaPage`
Located at `/dia`. Shows all exercises logged on a single selected day. Left/right arrow buttons let the user step one day backward or forward without opening the calendar. A **Ir a hoy** link snaps back to the current date. Useful for reviewing the complete workout of a past session at a glance.

---

### Progress

The progress section visualizes performance trends over time.

#### `src/routes/progreso.tsx` — `ProgresoPage`
Located at `/progreso`. Contains two interactive line charts (powered by Recharts):

1. **Exercise progress chart** — the user picks any exercise they have logged. For strength exercises the chart plots weight (kg) over time, with a dashed secondary line for total volume (kg × sets × reps). For cardio exercises, toggle buttons switch between time (minutes) and speed (km/h).
2. **Body weight chart** — plots all body-weight measurements over time.

The `ProgressStats` summary card group appears at the top of this page.

#### `src/components/ProgressStats.tsx`
Four summary stat cards displayed on the Progress page:
- **Récord de peso** — the single heaviest weight ever lifted, and the exercise it was set on.
- **Volumen total** — sum of weight × sets × reps across all strength sessions.
- **Racha actual** — how many consecutive days the user has trained (counts yesterday as "today" if today has no entry yet).
- **Días entrenados** — total number of distinct calendar days with at least one log entry.

#### `src/components/WeeklySummary.tsx`
A summary card comparing the current week against the previous week. Shows days trained and total lifting volume, with a trend arrow (up / down / flat) and a call-out for the most-worked muscle group this week. Not currently embedded in any page — it exists as a ready-to-use component.

#### `src/routes/cuerpo.tsx` — `CuerpoPage`
Located at `/cuerpo`. A form to log body composition measurements: weight (kg), height (cm), body fat (%), and muscle mass (%). The app computes BMI automatically and displays a classification label (Bajo peso / Normal / Sobrepeso / Obesidad). Past measurements appear in a scrollable list below the form, each deletable.

---

## Business Logic

Business logic lives in `src/lib/gym-store.ts`. This single file acts as the entire state management layer — no external state library is needed. It exposes custom React hooks that read from and write to `localStorage`, and fires a `gymlog:change` custom event so that all open tabs or components stay in sync.

---

### Workout tracking

#### `useLogs()` — `src/lib/gym-store.ts`
The primary hook for all workout log entries. Returns:
- `logs` — the full array of `LogEntry` records, newest first.
- `addLog(entry)` — prepends one new entry.
- `addLogs(entries[])` — bulk-prepends multiple entries (used when logging a full routine).
- `removeLog(id)` — deletes a single entry by ID.
- `lastFor(exerciseId)` — returns the most recent log for a given exercise (used to display the "last session" hint on the form).

Data is persisted under the key `gymlog.logs.v1` in `localStorage`.

#### `useRoutines()` — `src/lib/gym-store.ts`
Manages saved routines. Returns:
- `routines` — array of `Routine` objects. Each routine has a name and a list of `RoutineItem` entries (exercise + pre-set parameters).
- `saveRoutine(routine)` — creates or updates a routine (upsert by ID).
- `removeRoutine(id)` — deletes a routine.

Data is persisted under `gymlog.routines.v1`.

#### `useBodyWeights()` — `src/lib/gym-store.ts`
Manages body composition history. Returns sorted entries (newest first), the `latest` entry (pre-loaded into the form for easy editing), `addBodyWeight`, and `removeBodyWeight`.

Data is persisted under `gymlog.bodyweights.v1`.

#### `toCSV(logs)` / `downloadCSV(logs, filename)` — `src/lib/gym-store.ts`
Pure utility functions. `toCSV` serializes an array of `LogEntry` objects into a comma-separated string with 11 columns (date, category, exercise, weight, sets, reps, time, speed, incline, rest, notes). `downloadCSV` wraps the string in a Blob, creates a temporary `<a>` element, and triggers a browser download. A UTF-8 BOM (`\ufeff`) is prepended so Excel opens the file with correct encoding.

---

### Exercise management

#### `useExercises()` — `src/lib/gym-store.ts`
Merges the built-in exercise list (`DEFAULT_EXERCISES`) with any user-created custom exercises stored under `gymlog.customExercises.v1`. Returns:
- `exercises` — combined list of all exercises.
- `customExercises` — only the user-created ones.
- `addExercise(name, category)` — creates a new custom exercise with a generated ID and `custom: true` flag.
- `removeExercise(id)` — removes a custom exercise (built-in exercises cannot be removed).

#### `DEFAULT_EXERCISES` — `src/lib/gym-store.ts`
A hardcoded array of 14 exercises spread across all six categories. These are always available and never stored in `localStorage`. Example:

```ts
{ id: "press-banca", name: "Press de banca", category: "Pecho" }
```

#### `CATEGORIES` — `src/lib/gym-store.ts`
The master list of the six muscle-group categories: `"Pecho"`, `"Espalda"`, `"Piernas"`, `"Hombros"`, `"Brazos"`, `"Cardio"`. Used throughout the app to filter exercises, colour calendar dots, and populate dropdowns.

---

### Progress calculations

#### `logVolume(entry)` — `src/lib/gym-store.ts`
Calculates the training volume for a single strength log entry as `weight × sets × reps`. Returns `0` for cardio entries. Used by `ProgressStats` and `WeeklySummary` to aggregate total volume.

#### `describeLog(entry)` — `src/lib/gym-store.ts`
Produces a human-readable summary string for a log entry. For strength: `"80 kg · 4 series × 10 reps · descanso 90s"`. For cardio: `"30 min · 8 km/h · 1% inclinación"`. Used in every list view that shows log cards.

#### `computeBMI(weight, heightCm)` — `src/lib/gym-store.ts`
Calculates Body Mass Index as `weight (kg) / height (m)²`, rounded to one decimal place. Used live on the Cuerpo page as the user types.

#### `streak(logs)` — inside `src/components/ProgressStats.tsx`
A local helper function (not exported). Counts consecutive days with at least one workout, walking backward from today. If today has no entry yet, it starts counting from yesterday, so an early-morning check does not break the streak.

---

## Data

All data is stored **client-side only**, in the browser's `localStorage`. There is no backend, no database, and no network calls for user data. Everything is scoped to the device.

---

### Exercises

#### Type `Exercise` — `src/lib/gym-store.ts`
```ts
type Exercise = {
  id: string;        // URL-friendly slug (built-in) or random ID (custom)
  name: string;      // Display name shown in dropdowns
  category: Category;
  custom?: boolean;  // true only for user-created exercises
};
```

#### Type `RoutineItem` — `src/lib/gym-store.ts`
A snapshot of an exercise with its default parameters inside a routine. Mirrors the fields of `LogEntry` but without a date or log-specific ID. When a routine is logged, each `RoutineItem` becomes a `LogEntry`.

#### Type `Routine` — `src/lib/gym-store.ts`
```ts
type Routine = {
  id: string;
  name: string;
  items: RoutineItem[];
};
```

---

### Workout records

#### Type `LogEntry` — `src/lib/gym-store.ts`
The core data record for a single logged exercise session.
```ts
type LogEntry = {
  id: string;
  date: string;           // ISO 8601 timestamp
  exerciseId: string;
  exerciseName: string;   // Denormalized for display without joining
  category: Category;
  // Strength fields (undefined for cardio):
  weight?: number;
  sets?: number;
  reps?: number;
  // Cardio fields (undefined for strength):
  minutes?: number;
  speed?: number;
  incline?: number;
  // Shared optional:
  rest?: number;
  notes?: string;
};
```
`exerciseName` is stored alongside `exerciseId` so that renaming or deleting an exercise does not corrupt historical records.

#### Type `BodyWeightEntry` — `src/lib/gym-store.ts`
```ts
type BodyWeightEntry = {
  id: string;
  date: string;
  weight: number;
  height?: number;     // cm — used to compute BMI
  bmi?: number;
  bodyFat?: number;    // %
  muscleMass?: number; // %
};
```

#### `useStoreValue<T>(key, fallback)` — `src/lib/gym-store.ts`
A private generic hook (not exported) that all the public hooks are built on. It reads from `localStorage` on mount and subscribes to two events — `gymlog:change` (fired internally after every write) and the native `storage` event (fires when another browser tab writes). This keeps all components synchronized without a global state manager like Redux or Zustand.

#### `uid()` — `src/lib/gym-store.ts`
Generates a short collision-resistant ID using `Math.random()` combined with `Date.now()`, both encoded in base-36. Used to assign IDs to new log entries, exercises, and routines.

---

## Tests

No automated tests are currently present in the project. The codebase is structured in a way that makes testing straightforward:

- **Business logic** (`src/lib/gym-store.ts`) is made up of pure functions (`logVolume`, `describeLog`, `computeBMI`, `toCSV`, `uid`) and React hooks. The pure functions can be unit-tested directly. The hooks can be tested with React Testing Library's `renderHook` against a mock `localStorage`.
- **UI components** are standard React components with no side-effect dependencies beyond the store hooks, making them good candidates for component tests with React Testing Library.
- **Route pages** can be tested with integration tests using a memory router from TanStack Router.

Recommended tools for this stack: **Vitest** (test runner, compatible with Vite), **@testing-library/react** (component and hook tests), **@testing-library/user-event** (simulating user interactions).
