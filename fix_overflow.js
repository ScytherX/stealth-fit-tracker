import fs from "fs";
let code = fs.readFileSync("src/routes/index.tsx", "utf-8");
code = code.replace(
  /\{exerciseId\s*\n\s*\?\s*getLocalizedName\(\(exercises\.find\(\(e\) => e\.id === exerciseId\) \|\| filtered\[0\]\) as any\)\s*\n\s*: t\("select_exercise"\)\}/,
  `<span className="truncate">\n                  {exerciseId\n                    ? getLocalizedName((exercises.find((e) => e.id === exerciseId) || filtered[0]) as any)\n                    : t("select_exercise")}\n                </span>`
);
fs.writeFileSync("src/routes/index.tsx", code);
