import fs from "fs";
let code = fs.readFileSync("src/routes/cuerpo.tsx", "utf-8");
code = code.replace(
  /import \{ useBodyWeights, BodyWeight \} from "@\/lib\/gym-store";/,
  `import { useBodyWeights, BodyWeight, useTranslation } from "@/lib/gym-store";`
);
code = code.replace(
  /export function CuerpoPage\(\) \{/,
  `export function CuerpoPage() {\n  const t = useTranslation();`
);
code = code.replace(/>Análisis Corporal</g, `>{t("body_analysis")}<`);
code = code.replace(/>Progreso de Peso \(kg\)</g, `>{t("weight_progress")}<`);
code = code.replace(/>Peso actual</g, `>{t("current_weight")}<`);
code = code.replace(/>Grasa Corporal \(%\)</g, `>{t("body_fat")}<`);
code = code.replace(/>Guardar peso</g, `>{t("save_weight")}<`);
code = code.replace(/>FFMI \(Índice de Masa Libre de Grasa\)</g, `>{t("ffmi")}<`);
code = code.replace(/>Calculadora 1RM \(Epley\)</g, `>{t("1rm_calculator")}<`);
code = code.replace(/>Repeticiones</g, `>{t("reps")}<`);
code = code.replace(/>Peso \(kg\)</g, `>{t("weight")}<`);

fs.writeFileSync("src/routes/cuerpo.tsx", code);
