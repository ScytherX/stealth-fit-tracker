import fs from "fs";
let code = fs.readFileSync("src/routes/progreso.tsx", "utf-8");

code = code.replace(
  /logs\.forEach\(\(l\) => map\.set\(l\.exerciseId, \(getLocalizedName\(l as any\) \|\| l\.exerciseName\)\)\);/,
  `logs.forEach((l) => map.set(l.exerciseId, getLocalizedName((exercises.find(e => e.id === l.exerciseId) || l) as any)));`
);

fs.writeFileSync("src/routes/progreso.tsx", code);
