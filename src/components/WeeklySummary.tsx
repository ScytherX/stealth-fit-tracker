import { useMemo } from "react";
import { CalendarCheck, TrendingUp, TrendingDown, Minus, Dumbbell } from "lucide-react";

import { logVolume, type LogEntry } from "@/lib/gym-store";

function dayKey(iso: string) {
  return new Date(iso).toLocaleDateString("sv-SE");
}

function startOfWeek(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff)).toLocaleDateString("sv-SE");
}

function weekRangeLabel(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  const start = new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${start.toLocaleDateString("es-MX", { day: "2-digit", month: "short" })} – ${end.toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}`;
}

export function WeeklySummary({ logs }: { logs: LogEntry[] }) {
  const stats = useMemo(() => {
    const now = new Date();
    const todayKey = now.toLocaleDateString("sv-SE");
    const thisWeekStart = startOfWeek(todayKey);
    const lastWeekStart = startOfWeek(
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toLocaleDateString("sv-SE"),
    );

    const thisWeekLogs = logs.filter((l) => dayKey(l.date) >= thisWeekStart);
    const lastWeekLogs = logs.filter((l) => dayKey(l.date) >= lastWeekStart && dayKey(l.date) < thisWeekStart);

    const thisDays = new Set(thisWeekLogs.map((l) => dayKey(l.date))).size;
    const lastDays = new Set(lastWeekLogs.map((l) => dayKey(l.date))).size;

    const thisVolume = thisWeekLogs.filter((l) => l.category !== "Cardio").reduce((s, l) => s + logVolume(l), 0);
    const lastVolume = lastWeekLogs.filter((l) => l.category !== "Cardio").reduce((s, l) => s + logVolume(l), 0);

    const byCategory = new Map<string, number>();
    thisWeekLogs.forEach((l) => {
      if (l.category === "Cardio") return;
      byCategory.set(l.category, (byCategory.get(l.category) ?? 0) + logVolume(l));
    });
    const topCategory = [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0];

    return {
      thisDays,
      lastDays,
      thisVolume,
      lastVolume,
      topCategory,
      weekLabel: weekRangeLabel(thisWeekStart),
    };
  }, [logs]);

  if (logs.length === 0) return null;

  const dayDiff = stats.thisDays - stats.lastDays;
  const volumeDiff = stats.thisVolume - stats.lastVolume;

  return (
    <section className="mt-6 rounded-3xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          <CalendarCheck className="size-4 text-primary" /> Resumen de la semana
        </h2>
        <span className="text-xs text-muted-foreground">{stats.weekLabel}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <MiniStat
          label="Días entrenados"
          value={`${stats.thisDays}`}
          comparison={dayDiff}
          unit="día"
          pluralUnit="días"
        />
        <MiniStat
          label="Volumen"
          value={`${Math.round(stats.thisVolume).toLocaleString("es-MX")} kg`}
          comparison={volumeDiff}
          unit="kg"
        />
      </div>

      {stats.topCategory && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-secondary/50 px-4 py-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Dumbbell className="size-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Grupo más trabajado</p>
            <p className="font-semibold">{stats.topCategory[0]}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function MiniStat({
  label,
  value,
  comparison,
  unit,
  pluralUnit,
}: {
  label: string;
  value: string;
  comparison: number;
  unit: string;
  pluralUnit?: string;
}) {
  const isPositive = comparison > 0;
  const isNeutral = comparison === 0;
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const tone = isNeutral ? "text-muted-foreground" : isPositive ? "text-primary" : "text-destructive";
  const abs = Math.round(comparison);
  const displayUnit = abs === 1 || isNeutral ? unit : (pluralUnit ?? unit);
  const text = isNeutral ? "Igual" : `${isPositive ? "+" : ""}${abs.toLocaleString("es-MX")} ${displayUnit}`;

  return (
    <div className="rounded-2xl border border-border bg-background px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
      <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${tone}`}>
        <Icon className="size-3" /> {text} vs la semana pasada
      </p>
    </div>
  );
}
