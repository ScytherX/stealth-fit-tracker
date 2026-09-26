import fs from "fs";
let code = fs.readFileSync("src/routes/index.tsx", "utf-8");

code = code.replace(/>Fecha del entrenamiento</, `>{t("workout_date")}<`);
code = code.replace(/>Puedes registrar entrenamientos de días anteriores\.</, `>{t("past_workout_note")}<`);
code = code.replace(/>Grupo muscular \/ Categoría</, `>{t("muscle_category")}<`);
code = code.replace(/>Ejercicio</, `>{t("exercise")}<`);
code = code.replace(/Nuevo\s*<\/Button>/, `{t("new")}</Button>`);
code = code.replace(/>Nuevo ejercicio</, `>{t("new_exercise")}<`);
code = code.replace(/>Nombre</, `>{t("name")}<`);

fs.writeFileSync("src/routes/index.tsx", code);
