import fs from "fs";

let code = fs.readFileSync("src/routes/historial.tsx", "utf-8");
const logic = fs.readFileSync("logic.txt", "utf-8");
const buttons = fs.readFileSync("buttons.txt", "utf-8");

// Imports
code = code.replace(
  /import \{ Download, Trash2 \} from "lucide-react";/,
  `import { Download, Trash2, FileUp, ChevronDown } from "lucide-react";\nimport { jsPDF } from "jspdf";\nimport html2canvas from "html2canvas";\nimport { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";`
);

code = code.replace(
  /import \{ useEffect, useMemo, useState \} from "react";/,
  `import React, { useEffect, useMemo, useState, useRef } from "react";`
);

code = code.replace(
  /const \[day, setDay\] = useState\(""\);/,
  `const [day, setDay] = useState("");\n${logic}`
);

code = code.replace(
  /<Button\n\s*onClick=\{\(\) => \{\n\s*if \(filtered\.length === 0\) \{\n\s*toast\.error\("No hay registros para exportar"\);\n\s*return;\n\s*\}\n\s*downloadCSV\(filtered\);\n\s*toast\.success\("CSV descargado"\);\n\s*\}\}\n\s*variant="secondary"\n\s*className="mt-3 h-12 w-full gap-2 rounded-xl"\n\s*>\n\s*<Download className="size-5" \/> Exportar datos \(CSV\)\n\s*<\/Button>/,
  buttons
);

code = code.replace(
  /<div className="mt-6 grid gap-6">/,
  `<div className="mt-6 grid gap-6" id="historial-list">`
);

fs.writeFileSync("src/routes/historial.tsx", code);
