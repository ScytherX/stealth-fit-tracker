import fs from "fs";
let code = fs.readFileSync("src/routes/cuerpo.tsx", "utf-8");
code = code.replace(/function RouteComponent\(\) \{/, "function RouteComponent() {\n  const t = useTranslation();");
if (!code.includes("function RouteComponent() {")) {
  // It might be `export default function` or similar
  code = code.replace(/export default function[A-Za-z0-9 _]*\(\) \{/, match => match + "\n  const t = useTranslation();");
}
fs.writeFileSync("src/routes/cuerpo.tsx", code);
