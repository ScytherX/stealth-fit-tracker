import fs from "fs";

let code = fs.readFileSync("src/routes/progreso.tsx", "utf-8");

if (!code.includes("useLocalizedName")) {
  code = code.replace(/import \{ logVolume, useBodyWeights, useLogs \} from "@\/lib\/gym-store";/, 'import { logVolume, useBodyWeights, useLogs, useLocalizedName } from "@/lib/gym-store";');
  code = code.replace(/const \{ logs \} = useLogs\(\);/, 'const { logs } = useLogs();\n  const getLocalizedName = useLocalizedName();');
  code = code.replace(/l\.exerciseName/g, "(getLocalizedName(l as any) || l.exerciseName)");
}

code = code.replace(
  /peso: l\.weight \?\? 0,\n\s*volumen: logVolume\(l\),/,
  `peso: l.weight ?? 0,
        volumen: logVolume(l),
        onerm: (l.reps ?? 0) === 1 ? (l.weight ?? 0) : (l.weight ?? 0) * (1 + (l.reps ?? 0) / 30),`
);

code = code.replace(
  /\{isCardio && \([\s\S]*?<\/div>\n\s*\)\}/,
  `{isCardio ? (
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
      ) : (
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            variant={metric === "peso" ? "default" : "secondary"}
            onClick={() => setMetric("peso")}
            className="rounded-full"
          >
            Volumen Total
          </Button>
          <Button
            size="sm"
            variant={metric === "onerm" ? "default" : "secondary"}
            onClick={() => setMetric("onerm")}
            className="rounded-full"
          >
            1RM Estimado
          </Button>
        </div>
      )}`
);

code = code.replace(
  /type CardioMetric = "minutes" \| "speed";/,
  `type CardioMetric = "minutes" | "speed" | "peso" | "onerm";`
);

code = code.replace(
  /const bodySeries = useMemo\(/,
  `useEffect(() => {
    if (series.length > 0) {
      if (series[0]!.cardio && (metric === "peso" || metric === "onerm")) setMetric("minutes");
      else if (!series[0]!.cardio && (metric === "minutes" || metric === "speed")) setMetric("peso");
    }
  }, [series, metric]);

  const bodySeries = useMemo(`
);

code = code.replace(
  /const dataKey = isCardio \? metric : "peso";\n\s*const label = isCardio\n\s*\? metric === "minutes"\n\s*\? "Tiempo \(min\)"\n\s*: "Velocidad \(km\/h\)"\n\s*: "Peso \(kg\)";/,
  `const dataKey = isCardio ? metric : (metric === "onerm" ? "onerm" : "volumen");
  const label = isCardio
    ? metric === "minutes"
      ? "Tiempo (min)"
      : "Velocidad (km/h)"
    : metric === "onerm"
      ? "1RM Estimado (kg)"
      : "Volumen (kg)";`
);

code = code.replace(
  /\{!isCardio && \(\n\s*<Line\n\s*type="monotone"\n\s*dataKey="volumen"\n\s*name="Volumen \(kg\)"\n\s*stroke="var\(--accent\)"\n\s*strokeWidth=\{2\}\n\s*strokeDasharray="4 4"\n\s*dot=\{false\}\n\s*\/>\n\s*\)\}/,
  ``
);

fs.writeFileSync("src/routes/progreso.tsx", code);
