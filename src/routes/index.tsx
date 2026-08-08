import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Flame } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  describeLog,
  useExercises,
  useLogs,
  type Category,
} from "@/lib/gym-store";
import { WorkoutCalendar } from "@/components/WorkoutCalendar";
import { RoutinesFab } from "@/components/RoutinesFab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ejercicios · Registrar entrenamiento" },
      {
        name: "description",
        content:
          "Registra series, repeticiones, peso y cardio con autocompletado de tu última sesión.",
      },
      { property: "og:title", content: "Ejercicios · Registrar entrenamiento" },
      {
        property: "og:description",
        content: "Tu diario de gimnasio para registrar fuerza y cardio.",
      },
    ],
  }),
  component: RegistroPage,
});

function RegistroPage() {
  const { exercises, addExercise } = useExercises();
  const { logs, addLog, lastFor } = useLogs();

  const [category, setCategory] = useState<Category>("Pecho");
  const [exerciseId, setExerciseId] = useState<string>("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [todayKey, setTodayKey] = useState(() => new Date().toISOString().slice(0, 10));

  // Align with the visitor's local date only after hydration to avoid SSR mismatch.
  useEffect(() => {
    const key = new Date().toLocaleDateString("sv-SE");
    setDate(key);
    setTodayKey(key);
  }, []);
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [minutes, setMinutes] = useState("");
  const [speed, setSpeed] = useState("");
  const [incline, setIncline] = useState("");
  const [rest, setRest] = useState("");

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("Pecho");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(
    () => exercises.filter((e) => e.category === category),
    [exercises, category],
  );

  useEffect(() => {
    if (!filtered.some((e) => e.id === exerciseId)) {
      setExerciseId(filtered[0]?.id ?? "");
    }
  }, [filtered, exerciseId]);

  const isCardio = category === "Cardio";
  const last = exerciseId ? lastFor(exerciseId) : undefined;

  useEffect(() => {
    if (!last) {
      setWeight("");
      setSets("");
      setReps("");
      setMinutes("");
      setSpeed("");
      setIncline("");
      setRest("");
      return;
    }
    setWeight(last.weight != null ? String(last.weight) : "");
    setSets(last.sets != null ? String(last.sets) : "");
    setReps(last.reps != null ? String(last.reps) : "");
    setMinutes(last.minutes != null ? String(last.minutes) : "");
    setSpeed(last.speed != null ? String(last.speed) : "");
    setIncline(last.incline != null ? String(last.incline) : "");
    setRest(last.rest != null ? String(last.rest) : "");
  }, [last?.id, exerciseId]);

  const num = (v: string) => {
    const n = v.trim() === "" ? undefined : Number(v);
    if (n === undefined) return undefined;
    return n;
  };

  const isInvalid = (v: string) => {
    const n = Number(v);
    return v.trim() === "" || !Number.isFinite(n) || n < 1;
  };

  const activeFields = isCardio ? [minutes, speed, incline] : [weight, sets, reps];
  const restInvalid = rest.trim() !== "" && isInvalid(rest);
  const hasInvalid = activeFields.some(isInvalid) || restInvalid;

  function handleSave() {
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (!exercise || hasInvalid) return;
    const now = new Date();
    const [y, m, d] = date.split("-").map(Number);
    const when = new Date(
      y ?? now.getFullYear(),
      (m ?? 1) - 1,
      d ?? now.getDate(),
      now.getHours(),
      now.getMinutes(),
    );
    addLog({
      date: when.toISOString(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      category: exercise.category,
      ...(rest.trim() === "" ? {} : { rest: num(rest) }),
      ...(exercise.category === "Cardio"
        ? { minutes: num(minutes), speed: num(speed), incline: num(incline) }
        : { weight: num(weight), sets: num(sets), reps: num(reps) }),
    });
    toast.success("Registro guardado", {
      description: `${exercise.name} · ${when.toLocaleDateString("es-MX")}`,
    });
  }

  function handleCreateExercise() {
    if (!newName.trim()) return;
    const ex = addExercise(newName, newCategory);
    setCategory(newCategory);
    setExerciseId(ex.id);
    setNewName("");
    setDialogOpen(false);
    toast.success("Ejercicio creado", { description: ex.name });
  }

  const recent = logs.slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-lg px-4 pt-8">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-lg">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Fecha del entrenamiento</Label>
            <WorkoutCalendar
              value={date}
              onChange={setDate}
              maxDate={todayKey}
            />
            <p className="text-xs text-muted-foreground">
              Puedes registrar entrenamientos de días anteriores.
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Grupo muscular / Categoría</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Ejercicio</Label>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-primary">
                    <Plus className="size-4" /> Nuevo
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Nuevo ejercicio</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Nombre</Label>
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Ej. Press inclinado con mancuernas"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Categoría</Label>
                      <Select
                        value={newCategory}
                        onValueChange={(v) => setNewCategory(v as Category)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateExercise}>Guardar ejercicio</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Select value={exerciseId} onValueChange={setExerciseId}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selecciona un ejercicio" />
              </SelectTrigger>
              <SelectContent>
                {filtered.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isCardio ? (
            <div className="grid grid-cols-3 gap-3">
              <Field label="Tiempo (min)" value={minutes} onChange={setMinutes} invalid={isInvalid(minutes)} />
              <Field label="Velocidad (km/h)" value={speed} onChange={setSpeed} step="0.1" invalid={isInvalid(speed)} />
              <Field label="Inclinación (%)" value={incline} onChange={setIncline} step="0.5" invalid={isInvalid(incline)} />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <Field label="Peso (kg)" value={weight} onChange={setWeight} step="0.5" invalid={isInvalid(weight)} />
              <Field label="Series" value={sets} onChange={setSets} invalid={isInvalid(sets)} />
              <Field label="Repeticiones" value={reps} onChange={setReps} invalid={isInvalid(reps)} />
            </div>
          )}

          <div className="grid gap-2">
              <Field
                label="Descanso entre series (seg)"
                value={rest}
                onChange={setRest}
                invalid={restInvalid}
              />
            <p className="text-xs text-muted-foreground">Opcional.</p>
          </div>

          {hasInvalid && (
            <p className="text-xs font-medium text-destructive">
              Todos los campos deben tener un valor de 1 o mayor.
            </p>
          )}

          {last && (
            <p className="text-xs text-muted-foreground">
              Tu último entrenamiento fue:{" "}
              <span className="text-primary">{describeLog(last)}</span> ·{" "}
              {new Date(last.date).toLocaleDateString("es-MX")}
            </p>
          )}

          <Button
            onClick={handleSave}
            disabled={!exerciseId || hasInvalid}
            className="glow-ring h-12 w-full gap-2 rounded-xl text-base font-bold"
          >
            <Save className="size-5" /> Guardar registro
          </Button>
        </div>
      </section>

      <WeeklySummary logs={logs} />

      {recent.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            <Flame className="size-4 text-primary" /> Últimos registros
          </h2>
          <ul className="grid gap-2">
            {recent.map((l) => (
              <li
                key={l.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="font-semibold">{l.exerciseName}</p>
                  <p className="text-xs text-muted-foreground">{describeLog(l)}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(l.date).toLocaleDateString("es-MX")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <RoutinesFab date={date} />
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  step,
  min = "1",
  invalid = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
  min?: string;
  invalid?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label className={invalid ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
        {label}
      </Label>
      <Input
        inputMode="decimal"
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        className={
          "h-12 rounded-xl text-center text-lg font-semibold " +
          (invalid
            ? "border-destructive text-destructive ring-2 ring-destructive/40 focus-visible:ring-destructive"
            : "")
        }
      />
    </div>
  );
}