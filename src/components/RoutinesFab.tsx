import { useState, useEffect } from "react";
import { ListChecks, Plus, Pencil, Trash2, Play, X, Share2, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import { Html5QrcodeScanner } from "html5-qrcode";
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
  DialogDescription,
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
  useLocalizedName, useTranslation,
  useLogs,
  useRoutines,
  type Category,
  type Routine,
  type RoutineItem,
} from "@/lib/gym-store";

const num = (v: string) => (v.trim() === "" ? undefined : Number(v));

export function RoutinesFab({ date }: { date: string }) {
  const getLocalizedName = useLocalizedName();
  const t = useTranslation();
  const { exercises } = useExercises();
  const { routines, saveRoutine, removeRoutine } = useRoutines();
  const { addLogs } = useLogs();

  const [listOpen, setListOpen] = useState(false);

  const [shareRoutine, setShareRoutine] = useState<Routine | null>(null);
  const [scanOpen, setScanOpen] = useState(false);
  
  useEffect(() => {
    if (!scanOpen) return;
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
    scanner.render(
      (text: string) => {
        try {
          const r = JSON.parse(text);
          let importedRoutine = null;
          if (r && r.name && r.items) { // Old format
            importedRoutine = { ...r, id: uid() };
          } else if (r && r.n && r.i) { // New compressed format
            importedRoutine = {
              id: uid(),
              name: r.n,
              items: r.i.map((x: any) => ({
                id: uid(),
                exerciseId: x.e,
                category: x.c,
                ...x
              }))
            };
          }
          
          if (importedRoutine) {
            saveRoutine(importedRoutine);
            toast.success(t("routine_imported"), { description: importedRoutine.name });
            setScanOpen(false);
            scanner?.clear?.();
          } else {
            throw new Error("Formato inválido");
          }
        } catch(e) {
          toast.error(t("invalid_qr"));
        }
      },
      (error: any) => {}
    );
    return () => { scanner.clear().catch(()=>{}); };
  }, [scanOpen, saveRoutine]);

  const [draft, setDraft] = useState<Routine | null>(null);

  function logRoutine(routine: Routine) {
    if (routine.items.length === 0) {
      toast.error(t("routine_no_exercises"));
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
    addLogs(
      routine.items.map((i) => ({
        date: when.toISOString(),
        exerciseId: i.exerciseId,
        exerciseName: getLocalizedName((exercises.find(e => e.id === i.exerciseId) || i) as any),
        category: i.category,
        ...(i.rest == null ? {} : { rest: i.rest }),
        ...(i.category === "Cardio"
          ? { minutes: i.minutes, speed: i.speed, incline: i.incline }
          : { weight: i.weight, sets: i.sets, reps: i.reps }),
      })),
    );
    setListOpen(false);
    toast.success(t("routine_logged"), {
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
            <DialogTitle>{t("my_routines")}</DialogTitle>
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
                        aria-label="Compartir rutina"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShareRoutine(r);
                        }}
                      >
                        <Share2 className="size-4 text-muted-foreground" />
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
            
            {/* Share Routine Dialog */}
            <Dialog open={!!shareRoutine} onOpenChange={(o) => !o && setShareRoutine(null)}>
              <DialogContent className="max-w-sm text-center">
                <DialogHeader>
                  <DialogTitle>{t("share_routine")}</DialogTitle>
                  <DialogDescription>
                    Pide a tu amigo que escanee o pegue este código.
                  </DialogDescription>
                </DialogHeader>
                <div className="mx-auto mt-4 w-full rounded-xl flex flex-col items-center">
                  {shareRoutine && (
                    <>
                      <div className="bg-white p-4 rounded-xl">
                        <QRCode 
                          value={JSON.stringify({
                            n: shareRoutine.name, 
                            i: shareRoutine.items.map(x => {
                              const { id, exerciseId, category, ...rest } = x;
                              return { e: exerciseId, c: category, ...rest };
                            })
                          })} 
                          size={200} 
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-4" 
                        onClick={() => {
                          const payload = JSON.stringify({
                            n: shareRoutine.name, 
                            i: shareRoutine.items.map(x => {
                              const { id, exerciseId, category, ...rest } = x;
                              return { e: exerciseId, c: category, ...rest };
                            })
                          });
                          navigator.clipboard.writeText(payload);
                          toast.success(t("code_copied"));
                        }}
                      >
                        Copiar código de texto
                      </Button>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Scan QR Dialog */}
            <Dialog open={scanOpen} onOpenChange={setScanOpen}>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>{t("scan_routine")}</DialogTitle>
                </DialogHeader>
                <div id="reader" className="mt-4 w-full overflow-hidden rounded-xl bg-muted/50"></div>
                <div className="mt-2 grid gap-2">
                  <p className="text-xs text-center text-muted-foreground mt-2">{t("paste_here")}</p>
                  <Input 
                    placeholder={t("paste_placeholder")} 
                    onChange={(e) => {
                      const text = e.target.value.trim();
                      if (!text) return;
                      try {
                        const r = JSON.parse(text);
                        let importedRoutine = null;
                        if (r && r.name && r.items) {
                          importedRoutine = { ...r, id: uid() };
                        } else if (r && r.n && r.i) {
                          importedRoutine = {
                            id: uid(),
                            name: r.n,
                            items: r.i.map((x: any) => ({
                              id: uid(),
                              exerciseId: x.e,
                              category: x.c,
                              ...x
                            }))
                          };
                        }
                        if (importedRoutine) {
                          saveRoutine(importedRoutine);
                          toast.success(t("routine_imported"), { description: importedRoutine.name });
                          setScanOpen(false);
                        }
                      } catch(err) {
                        // ignore parse errors
                      }
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex gap-2 w-full">
              <Button
                onClick={() => setScanOpen(true)}
                variant="outline"
                className="flex-1"
              >
                <QrCode className="size-4 mr-2" /> Escanear QR
              </Button>
              <Button
                onClick={() => setDraft({ id: uid(), name: "", items: [] })}
                className="flex-1"
              >
                <Plus className="size-4 mr-2" /> Nueva rutina
              </Button>
            </div>

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
  const t = useTranslation();
  const getLocalizedName = useLocalizedName();
  const [name, setName] = useState(routine.name);
  const [items, setItems] = useState<RoutineItem[]>(routine.items);

  const [category, setCategory] = useState<Category>("Pecho");
  const filtered = exercises.filter((e) => e.category === category);
  const [exerciseId, setExerciseId] = useState(filtered[0]?.id ?? "");
  const current = exercises.find((e) => e.id === exerciseId);
  const isCardio = category === "Cardio";

  const [exerciseSelectorOpen, setExerciseSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const visibleExercises = searchQuery.trim()
    ? filtered.filter((e) => e.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : filtered;

  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [minutes, setMinutes] = useState("");
  const [speed, setSpeed] = useState("");
  const [incline, setIncline] = useState("");
  const [rest, setRest] = useState("");
  const [rir, setRir] = useState("");

  const invalid = (v: string, { required = true, min = 1 } = {}) => {
    if (v.trim() === "") return required;
    const n = Number(v);
    return Number.isNaN(n) || n < min;
  };

  const fieldsInvalid = isCardio
    ? invalid(minutes) || invalid(speed) || invalid(incline, { required: false, min: 0 })
    : invalid(weight) || invalid(sets) || invalid(reps);
  const rirInvalid = rir.trim() !== "" && (!Number.isInteger(Number(rir)) || Number(rir) < 0);
  const canAdd = !!current && !fieldsInvalid && !invalid(rest, { required: false }) && !rirInvalid;

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
    setRir("");
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{routine.name ? "Editar rutina" : "Nueva rutina"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>{t("routine_name")}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("routine_name_placeholder")}
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
                    <p className="truncate text-sm font-semibold">{getLocalizedName((exercises.find(e => e.id === i.exerciseId) || i) as any)}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {describeRoutineItem(i)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={t("remove_exercise")}
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
                <Label className="text-xs text-muted-foreground">{t("category")}</Label>
                <Select value={category} onValueChange={(v) => changeCategory(v as Category)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{t(("cat_" + c) as any)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label className="text-xs text-muted-foreground">{t("exercise")}</Label>
                <Button 
                  variant="outline" 
                  className="h-10 w-full justify-start rounded-md font-normal text-sm px-3"
                  onClick={() => setExerciseSelectorOpen(true)}
                >
                  {current?.name || "Selecciona"}
                </Button>
                <Dialog open={exerciseSelectorOpen} onOpenChange={(open) => {
                  setExerciseSelectorOpen(open);
                  if (!open) setSearchQuery("");
                }}>
                  <DialogContent className="max-w-md w-[calc(100vw-1.5rem)] rounded-2xl p-4 sm:p-6 flex flex-col max-h-[85vh]">
                    <DialogHeader className="space-y-3 flex-shrink-0">
                      <DialogTitle>{t("select_exercise")}</DialogTitle>
                      <Input 
                        placeholder={t("search_exercise")} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-xl"
                      />
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto min-h-[300px] mt-2 flex flex-col gap-1 pr-2">
                      {visibleExercises.length > 0 ? (
                        visibleExercises.map((e) => (
                          <button
                            key={e.id}
                            type="button"
                            className={`text-left px-4 py-3 rounded-xl transition-colors ${e.id === exerciseId ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-secondary'}`}
                            onClick={() => {
                              setExerciseId(e.id);
                              setExerciseSelectorOpen(false);
                              setSearchQuery("");
                            }}
                          >
                            {getLocalizedName(e)}
                          </button>
                        ))
                      ) : (
                        <p className="text-center text-sm text-muted-foreground mt-8">{t("no_exercises_found")}</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className={isCardio ? "grid grid-cols-3 gap-2" : "grid grid-cols-2 gap-2"}>
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
                  <MiniField label="RIR (0+)" value={rir} onChange={setRir} />
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
          <div className="grid w-full gap-2">
            {items.length === 0 || !name.trim() ? (
              <p className="text-xs text-muted-foreground">
                {items.length === 0
                  ? t("add_at_least_one")
                  : t("give_name")}
              </p>
            ) : null}
            <Button
              className="w-full"
              onClick={() => {
                if (items.length === 0) {
                  toast.error("Agrega al menos un ejercicio");
                  return;
                }
                if (!name.trim()) {
                  toast.error("Ponle un nombre a la rutina");
                  return;
                }
                onSave({ ...routine, name: name.trim(), items });
              }}
            >
              Guardar rutina
            </Button>
          </div>
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