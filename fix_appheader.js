import fs from "fs";
let code = fs.readFileSync("src/components/AppHeader.tsx", "utf-8");
code = code.replace(
  /export function AppHeader\(\) \{/,
  `import { useTranslation } from "@/lib/gym-store";\n\nexport function AppHeader() {\n  const t = useTranslation();`
);
code = code.replace(
  /\{ to: "\/", label: "Ejercicios", icon: Dumbbell \},/,
  `{ to: "/", label: "nav_exercises", icon: Dumbbell },`
);
code = code.replace(
  /\{ to: "\/cuerpo", label: "Cuerpo", icon: HeartPulse \},/,
  `{ to: "/cuerpo", label: "nav_body", icon: HeartPulse },`
);
code = code.replace(
  /\{ to: "\/dia", label: "Por día", icon: CalendarDays \},/,
  `{ to: "/dia", label: "nav_by_day", icon: CalendarDays },`
);
code = code.replace(
  /\{ to: "\/progreso", label: "Progreso", icon: LineChart \},/,
  `{ to: "/progreso", label: "nav_progress", icon: LineChart },`
);
code = code.replace(
  /\{ to: "\/historial", label: "Historial", icon: History \},/,
  `{ to: "/historial", label: "nav_history", icon: History },`
);
code = code.replace(
  /\{label\}/g,
  `{t(label as any)}`
);
code = code.replace(
  /Idioma \/ Language/,
  `{t("language")}`
);
fs.writeFileSync("src/components/AppHeader.tsx", code);
