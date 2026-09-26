import fs from "fs";

// Patch historial.tsx
let code = fs.readFileSync("src/routes/historial.tsx", "utf-8");
if (!code.includes("useLocalizedName")) {
  code = code.replace(/import \{.*?useLogs.*?\} from "\.\.\/lib\/gym-store";/, (match) => {
    return match.replace("useLogs", "useLogs, useLocalizedName");
  });
  code = code.replace(/const \{ logs \} = useLogs\(\);/, "const { logs } = useLogs();\n  const getLocalizedName = useLocalizedName();");
  code = code.replace(/l\.exerciseName/g, "(getLocalizedName(l as any) || l.exerciseName)");
  fs.writeFileSync("src/routes/historial.tsx", code);
}

// Patch progreso.tsx
code = fs.readFileSync("src/routes/progreso.tsx", "utf-8");
if (!code.includes("useLocalizedName")) {
  code = code.replace(/import \{.*?useLogs.*?\} from "\.\.\/lib\/gym-store";/, (match) => {
    return match.replace("useLogs", "useLogs, useLocalizedName");
  });
  code = code.replace(/const \{ logs \} = useLogs\(\);/, "const { logs } = useLogs();\n  const getLocalizedName = useLocalizedName();");
  code = code.replace(/l\.exerciseName/g, "(getLocalizedName(l as any) || l.exerciseName)");
  
  // also the select button
  code = code.replace(
    /\{exerciseNames\.get\(exerciseId\)\}/,
    `{exerciseNames.get(exerciseId)}`
  ); // wait, exerciseNames.get(exerciseId) already stores the localized name if I patched the map.set above
  
  fs.writeFileSync("src/routes/progreso.tsx", code);
}
