import fs from "fs";
let code = fs.readFileSync("src/components/AppHeader.tsx", "utf-8");
code = code.replace(
  /function LanguageSelector\(\) \{/,
  `function LanguageSelector() {\n  const t = useTranslation();`
);
fs.writeFileSync("src/components/AppHeader.tsx", code);
