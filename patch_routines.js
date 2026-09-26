import fs from "fs";
let code = fs.readFileSync("src/components/RoutinesFab.tsx", "utf-8");

// Add useLocalizedName to imports
if (!code.includes("useLocalizedName")) {
  code = code.replace(/import \{.*?useStoreValue.*?\} from "\.\.\/lib\/gym-store";/, (match) => {
    return match.replace("useStoreValue", "useStoreValue, useLocalizedName");
  });
}

// In RoutineEditor, get getLocalizedName
if (!code.includes("const getLocalizedName = useLocalizedName();")) {
  code = code.replace(/const \[exercises\] = useStoreValue/, "const getLocalizedName = useLocalizedName();\n  const [exercises] = useStoreValue");
}

// visibleExercises
code = code.replace(
  /const visibleExercises = exercises\n\s*\.filter\(\(e\) => e\.category === exCategory\)\n\s*\.filter\(\(e\) =>\n\s*e\.name\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\)\n\s*\);/,
  `const visibleExercises = exercises
    .filter((e) => e.category === exCategory)
    .filter((e) =>
      getLocalizedName(e).toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.name.toLowerCase().includes(searchQuery.toLowerCase())
    );`
);

// item.exerciseName -> localized
code = code.replace(
  /\{item\.exerciseName\}/g,
  `{getLocalizedName(exercises.find(e => e.id === item.exerciseId) || {name: item.exerciseName, nameEs: item.exerciseNameEs, nameEn: item.exerciseNameEn})}`
);

// button text
code = code.replace(
  /\{exercises\.find\(\(e\) => e\.id === exerciseId\)\?\.name \|\| "Selecciona un ejercicio"\}/,
  `{exercises.find((e) => e.id === exerciseId) ? getLocalizedName(exercises.find((e) => e.id === exerciseId)!) : "Selecciona un ejercicio"}`
);

// list of exercises in RoutineEditor
code = code.replace(
  /\{e\.name\}/g,
  `{getLocalizedName(e)}`
);


// In RoutinesFab list
if (!code.includes("const getLoc = useLocalizedName()")) {
  code = code.replace(/export function RoutinesFab\(\{ date \}: \{ date: string \}\) \{/, `export function RoutinesFab({ date }: { date: string }) {\n  const getLoc = useLocalizedName();\n  const [exercises] = useStoreValue("gymlog.customExercises.v1", []);`);
}
code = code.replace(
  /i\.exerciseName/g,
  `getLoc(exercises.find(e => e.id === i.exerciseId) || {name: i.exerciseName, nameEs: i.exerciseNameEs, nameEn: i.exerciseNameEn})`
);


fs.writeFileSync("src/components/RoutinesFab.tsx", code);
