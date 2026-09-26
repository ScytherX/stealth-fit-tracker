import fs from "fs";
let code = fs.readFileSync("src/routes/historial.tsx", "utf-8");
code = code.replace(
  /useLocalizedName \}/,
  `useLocalizedName, useTranslation }`
);
code = code.replace(
  /const getLocalizedName = useLocalizedName\(\);/,
  `const getLocalizedName = useLocalizedName();\n  const t = useTranslation();`
);
code = code.replace(/>Historial y exportación CSV</g, `>{t("history_title")}<`);
code = code.replace(/>Descargar CSV</g, `>{t("download_csv")}<`);
code = code.replace(/>Exportar a PDF</g, `>{t("export_pdf")}<`);
code = code.replace(/>Exportar a TXT</g, `>{t("export_txt")}<`);
code = code.replace(/>Exportar</g, `>{t("export")}<`);
code = code.replace(/>Importar datos</g, `>{t("import_data")}<`);
fs.writeFileSync("src/routes/historial.tsx", code);
