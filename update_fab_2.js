import fs from "fs";
let code = fs.readFileSync("src/components/RoutinesFab.tsx", "utf-8");

code = code.replace(/>Mis rutinas</g, `>{t("my_routines")}<`);
code = code.replace(/>Selecciona un ejercicio</g, `>{t("select_exercise")}<`);
code = code.replace(/"Buscar ejercicio\.\.\."/g, `t("search_exercise")`);
code = code.replace(/>No se encontraron ejercicios\.</g, `>{t("no_exercises_found")}<`);

fs.writeFileSync("src/components/RoutinesFab.tsx", code);
