import fs from "fs";
let code = fs.readFileSync("src/routes/progreso.tsx", "utf-8");

code = code.replace(
  /type CardioMetric = "minutes" \| "speed";/,
  `type CardioMetric = "minutes" | "speed";\ntype StrengthMetric = "volume" | "1rm";`
);

code = code.replace(
  /const \[cardioMetric, setCardioMetric\] = useState<CardioMetric>\("minutes"\);/,
  `const [cardioMetric, setCardioMetric] = useState<CardioMetric>("minutes");\n  const [strengthMetric, setStrengthMetric] = useState<StrengthMetric>("volume");`
);

const chartDataBlock = `
  const chartData = useMemo(() => {
    if (!exerciseId) return [];
    const exerciseLogs = logs.filter((l) => l.exerciseId === exerciseId);
    if (exerciseLogs.length === 0) return [];
    const isCardio = exerciseLogs[0]!.category === "Cardio";
    
    // Agrupar por fecha local
    const byDate = new Map<string, { vol: number; min: number; spd: number; onerm: number }>();
    exerciseLogs.forEach((l) => {
      const d = l.date.slice(0, 10);
      const curr = byDate.get(d) || { vol: 0, min: 0, spd: 0, onerm: 0 };
      
      const vol = logVolume(l);
      const min = l.minutes ?? 0;
      const spd = l.speed ?? 0;
      
      const weight = l.weight ?? 0;
      const reps = l.reps ?? 0;
      const onerm = reps === 1 ? weight : weight * (1 + reps / 30);
      
      byDate.set(d, {
        vol: curr.vol + vol,
        min: curr.min + min,
        spd: Math.max(curr.spd, spd),
        onerm: Math.max(curr.onerm, onerm)
      });
    });

    return Array.from(byDate.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, vals]) => ({
        date: new Date(date + "T12:00:00").toLocaleDateString("es-MX", {
          month: "short",
          day: "numeric",
        }),
        volume: vals.vol,
        minutes: vals.min,
        speed: vals.spd,
        onerm: Math.round(vals.onerm * 10) / 10,
      }));
  }, [exerciseId, logs]);
`;

code = code.replace(
  /const chartData = useMemo\(\(\) => \{[\s\S]*?\}, \[exerciseId, logs\]\);/,
  chartDataBlock
);

const chartUI = `
            {isCardio ? (
              <div className="mb-6 flex gap-2">
                <Button
                  variant={cardioMetric === "minutes" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCardioMetric("minutes")}
                  className="flex-1 rounded-xl"
                >
                  Tiempo
                </Button>
                <Button
                  variant={cardioMetric === "speed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCardioMetric("speed")}
                  className="flex-1 rounded-xl"
                >
                  Velocidad Máx.
                </Button>
              </div>
            ) : (
              <div className="mb-6 flex gap-2">
                <Button
                  variant={strengthMetric === "volume" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStrengthMetric("volume")}
                  className="flex-1 rounded-xl"
                >
                  Volumen Total
                </Button>
                <Button
                  variant={strengthMetric === "1rm" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStrengthMetric("1rm")}
                  className="flex-1 rounded-xl"
                >
                  1RM Estimado
                </Button>
              </div>
            )}

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    labelStyle={{ fontWeight: "bold", color: "hsl(var(--foreground))", marginBottom: "4px" }}
                    itemStyle={{ color: "hsl(var(--primary))", fontWeight: "600" }}
                    formatter={(val: number) => {
                      if (isCardio) return [val, cardioMetric === "minutes" ? "minutos" : "km/h"];
                      return [val, strengthMetric === "volume" ? "kg totales" : "kg (1RM)"];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={isCardio ? cardioMetric : strengthMetric === "volume" ? "volume" : "onerm"}
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorMain)"
                    activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
`;

code = code.replace(
  /\{isCardio && \([\s\S]*?<\/ResponsiveContainer>\n\s*<\/div>/,
  chartUI
);

// We must remember we previously added getLocalizedName to progreso.tsx, we lost it by git reset!
if (!code.includes("useLocalizedName")) {
  code = code.replace(/import \{ logVolume, useBodyWeights, useLogs \} from "@\/lib\/gym-store";/, "import { logVolume, useBodyWeights, useLogs, useLocalizedName } from \"@/lib/gym-store\";");
  code = code.replace(/const \{ logs \} = useLogs\(\);/, "const { logs } = useLogs();\n  const getLocalizedName = useLocalizedName();");
  code = code.replace(/l\.exerciseName/g, "(getLocalizedName(l as any) || l.exerciseName)");
}

fs.writeFileSync("src/routes/progreso.tsx", code);
