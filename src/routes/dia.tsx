import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

import { useTranslation, describeLog, useLogs } from "@/lib/gym-store";
import { Button } from "@/components/ui/button";
import { WorkoutCalendar } from "@/components/WorkoutCalendar";

export const Route = createFileRoute("/dia")({
  head: () => ({
    meta: [
      { title: "Registros por día" },
      {
        name: "description",
        content:
          "Consulta los ejercicios registrados de una sola fecha a la vez y navega entre días.",
      },
      { property: "og:title", content: "Registros por día" },
      {
        property: "og:description",
        content: "Los ejercicios de un solo día, con navegación entre fechas.",
      },
    ],
  }),
  component: DiaPage,
});

function toKey(d: Date) {
  return d.toLocaleDateString("sv-SE");
}

function shiftDay(key: string, days: number) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1);
  date.setDate(date.getDate() + days);
  return toKey(date);
}

function DiaPage() {
  const t = useTranslation();
  const { logs, removeLog } = useLogs();
  const [day, setDay] = useState(() => new Date().toISOString().slice(0, 10));

  // Align with the visitor's local date only after hydration to avoid SSR mismatch.
  useEffect(() => {
    setDay(toKey(new Date()));
  }, []);

  const items = useMemo(
    () =>
      logs
        .filter((l) => toKey(new Date(l.date)) === day)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [logs, day],
  );

  const title = useMemo(() => {
    const [y, m, d] = day.split("-").map(Number);
    return new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1).toLocaleDateString("es-MX", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [day]);

  const isToday = day === toKey(new Date());

  return (
    <main className="mx-auto w-full max-w-lg px-4 pt-8">
      <h1 className="text-3xl font-extrabold">{t("day_records")}</h1>
      <p className="mt-1 text-sm capitalize text-muted-foreground">{title}</p>

      <div className="mt-6 flex items-center gap-2">
        <Button
          size="icon"
          variant="secondary"
          aria-label="Día anterior"
          className="size-12 shrink-0 rounded-xl"
          onClick={() => setDay(shiftDay(day, -1))}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <div className="grid flex-1 gap-1">
          <WorkoutCalendar value={day} onChange={setDay} />
        </div>
        <Button
          size="icon"
          variant="secondary"
          aria-label="Día siguiente"
          className="size-12 shrink-0 rounded-xl"
          onClick={() => setDay(shiftDay(day, 1))}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>

      {!isToday && (
        <Button
          variant="ghost"
          className="mt-2 h-10 w-full rounded-xl"
          onClick={() => setDay(toKey(new Date()))}
        >
          Ir a hoy
        </Button>
      )}

      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {items.length} ejercicio{items.length === 1 ? "" : "s"}
      </p>

      <ul className="mt-2 grid gap-2">
        {items.map((l) => (
          <li
            key={l.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold">{l.exerciseName}</p>
              <p className="text-xs text-muted-foreground">{describeLog(l)}</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-wider text-primary">
                {l.category} ·{" "}
                {new Date(l.date).toLocaleTimeString("es-MX", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {l.notes && <p className="mt-1 text-xs text-muted-foreground">{l.notes}</p>}
            </div>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Eliminar registro"
              onClick={() => removeLog(l.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </Button>
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No hay ejercicios registrados en esta fecha.
        </p>
      )}
    </main>
  );
}
