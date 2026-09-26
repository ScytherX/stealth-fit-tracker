import fs from "fs";

let code = fs.readFileSync("src/routes/cuerpo.tsx", "utf-8");
if (!code.includes("useTranslation")) {
  code = code.replace(/import \{.*\} from "@\/lib\/gym-store";/, match => match.replace("}", ", useTranslation }"));
} else if (code.includes('gym-store"') && !code.includes('useTranslation')) {
  // Try another way
  code = code.replace(/import \{.*?\} from ".*gym-store";/, match => match.replace("}", ", useTranslation }"));
}
fs.writeFileSync("src/routes/cuerpo.tsx", code);

let code2 = fs.readFileSync("src/routes/dia.tsx", "utf-8");
if (!code2.includes("useTranslation")) {
  code2 = code2.replace(/import \{.*\} from "@\/lib\/gym-store";/, match => match.replace("}", ", useTranslation }"));
} else if (code2.includes('gym-store"') && !code2.includes('useTranslation')) {
  code2 = code2.replace(/import \{.*?\} from ".*gym-store";/, match => match.replace("}", ", useTranslation }"));
}
fs.writeFileSync("src/routes/dia.tsx", code2);
