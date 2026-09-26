import fs from "fs";
let code = fs.readFileSync("src/routes/index.tsx", "utf-8");
code = code.replace(
  /className=\{cn\(\n\s*"mr-2 h-4 w-4",\n\s*exerciseId === e\.id \? "opacity-100" : "opacity-0"\n\s*\)\}\n\s*\/>\n\s*\{getLocalizedName\(e as any\)\}/,
  `className={cn(\n                              "mr-2 h-4 w-4 shrink-0",\n                              exerciseId === e.id ? "opacity-100" : "opacity-0"\n                            )}\n                          />\n                          <span className="truncate flex-1">{getLocalizedName(e as any)}</span>`
);
fs.writeFileSync("src/routes/index.tsx", code);
