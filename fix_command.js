import fs from "fs";
let code = fs.readFileSync("src/components/ui/command.tsx", "utf-8");
code = code.replace(/<DialogContent className="overflow-hidden p-0 \[<DialogContent className="overflow-hidden p-0">>button\]:hidden">/, '<DialogContent className="overflow-hidden p-0 [&>button]:hidden">');
fs.writeFileSync("src/components/ui/command.tsx", code);
