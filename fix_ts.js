import fs from "fs";

let indexCode = fs.readFileSync("src/routes/index.tsx", "utf-8");
indexCode = indexCode.replace(/const getLocalizedName = useLocalizedName\(\);\n  const \[exercises\] = useStoreValue/, "const getLocalizedName = useLocalizedName();\n  const [exercises] = useStoreValue");
// Wait, the error says: Cannot find name 'getLocalizedName' in line 247, 273.
// That means `getLocalizedName` is defined inside `RouteComponent`, but I'm using it outside?
// Ah! In `index.tsx`, the exercise list is rendered in the return of RouteComponent.
