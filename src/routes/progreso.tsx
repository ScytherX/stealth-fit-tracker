import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { logVolume, useLogs } from "@/lib/gym-store";
import { ProgressStats } from "@/components/ProgressStats";

export const Route = createFileRoute("/progreso")({
  head: () => ({
    meta: [
      { title: "Progreso y gráficos" },
      {
        name: "description",
        content:
          "Visualiza la evolución de tu fuerza y cardio con gráficos interactivos por ejercicio.",
      },
      { property: "og:title", content: "Progreso y gráficos" },
      {
        property: "og:description",
        content: "Gráficos de evolución por ejercicio, tiempo y velocidad en cardio.",
      },
    ],
  }),
  component: ProgresoPage,
});

type CardioMetric = "minutes" | "speed";

function ProgresoPage() {
  const { logs } = useLogs();
  const [exerciseId, setExerciseId] = useState("");
  const [metric, setMetric] = useState<CardioMetric>("minutes");

  const options = useMemo(() => {
    const map = new Map<string, string>();
    logs.forEach((l) => map.set(l.exerciseId, l.exerciseName));
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [logs]);

  useEffect(() => {
    if (!options.some((o) => o.id === exerciseId)) setExerciseId(options[0]?.id ?? "");
  }, [options, exerciseId]);

  const series = useMemo(() => {
    return logs
      .filter((l) => l.exerciseId === exerciseId)
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((l) => ({
        fecha: new Date(l.date).toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "short",
        }),
        peso: l.weight ?? 0,
        volumen: logVolume(l),
        minutes: l.minutes ?? 0,
        speed: l.speed ?? 0,
        cardio: l.category === "Cardio",
      }));
  }, [logs, exerciseId]);

  const isCardio = series[0]?.cardio ?? false;
  const dataKey = isCardio ? metric : "peso";
  const label = isCardio
    ? metric === "minutes"
      ? "Tiempo (min)"
      : "Velocidad (km/h)"
    : "Peso (kg)";

  return (
    <main className="mx-auto w-full max-w-lg px-4 pt-8">
      <h1 className="text-3xl font-extrabold">Progreso</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Evolución de tu rendimiento a lo largo del tiempo.
      </p>

      <ProgressStats logs={logs} />

      <div className="mt-6 grid gap-2">
        <Label>Ejercicio</Label>
        <Select value={exerciseId} onValueChange={setExerciseId}>
          <SelectTrigger className="h-12 rounded-xl">
            <SelectValue placeholder="Sin registros todavía" />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isCardio && (
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            variant={metric === "minutes" ? "default" : "secondary"}
            onClick={() => setMetric("minutes")}
            className="rounded-full"
          >
            Tiempo
          </Button>
          <Button
            size="sm"
            variant={metric === "speed" ? "default" : "secondary"}
            onClick={() => setMetric("speed")}
            className="rounded-full"
          >
            Velocidad
          </Button>
        </div>
      )}

      <section className="mt-5 rounded-3xl border border-border bg-card p-4">
        {series.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Aún no hay datos. Guarda algunos registros para ver tu progreso.
          </p>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 12, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="fecha"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  name={label}
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--primary)" }}
                />
                {!isCardio && (
                  <Line
                    type="monotone"
                    dataKey="volumen"
                    name="Volumen (kg)"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </main>
  );
}