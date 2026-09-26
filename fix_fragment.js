import fs from "fs";
let code = fs.readFileSync("src/components/RoutinesFab.tsx", "utf-8");
code = code.replace(
  /\{shareRoutine && <QRCode/,
  `{shareRoutine && (<>\n                  <QRCode`
);
code = code.replace(
  /Copiar código de texto\n\s*<\/Button>/,
  `Copiar código de texto\n                  </Button>\n                  </>)`
);
fs.writeFileSync("src/components/RoutinesFab.tsx", code);
