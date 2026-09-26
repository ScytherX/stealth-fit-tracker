import fs from "fs";

let code = fs.readFileSync("src/routes/cuerpo.tsx", "utf-8");

// Imports
code = code.replace(
  /import \{ computeBMI, useBodyWeights \} from "@\/lib\/gym-store";/,
  `import { computeBMI, computeFFMI, useBodyWeights } from "@/lib/gym-store";`
);
if (!code.includes("computeFFMI")) {
  code = code.replace(
    /import \{.*?useBodyWeights.*?\} from "@\/lib\/gym-store";/,
    (m) => m.replace("useBodyWeights", "useBodyWeights, computeFFMI")
  );
}

// BMI -> FFMI state
code = code.replace(
  /const bmi = w != null && h != null \? computeBMI\(w, h\) : undefined;/,
  `const bmi = w != null && h != null ? computeBMI(w, h) : undefined;\n  const ffmi = w != null && h != null && bf != null ? computeFFMI(w, h, bf) : undefined;`
);

// Save logic
code = code.replace(
  /bmi,/,
  `ffmi,`
);

// UI Rendering
code = code.replace(
  /<p className="text-xs uppercase tracking-widest text-muted-foreground">IMC<\/p>/,
  `<p className="text-xs uppercase tracking-widest text-muted-foreground">FFMI</p>`
);

code = code.replace(
  /\{bmi != null \? bmi : "—"\}/,
  `{ffmi != null ? ffmi : "—"}`
);

// FFMI scale
code = code.replace(
  /\{bmi != null && \([\s\S]*?bmi < 18\.5[\s\S]*?"Bajo peso"[\s\S]*?bmi < 25[\s\S]*?"Normal"[\s\S]*?bmi < 30[\s\S]*?"Sobrepeso"[\s\S]*?"Obesidad"\}\n\s*<\/span>\n\s*\)\}/,
  `{ffmi != null && (
                <span className="ml-2 text-xs font-medium text-muted-foreground">
                  {ffmi < 18
                    ? "Bajo"
                    : ffmi <= 20
                      ? "Promedio"
                      : ffmi <= 22
                        ? "Bueno"
                        : ffmi <= 25
                          ? "Excelente"
                          : "Límite natural superior"}
                </span>
              )}`
);

// Description text
code = code.replace(
  /<p className="text-xs text-muted-foreground">\n\s*Se calcula con tu peso y altura.\n\s*<\/p>/,
  `<p className="text-xs text-muted-foreground">
              Se calcula con tu peso, altura y grasa corporal.
            </p>`
);

// List rendering
code = code.replace(
  /b\.bmi != null \? `IMC \$\{b\.bmi\}` : null,/,
  `b.ffmi != null ? \`FFMI \${b.ffmi}\` : null,`
);

fs.writeFileSync("src/routes/cuerpo.tsx", code);
