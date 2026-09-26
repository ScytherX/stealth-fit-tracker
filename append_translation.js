import fs from "fs";
let code = fs.readFileSync("src/lib/gym-store.ts", "utf-8");
if (!code.includes("useTranslation")) {
  code += `\nimport { DICTIONARY, TranslationKey } from "./i18n";\nexport function useTranslation() {\n  const { lang } = useLanguage();\n  return (key: TranslationKey) => DICTIONARY[lang][key] || key;\n}\n`;
  fs.writeFileSync("src/lib/gym-store.ts", code);
}
