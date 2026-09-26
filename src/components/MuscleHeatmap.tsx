import { useMemo } from "react";
import { LogEntry , useTranslation } from "@/lib/gym-store";

export function MuscleHeatmap({ logs }: { logs: LogEntry[] }) {
  const t = useTranslation();
  const intensities = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recent = logs.filter(l => new Date(l.date) >= sevenDaysAgo && l.category !== "Cardio");
    
    const counts = {
      Pecho: 0,
      Espalda: 0,
      Piernas: 0,
      Hombros: 0,
      Brazos: 0,
      Abdomen: 0,
    };
    
    recent.forEach(l => {
      if (l.category in counts) {
        counts[l.category as keyof typeof counts] += (l.sets ?? 1) * (l.reps ?? 1);
      }
    });
    
    const max = Math.max(...Object.values(counts), 1);
    
    const getLevel = (val: number) => {
      if (val === 0) return "hsl(var(--muted))";
      const intensity = val / max;
      // Map to a red color: hsl(0, 100%, L%) where L goes from 80% to 40%
      const lightness = 80 - (intensity * 40);
      return `hsl(0, 100%, ${lightness}%)`;
    };

    return {
      Pecho: getLevel(counts.Pecho),
      Espalda: getLevel(counts.Espalda),
      Piernas: getLevel(counts.Piernas),
      Hombros: getLevel(counts.Hombros),
      Brazos: getLevel(counts.Brazos),
      Abdomen: getLevel(counts.Abdomen),
    };
  }, [logs]);

  return (
    <div className="flex flex-col items-center justify-center p-4 border border-border rounded-3xl bg-card">
      <h3 className="text-sm font-bold mb-4">Músculos (Últimos 7 días)</h3>
      <div className="flex gap-8 relative">
        {/* Front */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-6 h-6 rounded-full bg-muted" /> {/* Head */}
          <div className="flex gap-1">
            <div className="w-4 h-8 rounded-full" style={{ background: intensities.Brazos }} /> {/* L Arm */}
            <div className="flex flex-col gap-1">
              <div className="w-16 h-4 rounded-full" style={{ background: intensities.Hombros }} /> {/* Shoulders */}
              <div className="w-12 h-6 rounded-md mx-auto" style={{ background: intensities.Pecho }} /> {/* Chest */}
              <div className="w-10 h-8 rounded-md mx-auto" style={{ background: intensities.Abdomen }} /> {/* Abs */}
            </div>
            <div className="w-4 h-8 rounded-full" style={{ background: intensities.Brazos }} /> {/* R Arm */}
          </div>
          <div className="flex gap-1">
            <div className="w-5 h-16 rounded-md" style={{ background: intensities.Piernas }} /> {/* L Leg */}
            <div className="w-5 h-16 rounded-md" style={{ background: intensities.Piernas }} /> {/* R Leg */}
          </div>
          <p className="text-[10px] mt-2 font-semibold text-muted-foreground">{t("front")}</p>
        </div>

        {/* Back */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-6 h-6 rounded-full bg-muted" /> {/* Head */}
          <div className="flex gap-1">
            <div className="w-4 h-8 rounded-full" style={{ background: intensities.Brazos }} /> {/* L Arm */}
            <div className="flex flex-col gap-1">
              <div className="w-16 h-4 rounded-full" style={{ background: intensities.Hombros }} /> {/* Shoulders */}
              <div className="w-12 h-16 rounded-md mx-auto" style={{ background: intensities.Espalda }} /> {/* Back */}
            </div>
            <div className="w-4 h-8 rounded-full" style={{ background: intensities.Brazos }} /> {/* R Arm */}
          </div>
          <div className="flex gap-1">
            <div className="w-5 h-16 rounded-md" style={{ background: intensities.Piernas }} /> {/* L Leg */}
            <div className="w-5 h-16 rounded-md" style={{ background: intensities.Piernas }} /> {/* R Leg */}
          </div>
          <p className="text-[10px] mt-2 font-semibold text-muted-foreground">{t("back")}</p>
        </div>
      </div>
    </div>
  );
}
