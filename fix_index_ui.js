import fs from "fs";
let code = fs.readFileSync("src/routes/index.tsx", "utf-8");
code = code.replace(
  /useLocalizedName \}/,
  `useLocalizedName, useTranslation }`
);
code = code.replace(
  /const getLocalizedName = useLocalizedName\(\);/,
  `const getLocalizedName = useLocalizedName();\n  const t = useTranslation();`
);
code = code.replace(/Registrar entrenamiento/g, `{t("log_workout")}`);
code = code.replace(/"Selecciona un ejercicio\.\.\."/g, `t("select_exercise")`);
code = code.replace(/"Buscar ejercicio\.\.\."/g, `t("search_exercise")`);
code = code.replace(/>No se encontraron ejercicios\.</g, `>{t("no_exercises_found")}<`);
code = code.replace(/>Tiempo \(min\)</g, `>{t("time_min")}<`);
code = code.replace(/>Velocidad \(km\/h\)</g, `>{t("speed_kmh")}<`);
code = code.replace(/>Inclinación \(%\)</g, `>{t("incline_pct")}<`);
code = code.replace(/>Peso \(kg\)</g, `>{t("weight")}<`);
code = code.replace(/>Repeticiones</g, `>{t("reps")}<`);
code = code.replace(/>RIR \(Reps en reserva\)</g, `>{t("rir")}<`);
code = code.replace(/>Añadir nota</g, `>{t("add_note")}<`);
code = code.replace(/>Guardar serie</g, `>{t("save_set")}<`);
code = code.replace(/>Crear ejercicio</g, `>{t("create_exercise")}<`);
code = code.replace(/>Nombre del ejercicio</g, `>{t("exercise_name")}<`);
code = code.replace(/>Categoría</g, `>{t("category")}<`);
code = code.replace(/>Guardar ejercicio</g, `>{t("save")}<`);
code = code.replace(/placeholder="Nota"/g, `placeholder={t("note")}`);
code = code.replace(/label="Tiempo \(min\)"/g, `label={t("time_min")}`);
code = code.replace(/label="Velocidad \(km\/h\)"/g, `label={t("speed_kmh")}`);
code = code.replace(/label="Inclinación \(%\)"/g, `label={t("incline_pct")}`);

fs.writeFileSync("src/routes/index.tsx", code);
