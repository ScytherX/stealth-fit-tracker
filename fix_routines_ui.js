import fs from "fs";
let code = fs.readFileSync("src/components/RoutinesFab.tsx", "utf-8");
code = code.replace(
  /useLocalizedName \}/,
  `useLocalizedName, useTranslation }`
);
code = code.replace(
  /const getLocalizedName = useLocalizedName\(\);/,
  `const getLocalizedName = useLocalizedName();\n  const t = useTranslation();`
);
code = code.replace(/>Compartir rutina</g, `>{t("share_routine")}<`);
code = code.replace(/>Escanear rutina</g, `>{t("scan_routine")}<`);
fs.writeFileSync("src/components/RoutinesFab.tsx", code);
