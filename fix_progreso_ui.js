import fs from "fs";
let code = fs.readFileSync("src/routes/progreso.tsx", "utf-8");
code = code.replace(
  /useLocalizedName \}/,
  `useLocalizedName, useTranslation }`
);
code = code.replace(
  /const getLocalizedName = useLocalizedName\(\);/,
  `const getLocalizedName = useLocalizedName();\n  const t = useTranslation();`
);
code = code.replace(/>Progreso \(últimos 7 días\)</g, `>{t("progress_title")}<`);
code = code.replace(/>Volumen total \(kg\)</g, `>{t("total_volume")}<`);
code = code.replace(/>Series</g, `>{t("sets")}<`);
code = code.replace(/>Tiempo cardio \(min\)</g, `>{t("cardio_time")}<`);
code = code.replace(/>Músculos trabajados</g, `>{t("muscles_worked")}<`);
fs.writeFileSync("src/routes/progreso.tsx", code);
