import fs from "fs";

function fixFile(file, matchStr, insertStr) {
  let code = fs.readFileSync(file, "utf-8");
  code = code.replace(matchStr, matchStr + "\n  " + insertStr);
  fs.writeFileSync(file, code);
}

fixFile("src/components/RoutinesFab.tsx", "function RoutineEditor({", "const t = useTranslation();");
// wait, I already tried to inject it, maybe it didn't match perfectly.
let fab = fs.readFileSync("src/components/RoutinesFab.tsx", "utf-8");
fab = fab.replace(/export function RoutineEditor\(\{[\s\S]*?\}\) \{/g, match => match + "\n  const t = useTranslation();");
// Actually it's just `function RoutineEditor(`
fab = fab.replace(/function RoutineEditor\(\{[\s\S]*?\}\) \{/, match => match + "\n  const t = useTranslation();");
fs.writeFileSync("src/components/RoutinesFab.tsx", fab);

let cuerpo = fs.readFileSync("src/routes/cuerpo.tsx", "utf-8");
cuerpo = cuerpo.replace(/function AddBodyWeightDialog\(\{[\s\S]*?\}\) \{/, match => match + "\n  const t = useTranslation();");
cuerpo = cuerpo.replace(/function BodyWeightCard\(\{[\s\S]*?\}\) \{/, match => match + "\n  const t = useTranslation();");
fs.writeFileSync("src/routes/cuerpo.tsx", cuerpo);

let dia = fs.readFileSync("src/routes/dia.tsx", "utf-8");
if (!dia.includes("function DayRouteComponent() {\n  const t = useTranslation();")) {
   dia = dia.replace(/function DayRouteComponent\(\) \{/, "function DayRouteComponent() {\n  const t = useTranslation();");
}
fs.writeFileSync("src/routes/dia.tsx", dia);

let wc = fs.readFileSync("src/components/WorkoutCalendar.tsx", "utf-8");
wc = wc.replace(/export function WorkoutCalendar\(\{[\s\S]*?\}\) \{/, match => match + "\n  const t = useTranslation();");
fs.writeFileSync("src/components/WorkoutCalendar.tsx", wc);

