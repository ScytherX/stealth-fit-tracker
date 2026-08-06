import { useMemo } from "react";
import { Dumbbell, Flame, Trophy, CalendarDays } from "lucide-react";

import { logVolume, type LogEntry } from "@/lib/gym-store";

function dayKey(iso: string) {
  return new Date(iso).toLocaleDateString("sv-SE");
}

function streak(logs: LogEntry[]) {
  const days = new Set(logs.map((l) => dayKey(l.date)));
  if (days.size === 0) return 0;
  let count = 0;
  const cursor = new Date();
  // Allow the streak to start yesterday if today has no workout yet.
  if (!days.has(cursor.toLocaleDateString("sv-SE"))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(cursor.toLocaleDateString("sv-SE"))) return 0;
  }
  while (days.has(cursor.toLocaleDateString("sv-SE"))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export function ProgressStats({ logs }: { logs: LogEntry[] }) {
  const stats = useMemo(() => {
    const strength = logs.filter((l) => l.category !== "Cardio");
    const volume = strength.reduce((sum, l) => sum + logVolume(l), 0);
    const best = strength.reduce<LogEntry | undefined>(
      (top, l) => ((l.weight ?? 0) > (top?.weight ?? 0) ? l : top),
      undefined,
    );
    const days = new Set(logs.map((l) => dayKey(l.date))).size;
    return { volume, best, days, streak: streak(logs) };
  }, [logs]);

  if (logs.length === 0) return null;

  return (
    <section className="mt-6 grid grid-cols-2 gap-3">
      <Card
        icon={<Trophy className="size-4 text-primary" />}
        label="Récord de peso"
        value={stats.best ? `${stats.best.weight ?? 0} kg` : "—"}
        hint={stats.best?.exerciseName ?? "Sin registros de fuerza"}
      />
      <Card
        icon={<Dumbbell className="size-4 text-primary" />}
        label="Volumen total"
        value={`${Math.round(stats.volume).toLocaleString("es-MX")} kg`}
        hint="Peso × series × reps"
      />
      <Card
        icon={<Flame className="size-4 text-primary" />}
        label="Racha actual"
        value={`${stats.streak} ${stats.streak === 1 ? "día" : "días"}`}
        hint="Días seguidos entrenando"
      />
      <Card
        icon={<CalendarDays className="size-4 text-primary" />}
        label="Días entrenados"
        value={String(stats.days)}
        hint={`${logs.length} registros`}
      />
    </section>
  );
}

function Card({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </p>
      <p className="mt-2 text-2xl font-extrabold">{value}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}