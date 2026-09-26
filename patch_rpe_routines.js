import fs from "fs";
let code = fs.readFileSync("src/components/RoutinesFab.tsx", "utf-8");

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
  /const canAdd = !!current && !fieldsInvalid && !invalid\(rest, \{ required: false \}\);/,
  `const rpeInvalid = rpe.trim() !== "" && (!Number.isInteger(Number(rpe)) || Number(rpe) < 0);\n  const canAdd = !!current && !fieldsInvalid && !invalid(rest, { required: false }) && !rpeInvalid;`
);

// 4. Save logic
code = code.replace(
  /rest: num\(rest\),\n\s*\}\];/,
  `rest: num(rest),\n        ...(rpe.trim() ? { rpe: num(rpe) } : {}),\n      }];`
);

// 5. UI layout
code = code.replace(
  /<div className="grid grid-cols-3 gap-2">\n\s*\{isCardio \? \(\n\s*<>\n\s*<MiniField label="Min" value=\{minutes\} onChange=\{setMinutes\} \/>\n\s*<MiniField label="km\/h" value=\{speed\} onChange=\{setSpeed\} step="0.1" \/>\n\s*<MiniField label="Incl. %" value=\{incline\} onChange=\{setIncline\} step="0.5" \/>\n\s*<\/>\n\s*\) : \(\n\s*<>\n\s*<MiniField label="Kg" value=\{weight\} onChange=\{setWeight\} step="0.5" \/>\n\s*<MiniField label="Series" value=\{sets\} onChange=\{setSets\} \/>\n\s*<MiniField label="Reps" value=\{reps\} onChange=\{setReps\} \/>\n\s*<\/>\n\s*\)\}/,
  `<div className={isCardio ? "grid grid-cols-3 gap-2" : "grid grid-cols-2 gap-2"}>
              {isCardio ? (
                <>
                  <MiniField label="Min" value={minutes} onChange={setMinutes} />
                  <MiniField label="km/h" value={speed} onChange={setSpeed} step="0.1" />
                  <MiniField label="Incl. %" value={incline} onChange={setIncline} step="0.5" />
                </>
              ) : (
                <>
                  <MiniField label="Kg" value={weight} onChange={setWeight} step="0.5" />
                  <MiniField label="Series" value={sets} onChange={setSets} />
                  <MiniField label="Reps" value={reps} onChange={setReps} />
                  <MiniField label="RPE (0+)" value={rpe} onChange={setRpe} />
                </>
              )}`
);

fs.writeFileSync("src/components/RoutinesFab.tsx", code);
