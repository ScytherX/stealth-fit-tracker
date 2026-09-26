import fs from "fs";
let code = fs.readFileSync("src/routes/dia.tsx", "utf-8");
code = code.replace(
  /import \{ useLogs \} from "@\/lib\/gym-store";/,
  `import { useLogs, useTranslation } from "@/lib/gym-store";`
);
code = code.replace(
  /export function DiaPage\(\) \{/,
  `export function DiaPage() {\n  const t = useTranslation();`
);
code = code.replace(/>Ejercicios por Día</g, `>{t("day_title")}<`);
fs.writeFileSync("src/routes/dia.tsx", code);
