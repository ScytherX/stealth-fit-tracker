import { useState } from "react";
import { ListChecks, Plus, Pencil, Trash2, Play, X } from "lucide-react";
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
  describeRoutineItem,
  uid,
  useExercises,
  useLogs,
  useRoutines,
  type Category,
  type Routine,
  type RoutineItem,
} from "@/lib/gym-store";

const num = (v: string) => (v.trim() === "" ? undefined : Number(v));

export function RoutinesFab({ date }: { date: string }) {
  const { exercises } = useExercises();
  const { routines, saveRoutine, removeRoutine } = useRoutines();
  const { addLog } = useLogs();

  const [listOpen, setListOpen] = useState(false);
  const [draft, setDraft] = useState<Routine | null>(null);

  function logRoutine(routine: Routine) {
    if (routine.items.length === 0) {
      toast.error("Esta rutina no tiene ejercicios");
      return;
    }
    const now = new Date();
    const [y, m, d] = date.split("-").map(Number);
    const when = new Date(
      y ?? now.getFullYear(),
      (m ?? 1) - 1,
      d ?? now.getDate(),
      now.getHours(),
      now.getMinutes(),
    );
    routine.items.forEach((i) => {
      addLog({
        date: when.toISOString(),
        exerciseId: i.exerciseId,
        exerciseName: i.exerciseName,
        category: i.category,
        ...(i.rest == null ? {} : { rest: i.rest }),
        ...(i.category === "Cardio"
          ? { minutes: i.minutes, speed: i.speed, incline: i.incline }
          : { weight: i.weight, sets: i.sets, reps: i.reps }),
      });
    });
    setListOpen(false);
    toast.success("Rutina registrada", {
      description: `${routine.name} · ${routine.items.length} ejercicios`,
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setListOpen(true)}
        aria-label="Rutinas predefinidas"
        className="glow-ring fixed bottom-24 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform active:scale-95"
      >
        <ListChecks className="size-6" />
      </button>

      <Dialog open={listOpen} onOpenChange={setListOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Mis rutinas</DialogTitle>
          </DialogHeader>

          {routines.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">
              Aún no tienes rutinas. Crea una para registrar varios ejercicios de una sola vez.
            </p>
          ) : (
            <ul className="grid max-h-[50vh] gap-2 overflow-y-auto">
              {routines.map((r) => (
                <li key={r.id} className="rounded-2xl border border-border bg-card p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.items.length} {r.items.length === 1 ? "ejercicio" : "ejercicios"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button size="icon" variant="ghost" aria-label="Editar rutina" onClick={() => setDraft(r)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Eliminar rutina"
                        onClick={() => removeRoutine(r.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                      <Button size="sm" className="gap-1 rounded-full" onClick={() => logRoutine(r)}>
                        <Play className="size-4" /> Registrar
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <DialogFooter>
            <Button
              className="w-full gap-2"
              onClick={() => setDraft({ id: uid(), name: "", items: [] })}
            >
              <Plus className="size-4" /> Nueva rutina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {draft && (
        <RoutineEditor
          routine={draft}
          exercises={exercises}
          onClose={() => setDraft(null)}
          onSave={(r) => {
            saveRoutine(r);
            setDraft(null);
            toast.success("Rutina guardada", { description: r.name });
          }}
        />
      )}
    </>
  );
}

function RoutineEditor({
  routine,
  exercises,
  onClose,
  onSave,
}: {
  routine: Routine;
  exercises: { id: string; name: string; category: Category }[];
  onClose: () => void;
  onSave: (r: Routine) => void;
}) {
  const [name, setName] = useState(routine.name);
  const [items, setItems] = useState<RoutineItem[]>(routine.items);

  const [category, setCategory] = useState<Category>("Pecho");
  const filtered = exercises.filter((e) => e.category === category);
  const [exerciseId, setExerciseId] = useState(filtered[0]?.id ?? "");
  const current = exercises.find((e) => e.id === exerciseId);
  const isCardio = category === "Cardio";

  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [minutes, setMinutes] = useState("");
  const [speed, setSpeed] = useState("");
  const [incline, setIncline] = useState("");
  const [rest, setRest] = useState("");

  const invalid = (v: string, { required = true, min = 1 } = {}) => {
    if (v.trim() === "") return required;
    const n = Number(v);
    return Number.isNaN(n) || n < min;
  };

  const fieldsInvalid = isCardio
    ? invalid(minutes) || invalid(speed) || invalid(incline, { required: false, min: 0 })
    : invalid(weight) || invalid(sets) || invalid(reps);
  const canAdd = !!current && !fieldsInvalid && !invalid(rest, { required: false });

  function changeCategory(c: Category) {
    setCategory(c);
    setExerciseId(exercises.find((e) => e.category === c)?.id ?? "");
  }

  function addItem() {
    if (!current) return;
    setItems([
      ...items,
      {
        id: uid(),
        exerciseId: current.id,
        exerciseName: current.name,
        category: current.category,
        ...(rest.trim() === "" ? {} : { rest: num(rest) }),
        ...(current.category === "Cardio"
          ? { minutes: num(minutes), speed: num(speed), incline: num(incline) }
          : { weight: num(weight), sets: num(sets), reps: num(reps) }),
      },
    ]);
    setWeight("");
    setSets("");
    setReps("");
    setMinutes("");
    setSpeed("");
    setIncline("");
    setRest("");
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>{routine.name ? "Editar rutina" : "Nueva rutina"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Nombre de la rutina</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Día de empuje"
            />
          </div>

          {items.length > 0 && (
            <ul className="grid gap-2">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{i.exerciseName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {describeRoutineItem(i)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Quitar ejercicio"
                    onClick={() => setItems(items.filter((x) => x.id !== i.id))}
                  >
                    <X className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <div className="grid gap-3 rounded-2xl border border-dashed border-border p-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">Categoría</Label>
                <Select value={category} onValueChange={(v) => changeCategory(v as Category)}>
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
              <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">Ejercicio</Label>
                <Select value={exerciseId} onValueChange={setExerciseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
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
            </div>

            <div className="grid grid-cols-3 gap-2">
              {isCardio ? (
                <>
                  <MiniField label="Min" value={minutes} onChange={setMinutes} />
                  <MiniField label="km/h" value={speed} onChange={setSpeed} step="0.1" />
                  <MiniField label="Incl. %" value={incline} onChange={setIncline} step="0.5" />
                </>
              ) : (
                <>
                  <MiniField label="Kg" value={weight} onChange={setWeight} step="0.5" />
                  <MiniField label="Series" value={sets} onChange={setSets} />
                  <MiniField label="Reps" value={reps} onChange={setReps} />
                </>
              )}
            </div>
            <MiniField label="Descanso (seg, opcional)" value={rest} onChange={setRest} />

            <Button variant="secondary" className="gap-2" onClick={addItem} disabled={!canAdd}>
              <Plus className="size-4" /> Agregar ejercicio
            </Button>
            {!fieldsInvalid ? null : (
              <p className="text-xs text-muted-foreground">
                Completa los valores con un número igual o mayor a 1.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            disabled={!name.trim() || items.length === 0}
            onClick={() => onSave({ ...routine, name: name.trim(), items })}
          >
            Guardar rutina
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MiniField({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
}) {
  return (
    <div className="grid gap-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type="number"
        inputMode="decimal"
        min="1"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-xl text-center font-semibold"
      />
    </div>
  );
}