import fs from "fs";
let code = fs.readFileSync("src/routes/index.tsx", "utf-8");

// 1. Add state for RPE
code = code.replace(
  /const \[rest, setRest\] = useState\(""\);/,
  `const [rest, setRest] = useState("");\n  const [rpe, setRpe] = useState("");`
);

// 2. Clear RPE
code = code.replace(
  /setRest\(""\);/,
  `setRest("");\n    setRpe("");`
);

// 3. Validation for RPE
code = code.replace(
  /const restInvalid = rest\.trim\(\) !== "" && isInvalid\(rest\);/,
  `const restInvalid = rest.trim() !== "" && isInvalid(rest);\n  const rpeInvalid = rpe.trim() !== "" && (!Number.isInteger(Number(rpe)) || Number(rpe) < 0);`
);

code = code.replace(
  /const hasInvalid = activeFields\.some\(isInvalid\) \|\| restInvalid;/,
  `const hasInvalid = activeFields.some(isInvalid) || restInvalid || rpeInvalid;`
);

// 4. Save logic
code = code.replace(
  /: \{ weight: num\(weight\), sets: num\(sets\), reps: num\(reps\) \}\),/,
  `: { weight: num(weight), sets: num(sets), reps: num(reps), ...(rpe.trim() === "" ? {} : { rpe: num(rpe) }) }),`
);

// 5. UI layout
code = code.replace(
  /<div className="grid grid-cols-3 gap-3">\n\s*<Field label="Peso \(kg\)" value=\{weight\} onChange=\{setWeight\} step="0.5" invalid=\{isInvalid\(weight\)\} \/>\n\s*<Field label="Series" value=\{sets\} onChange=\{setSets\} invalid=\{isInvalid\(sets\)\} \/>\n\s*<Field label="Repeticiones" value=\{reps\} onChange=\{setReps\} invalid=\{isInvalid\(reps\)\} \/>\n\s*<\/div>/,
  `<div className="grid grid-cols-2 gap-3">
              <Field label="Peso (kg)" value={weight} onChange={setWeight} step="0.5" invalid={isInvalid(weight)} />
              <Field label="Series" value={sets} onChange={setSets} invalid={isInvalid(sets)} />
              <Field label="Repeticiones" value={reps} onChange={setReps} invalid={isInvalid(reps)} />
              <Field label="RPE" value={rpe} onChange={setRpe} min="0" step="1" invalid={rpeInvalid} />
            </div>`
);

// 6. Fix "Todos los campos deben tener un valor de 1 o mayor" text to include RPE note if invalid
code = code.replace(
  /\{hasInvalid && \(\n\s*<p className="text-xs font-medium text-destructive">\n\s*Todos los campos deben tener un valor de 1 o mayor.\n\s*<\/p>\n\s*\)\}/,
  `{hasInvalid && (
            <p className="text-xs font-medium text-destructive">
              Revisa los campos en rojo. RPE debe ser entero positivo (0+), los demás deben ser 1 o mayor.
            </p>
          )}`
);

fs.writeFileSync("src/routes/index.tsx", code);
