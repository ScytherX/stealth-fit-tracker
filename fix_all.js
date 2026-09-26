import fs from "fs";

let i18n = fs.readFileSync("src/lib/i18n.ts", "utf-8");
i18n = i18n.replace(/"progress_title": "Progreso \(últimos 7 días\)",/, "");
i18n = i18n.replace(/"front": "Frente",/, "");
i18n = i18n.replace(/"back": "Espalda",/, "");
i18n = i18n.replace(/"history_title": "Historial y exportación CSV",/, "");
i18n = i18n.replace(/"ffmi": "FFMI \(Índice de Masa Libre de Grasa\)",/, "");

i18n = i18n.replace(/"progress_title": "Progress \(last 7 days\)",/, "");
i18n = i18n.replace(/"front": "Front",/, "");
i18n = i18n.replace(/"back": "Back",/, "");
i18n = i18n.replace(/"history_title": "History & CSV Export",/, "");
i18n = i18n.replace(/"ffmi": "FFMI \(Fat-Free Mass Index\)",/, "");
fs.writeFileSync("src/lib/i18n.ts", i18n);

let fab = fs.readFileSync("src/components/RoutinesFab.tsx", "utf-8");
fab = fab.replace(
  `function RoutineEditor({`,
  `function RoutineEditor({\n  `
);
fab = fab.replace(
  `  onClose: () => void;\n}) {`,
  `  onClose: () => void;\n}) {\n  const t = useTranslation();`
);
fs.writeFileSync("src/components/RoutinesFab.tsx", fab);

let cuerpo = fs.readFileSync("src/routes/cuerpo.tsx", "utf-8");
cuerpo = cuerpo.replace(
  `import { bodyFatCategory, calculateFFMI, dayKey, num, uid, useLogs } from "../lib/gym-store";`,
  `import { bodyFatCategory, calculateFFMI, dayKey, num, uid, useLogs, useTranslation } from "../lib/gym-store";`
);
cuerpo = cuerpo.replace(
  `export const Route = createFileRoute("/cuerpo")({\n  component: RouteComponent,\n});\n\nfunction RouteComponent() {`,
  `export const Route = createFileRoute("/cuerpo")({\n  component: RouteComponent,\n});\n\nfunction RouteComponent() {\n  const t = useTranslation();`
);
fs.writeFileSync("src/routes/cuerpo.tsx", cuerpo);

let dia = fs.readFileSync("src/routes/dia.tsx", "utf-8");
dia = dia.replace(
  `import { describeLog, useExercises, useLogs, type LogEntry } from "@/lib/gym-store";`,
  `import { describeLog, useExercises, useLogs, useTranslation, type LogEntry } from "@/lib/gym-store";`
);
dia = dia.replace(
  `function DayRouteComponent() {\n  const { date } = Route.useSearch();`,
  `function DayRouteComponent() {\n  const t = useTranslation();\n  const { date } = Route.useSearch();`
);
fs.writeFileSync("src/routes/dia.tsx", dia);

