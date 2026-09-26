import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Flame, MessageSquare, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  CATEGORIES,
  describeLog,
  useExercises,
  useLocalizedName, useTranslation,
  useLogs,
  type Category,
} from "@/lib/gym-store";
import { WorkoutCalendar } from "@/components/WorkoutCalendar";
import { RoutinesFab } from "@/components/RoutinesFab";
import { CategorySelector } from "@/components/CategorySelector";

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
  const getLocalizedName = useLocalizedName();
  const t = useTranslation();
  const [exerciseId, setExerciseId] = useState<string>("");
  const [comboboxOpen, setComboboxOpen] = useState(false);
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

  const clearFields = () => {
    setWeight("");
    setSets("");
    setReps("");
    setMinutes("");
    setSpeed("");
    setIncline("");
    setRest("");
  };

  // Los campos siempre inician vacíos; no se prellenan con el último registro.
  useEffect(() => {
    clearFields();
  }, [exerciseId, category]);


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
      exerciseName: getLocalizedName(exercise as any),
      category: exercise.category,
      ...(rest.trim() === "" ? {} : { rest: num(rest) }),
      ...(exercise.category === "Cardio"
        ? { minutes: num(minutes), speed: num(speed), incline: num(incline) }
        : { weight: num(weight), sets: num(sets), reps: num(reps) }),
    });
    clearFields();
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
    toast.success("Ejercicio creado", { description: getLocalizedName(ex as any) });
  }

  const recent = logs.slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-lg px-4 pt-8">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-lg">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>{t("workout_date")}</Label>
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
            <Label>{t("muscle_category")}</Label>
            <CategorySelector value={category} onChange={setCategory} />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>{t("exercise")}</Label>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-primary">
                    <Plus className="size-4" /> {t("new")}</Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>{t("new_exercise")}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>{t("name")}</Label>
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Ej. Press inclinado con mancuernas"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>{t("category")}</Label>
                      <Select
                        value={newCategory}
                        onValueChange={(v) => setNewCategory(v as Category)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper" align="center">
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
                    <Button onClick={handleCreateExercise}>{t("save")}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <>
              <Button
                variant="outline"
                role="combobox"
                onClick={() => setComboboxOpen(true)}
                className="h-12 rounded-xl w-full justify-between font-normal overflow-hidden max-w-full"
              >
                <span className="truncate flex-1 text-left min-w-0">
                  {exerciseId
                    ? getLocalizedName((exercises.find((e) => e.id === exerciseId) || filtered[0]) as any)
                    : t("select_exercise")}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
              <CommandDialog open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <CommandInput placeholder={t("search_exercise")} />
                <CommandList>
                  <CommandEmpty>{t("no_exercises_found")}</CommandEmpty>
                  <CommandGroup>
                    {filtered.map((e) => (
                      <CommandItem
                        key={e.id}
                        value={getLocalizedName(e as any)}
                        onSelect={() => {
                          setExerciseId(e.id);
                          setComboboxOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                              "mr-2 h-4 w-4 shrink-0",
                              exerciseId === e.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="truncate flex-1">{getLocalizedName(e as any)}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </CommandDialog>
            </>
          </div>

          {isCardio ? (
            <div className="grid grid-cols-3 gap-3">
              <Field label={t("time_min")} value={minutes} onChange={setMinutes} invalid={isInvalid(minutes)} />
              <Field label={t("speed_kmh")} value={speed} onChange={setSpeed} step="0.1" invalid={isInvalid(speed)} />
              <Field label={t("incline_pct")} value={incline} onChange={setIncline} step="0.5" invalid={isInvalid(incline)} />
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