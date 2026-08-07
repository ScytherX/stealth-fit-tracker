import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HeartPulse, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkoutCalendar } from "@/components/WorkoutCalendar";
import { computeBMI, useBodyWeights } from "@/lib/gym-store";

export const Route = createFileRoute("/cuerpo")({
  head: () => ({
    meta: [
      { title: "Cuerpo · Peso, IMC y composición corporal" },
      {
        name: "description",
        content:
          "Registra tu peso corporal, altura, IMC, grasa corporal y masa muscular para seguir tu composición.",
      },
      { property: "og:title", content: "Cuerpo · Composición corporal" },
      {
        property: "og:description",
        content: "Lleva el control de peso, IMC, grasa corporal y masa muscular.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CuerpoPage,
});

function CuerpoPage() {
  const { bodyWeights, latest, addBodyWeight, removeBodyWeight } = useBodyWeights();

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [todayKey, setTodayKey] = useState(() => new Date().toISOString().slice(0, 10));
  useEffect(() => {
    const key = new Date().toLocaleDateString("sv-SE");
    setDate(key);
    setTodayKey(key);
  }, []);

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [muscleMass, setMuscleMass] = useState("");

  // Precarga con el último registro para editar sólo lo que cambió.
  useEffect(() => {
    if (!latest) return;
    setWeight(latest.weight != null ? String(latest.weight) : "");
    setHeight(latest.height != null ? String(latest.height) : "");
    setBodyFat(latest.bodyFat != null ? String(latest.bodyFat) : "");
    setMuscleMass(latest.muscleMass != null ? String(latest.muscleMass) : "");
  }, [latest?.id]);

  const num = (v: string) => {
    const n = Number(v.trim().replace(",", "."));
    return v.trim() === "" || !Number.isFinite(n) ? undefined : n;
  };

  const w = num(weight);
  const h = num(height);
  const bf = num(bodyFat);
  const mm = num(muscleMass);
  const bmi = w != null && h != null ? computeBMI(w, h) : undefined;
  const weightInvalid = weight.trim() !== "" && (w == null || w < 1);
  const heightInvalid = height.trim() !== "" && (h == null || h < 1);
  const bodyFatInvalid = bodyFat.trim() !== "" && (bf == null || bf < 1);
  const muscleMassInvalid = muscleMass.trim() !== "" && (mm == null || mm < 1);
  const canSave = w != null && w >= 1 && h != null && h >= 1 && bf != null && bf >= 1 && mm != null && mm >= 1;

  function handleSave() {
    if (!canSave) {
      toast.error("Peso inválido", { description: "Escribe un número igual o mayor a 1." });
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
    addBodyWeight({
      date: when.toISOString(),
      weight: w,
      ...(h != null ? { height: h } : {}),
      ...(bmi != null ? { bmi } : {}),
      ...(num(bodyFat) != null ? { bodyFat: num(bodyFat) } : {}),
      ...(num(muscleMass) != null ? { muscleMass: num(muscleMass) } : {}),
    });
    toast.success("Medición registrada", {
      description: `${w} kg · ${when.toLocaleDateString("es-MX")}`,
    });
  }

  return (
    <main className="mx-auto w-full max-w-lg px-4 pt-8">
      <h1 className="mb-1 flex items-center gap-2 text-2xl font-bold">
        <HeartPulse className="size-6 text-primary" /> Cuerpo
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Registra tu peso y composición corporal.
      </p>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-lg">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Fecha de la medición</Label>
            <WorkoutCalendar value={date} onChange={setDate} maxDate={todayKey} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumField
              label="Peso (kg)"
              value={weight}
              onChange={setWeight}
              step="0.1"
              invalid={weightInvalid}
            />
            <NumField label="Altura (cm)" value={height} onChange={setHeight} step="0.5" />
            <NumField label="Grasa corporal (%)" value={bodyFat} onChange={setBodyFat} step="0.1" />
            <NumField
              label="Masa muscular (%)"
              value={muscleMass}
              onChange={setMuscleMass}
              step="0.1"
            />
          </div>

          <div className="rounded-xl border border-border bg-background px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">IMC</p>
            <p className="text-2xl font-bold text-primary">
              {bmi != null ? bmi : "—"}
              {bmi != null && (
                <span className="ml-2 text-xs font-medium text-muted-foreground">
                  {bmi < 18.5
                    ? "Bajo peso"
                    : bmi < 25
                      ? "Normal"
                      : bmi < 30
                        ? "Sobrepeso"
                        : "Obesidad"}
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              Se calcula con tu peso y altura.
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={!canSave}
            className="glow-ring h-12 w-full gap-2 rounded-xl text-base font-bold"
          >
            <Save className="size-5" /> Guardar medición
          </Button>
        </div>
      </section>

      {bodyWeights.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Historial corporal
          </h2>
          <ul className="grid gap-2">
            {bodyWeights.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
              >
                <div>
                  <p className="font-semibold">{b.weight} kg</p>
                  <p className="text-xs text-muted-foreground">
                    {[
                      b.bmi != null ? `IMC ${b.bmi}` : null,
                      b.bodyFat != null ? `${b.bodyFat}% grasa` : null,
                      b.muscleMass != null ? `${b.muscleMass}% músculo` : null,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "Sólo peso"}
                  </p>
                </div>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  {new Date(b.date).toLocaleDateString("es-MX")}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Eliminar medición"
                    onClick={() => removeBodyWeight(b.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function NumField({
  label,
  value,
  onChange,
  step,
  invalid = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
  invalid?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label className={invalid ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
        {label}
      </Label>
      <Input
        type="number"
        inputMode="decimal"
        min="1"
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
