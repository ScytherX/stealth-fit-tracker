import fs from "fs";
let code = fs.readFileSync("src/routes/progreso.tsx", "utf-8");

code = code.replace(
  /import \{ ProgressStats \} from "@\/components\/ProgressStats";/,
  `import { ProgressStats } from "@/components/ProgressStats";\nimport { MuscleHeatmap } from "@/components/MuscleHeatmap";`
);

code = code.replace(
  /<ProgressStats logs=\{logs\} \/>/,
  `<ProgressStats logs={logs} />\n\n      <div className="mt-6">\n        <MuscleHeatmap logs={logs} />\n      </div>`
);

fs.writeFileSync("src/routes/progreso.tsx", code);
