import fs from "fs";
let code = fs.readFileSync("src/routes/index.tsx", "utf-8");

// Add useLocalizedName to imports
if (!code.includes("useLocalizedName")) {
  code = code.replace(/import \{.*?useStoreValue.*?\} from "\.\.\/lib\/gym-store";/, (match) => {
    return match.replace("useStoreValue", "useStoreValue, useLocalizedName");
  });
}

// In RouteComponent, get getLocalizedName
if (!code.includes("const getLocalizedName = useLocalizedName();")) {
  code = code.replace(/const \[exercises\] = useStoreValue/, "const getLocalizedName = useLocalizedName();\n  const [exercises] = useStoreValue");
}

// Update the visibleExercises filtering to use localized name for searching
code = code.replace(
  /const visibleExercises = exercises\n\s*\.filter\(\(e\) => e\.category === category\)\n\s*\.filter\(\(e\) =>\n\s*e\.name\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\)\n\s*\);/,
  `const visibleExercises = exercises
    .filter((e) => e.category === category)
    .filter((e) =>
      getLocalizedName(e).toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.name.toLowerCase().includes(searchQuery.toLowerCase())
    );`
);

// Update rendering of exercise list
code = code.replace(
  /\{e\.name\}/g,
  `{getLocalizedName(e)}`
);

// Update button rendering
code = code.replace(
  /\{exercises\.find\(\(e\) => e\.id === exerciseId\)\?\.name \|\| "Selecciona un ejercicio"\}/,
  `{exercises.find((e) => e.id === exerciseId) ? getLocalizedName(exercises.find((e) => e.id === exerciseId)!) : "Selecciona un ejercicio"}`
);

fs.writeFileSync("src/routes/index.tsx", code);
