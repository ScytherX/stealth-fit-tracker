import fs from "fs";
let code = fs.readFileSync("src/lib/i18n.ts", "utf-8");

const esMore = `
    "measurement_date": "Fecha de la medición",
    "ffmi": "FFMI",
    "day_records": "Registros del día",
    "history_title": "Historial",
    "filter_category": "Filtrar por categoría",
    "all": "Todas",
    "view_specific_day": "Ver un día específico",
    "progress_title": "Progreso",
    "body_weight": "Peso corporal",
    "page_not_found": "Page not found",
    "front": "FRENTE",
    "back": "ESPALDA",
    "most_worked_group": "Grupo más trabajado",
    "select_date": "Selecciona una fecha",
`;

const enMore = `
    "measurement_date": "Measurement date",
    "ffmi": "FFMI",
    "day_records": "Day's records",
    "history_title": "History",
    "filter_category": "Filter by category",
    "all": "All",
    "view_specific_day": "View specific day",
    "progress_title": "Progress",
    "body_weight": "Body weight",
    "page_not_found": "Page not found",
    "front": "FRONT",
    "back": "BACK",
    "most_worked_group": "Most worked group",
    "select_date": "Select a date",
`;

code = code.replace(/"nav_exercises": "Ejercicios",/, esMore + '\n    "nav_exercises": "Ejercicios",');
code = code.replace(/"nav_exercises": "Exercises",/, enMore + '\n    "nav_exercises": "Exercises",');

fs.writeFileSync("src/lib/i18n.ts", code);
