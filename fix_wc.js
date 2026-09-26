import fs from "fs";
let code = fs.readFileSync("src/components/WorkoutCalendar.tsx", "utf-8");

code = code.replace(
  `export function WorkoutCalendar({\n  const t = useTranslation();\n  value,`,
  `export function WorkoutCalendar({\n  value,`
);

// We need to place const t = useTranslation(); inside the function body
code = code.replace(
  `}) {\n  const [viewDate, setViewDate]`,
  `}) {\n  const t = useTranslation();\n  const [viewDate, setViewDate]`
);

fs.writeFileSync("src/components/WorkoutCalendar.tsx", code);
