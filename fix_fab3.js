import fs from "fs";
let code = fs.readFileSync("src/components/RoutinesFab.tsx", "utf-8");

code = code.replace(
  `function RoutineEditor({\n  const t = useTranslation();\n  \n\n  routine,`,
  `function RoutineEditor({\n  routine,`
);
code = code.replace(
  `  onClose: () => void;\n}) {\n  const t = useTranslation();`,
  `  onClose: () => void;\n}) {`
);
code = code.replace(
  `  onClose: () => void;\n}) {`,
  `  onClose: () => void;\n}) {\n  const t = useTranslation();`
);
fs.writeFileSync("src/components/RoutinesFab.tsx", code);
