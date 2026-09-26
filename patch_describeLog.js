import fs from "fs";
let code = fs.readFileSync("src/lib/gym-store.ts", "utf-8");

code = code.replace(
  /return \`\$\{log\.sets\}x\$\{log\.reps\} a \$\{log\.weight\}kg\$\{rirStr\}\`;/,
  `return \`\${log.sets}x\${log.reps} a \${log.weight}kg\${rirStr}\${log.note ? \` (\${log.note})\` : ""}\`;`
);

fs.writeFileSync("src/lib/gym-store.ts", code);
