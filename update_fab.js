import fs from "fs";
let code = fs.readFileSync("src/components/RoutinesFab.tsx", "utf-8");

code = code.replace(/>Mis Rutinas</g, `>{t("my_routines")}<`);
code = code.replace(/>Crear rutina</g, `>{t("create_routine")}<`);
code = code.replace(/>Elige una de tus rutinas predefinidas</g, `>{t("choose_routine")}<`);
code = code.replace(/>Registrar</g, `>{t("log")}<`);
code = code.replace(/>Sin ejercicios</g, `>{t("no_exercises")}<`);
code = code.replace(/>Editar rutina</g, `>{t("edit_routine")}<`);
code = code.replace(/>Nueva rutina</g, `>{t("new_routine")}<`);
code = code.replace(/>Nombre de la rutina</g, `>{t("routine_name")}<`);
code = code.replace(/placeholder="Ej\. Día de empuje"/g, `placeholder={t("routine_name_placeholder")}`);
code = code.replace(/aria-label="Quitar ejercicio"/g, `aria-label={t("remove_exercise")}`);
code = code.replace(/>Agregar ejercicio</g, `>{t("add_exercise")}<`);
code = code.replace(/>Completa los valores con un número igual o mayor a 1\.</g, `>{t("fill_values")}<`);
code = code.replace(/"Agrega al menos un ejercicio para guardar la rutina\."/g, `t("add_at_least_one")`);
code = code.replace(/"Escribe un nombre para la rutina\."/g, `t("give_name")`);
code = code.replace(/>Guardar rutina</g, `>{t("save_routine")}<`);
code = code.replace(/"Rutina importada"/g, `t("routine_imported")`);
code = code.replace(/"QR no válido para rutinas"/g, `t("invalid_qr")`);
code = code.replace(/"Esta rutina no tiene ejercicios"/g, `t("routine_no_exercises")`);
code = code.replace(/"Rutina registrada"/g, `t("routine_logged")`);
code = code.replace(/>Pide a tu amigo que escanee o pegue este código\.</g, `>{t("scan_or_paste")}<`);
code = code.replace(/>Copiar código de texto</g, `>{t("copy_code")}<`);
code = code.replace(/"Código de la rutina copiado"/g, `t("code_copied")`);
code = code.replace(/>Si la cámara no funciona, pega el código aquí:</g, `>{t("paste_here")}<`);
code = code.replace(/placeholder="Pega el código de texto\.\.\."/g, `placeholder={t("paste_placeholder")}`);
code = code.replace(/>Escanear QR</g, `>{t("scan_qr")}<`);

// Also update the category names
code = code.replace(/>Categoría</g, `>{t("category")}<`);
code = code.replace(/>Ejercicio</g, `>{t("exercise")}<`);

fs.writeFileSync("src/components/RoutinesFab.tsx", code);
