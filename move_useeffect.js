import fs from "fs";
let code = fs.readFileSync("src/routes/progreso.tsx", "utf-8");

const effectCode = \`  useEffect(() => {
    if (series.length > 0) {
      if (series[0]!.cardio && (metric === "peso" || metric === "onerm")) setMetric("minutes");
      else if (!series[0]!.cardio && (metric === "minutes" || metric === "speed")) setMetric("peso");
    }
  }, [series, metric]);\`;

code = code.replace(effectCode, "");
code = code.replace(
  /const bodySeries = useMemo\(/,
  effectCode + "\\n\\n  const bodySeries = useMemo("
);

fs.writeFileSync("src/routes/progreso.tsx", code);
