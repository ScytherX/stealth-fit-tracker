import fs from "fs";
let code = fs.readFileSync("src/components/RoutinesFab.tsx", "utf-8");
code = code.replace(
  /<SelectItem key=\{c\} value=\{c\}>\s*\{c\}\s*<\/SelectItem>/g,
  `<SelectItem key={c} value={c}>{t(("cat_" + c) as any)}</SelectItem>`
);
fs.writeFileSync("src/components/RoutinesFab.tsx", code);
