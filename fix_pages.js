import fs from "fs";

let code = fs.readFileSync("src/routes/cuerpo.tsx", "utf-8");
code = code.replace(/function CuerpoPage\(\) \{/, "function CuerpoPage() {\n  const t = useTranslation();");
fs.writeFileSync("src/routes/cuerpo.tsx", code);

let code2 = fs.readFileSync("src/routes/dia.tsx", "utf-8");
code2 = code2.replace(/function DiaPage\(\) \{/, "function DiaPage() {\n  const t = useTranslation();");
fs.writeFileSync("src/routes/dia.tsx", code2);
