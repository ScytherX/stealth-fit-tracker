import fs from "fs";
let code = fs.readFileSync("src/routes/__root.tsx", "utf-8");
code = code.replace(
  `import { AppHeader } from "../components/AppHeader";`,
  `import { AppHeader } from "../components/AppHeader";\nimport { useTranslation } from "../lib/gym-store";`
);
code = code.replace(
  `function NotFoundComponent() {`,
  `function NotFoundComponent() {\n  const t = useTranslation();`
);
fs.writeFileSync("src/routes/__root.tsx", code);
