import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { WorkoutCalendar } from "@/components/WorkoutCalendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, describeLog, downloadCSV, useLogs, type Category } from "@/lib/gym-store";

export const Route = createFileRoute("/historial")({
  head: () => ({
    meta: [
      { title: "Historial y exportación CSV" },
      {
        name: "description",
        content:
          "Consulta todo tu historial de entrenamientos y expórtalo a CSV con columnas de fuerza y cardio.",
      },
      { property: "og:title", content: "Historial y exportación CSV" },
      {
        property: "og:description",
        content: "Tu historial completo, filtrable y exportable a CSV.",
      },
    ],
  }),
  component: HistorialPage,
});

function HistorialPage() {
  const { logs, removeLog } = useLogs();
  const [filter, setFilter] = useState<Category | "Todas">("Todas");
  const [day, setDay] = useState("");
  const [defaultDay, setDefaultDay] = useState("");

  useEffect(() => {
    setDefaultDay(new Date().toLocaleDateString("sv-SE"));
  }, []);

  const filtered = useMemo(
    () =>
      logs.filter(
        (l) =>
          (filter === "Todas" || l.category === filter) &&
          (day === "" || new Date(l.date).toLocaleDateString("sv-SE") === day),
      ),
    [logs, filter, day],
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach((l) => {
        const key = new Date(l.date).toLocaleDateString("sv-SE");
        map.set(key, [...(map.get(key) ?? []), l]);
      });
    return [...map.entries()];
  }, [filtered]);

  return (
    <main className="mx-auto w-full max-w-lg px-4 pt-8">
      <h1 className="text-3xl font-extrabold">Historial</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {logs.length} registro{logs.length === 1 ? "" : "s"} guardados en este dispositivo.
      </p>

      <div className="mt-6 grid gap-2">
        <Label>Filtrar por categoría</Label>
        <Select value={filter} onValueChange={(v) => setFilter(v as Category | "Todas")}>
          <SelectTrigger className="h-12 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 grid gap-2">
        <Label>Ver un día específico</Label>
        <div className="flex gap-2">
          <WorkoutCalendar
            value={day || defaultDay}
            onChange={setDay}
            className={day ? "" : "text-muted-foreground"}
          />
          {day && (
            <Button variant="secondary" className="h-12 rounded-xl" onClick={() => setDay("")}>
              Todos
            </Button>
          )}
        </div>
      </div>

      <Button
        onClick={() => {
          if (filtered.length === 0) {
            toast.error("No hay registros para exportar");
            return;
          }
          downloadCSV(filtered);
          toast.success("CSV descargado");
        }}
        variant="secondary"
        className="mt-3 h-12 w-full gap-2 rounded-xl"
      >
        <Download className="size-5" /> Exportar datos (CSV)
      </Button>

      <div className="mt-6 grid gap-6">
        {groups.map(([key, items]) => (
          <section key={key}>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {new Date(items[0]!.date).toLocaleDateString("es-MX", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </h2>
            <ul className="grid gap-2">
              {items.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{l.exerciseName}</p>
                    <p className="text-xs text-muted-foreground">{describeLog(l)}</p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wider text-primary">
                      {l.category} · {new Date(l.date).toLocaleTimeString("es-MX", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
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
          </section>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Sin registros todavía.
        </p>
      )}
    </main>
  );
}