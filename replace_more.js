import fs from "fs";

function replaceFile(path, replaces) {
  let code = fs.readFileSync(path, "utf-8");
  for (let [find, rep] of replaces) {
    code = code.replace(find, rep);
  }
  fs.writeFileSync(path, code);
}

replaceFile("src/routes/cuerpo.tsx", [
  [/>Fecha de la medición</g, `>{t("measurement_date")}<`],
  [/>FFMI</g, `>{t("ffmi")}<`]
]);

replaceFile("src/routes/dia.tsx", [
  [/>Registros del día</g, `>{t("day_records")}<`]
]);

replaceFile("src/routes/historial.tsx", [
  [/>Historial</g, `>{t("history_title")}<`],
  [/>Filtrar por categoría</g, `>{t("filter_category")}<`],
  [/>Todas</g, `>{t("all")}<`],
  [/>Ver un día específico</g, `>{t("view_specific_day")}<`]
]);

replaceFile("src/routes/progreso.tsx", [
  [/>Progreso</g, `>{t("progress_title")}<`],
  [/>Ejercicio</g, `>{t("exercise")}<`],
  [/>Peso corporal</g, `>{t("body_weight")}<`]
]);

replaceFile("src/routes/__root.tsx", [
  [/>Page not found</g, `>{t("page_not_found")}<`]
]);

// For MuscleHeatmap and WeeklySummary and WorkoutCalendar, we first need to ensure useTranslation is imported and used
let hm = fs.readFileSync("src/components/MuscleHeatmap.tsx", "utf-8");
if (!hm.includes("useTranslation")) {
  hm = hm.replace(/import \{.*?\} from "@\/lib\/gym-store";/, match => match.replace("}", ", useTranslation }"));
  hm = hm.replace(/export function MuscleHeatmap.*\{/, match => match + `\n  const t = useTranslation();`);
  hm = hm.replace(/>FRENTE</g, `>{t("front")}<`);
  hm = hm.replace(/>ESPALDA</g, `>{t("back")}<`);
  fs.writeFileSync("src/components/MuscleHeatmap.tsx", hm);
}

let ws = fs.readFileSync("src/components/WeeklySummary.tsx", "utf-8");
if (!ws.includes("useTranslation")) {
  ws = ws.replace(/import \{.*?\} from "@\/lib\/gym-store";/, match => match.replace("}", ", useTranslation }"));
  ws = ws.replace(/export function WeeklySummary.*\{/, match => match + `\n  const t = useTranslation();`);
  ws = ws.replace(/>Grupo más trabajado</g, `>{t("most_worked_group")}<`);
  fs.writeFileSync("src/components/WeeklySummary.tsx", ws);
}

let wc = fs.readFileSync("src/components/WorkoutCalendar.tsx", "utf-8");
if (!wc.includes("useTranslation")) {
  wc = wc.replace(/import \{.*?\} from "@\/lib\/gym-store";/, match => match.replace("}", ", useTranslation }"));
  wc = wc.replace(/export function WorkoutCalendar.*\{/, match => match + `\n  const t = useTranslation();`);
  wc = wc.replace(/>Selecciona una fecha</g, `>{t("select_date")}<`);
  fs.writeFileSync("src/components/WorkoutCalendar.tsx", wc);
}

