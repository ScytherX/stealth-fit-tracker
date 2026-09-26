import fs from "fs";
let code = fs.readFileSync("src/lib/gym-store.ts", "utf-8");

code = code.replace(
  /\{ id: "press-banca", name: "Press de banca", category: "Pecho" \},/,
  `{ id: "press-banca", name: "Press de banca", nameEn: "Bench Press", nameEs: "Press de banca", category: "Pecho" },`
);
code = code.replace(
  /\{ id: "aperturas", name: "Aperturas", category: "Pecho" \},/,
  `{ id: "aperturas", name: "Aperturas", nameEn: "Chest Fly", nameEs: "Aperturas", category: "Pecho" },`
);
code = code.replace(
  /\{ id: "fondos", name: "Fondos", category: "Pecho" \},/,
  `{ id: "fondos", name: "Fondos", nameEn: "Dips", nameEs: "Fondos", category: "Pecho" },`
);
code = code.replace(
  /\{ id: "dominadas", name: "Dominadas", category: "Espalda" \},/,
  `{ id: "dominadas", name: "Dominadas", nameEn: "Pull-ups", nameEs: "Dominadas", category: "Espalda" },`
);
code = code.replace(
  /\{ id: "remo-barra", name: "Remo con barra", category: "Espalda" \},/,
  `{ id: "remo-barra", name: "Remo con barra", nameEn: "Barbell Row", nameEs: "Remo con barra", category: "Espalda" },`
);
code = code.replace(
  /\{ id: "jalon-pecho", name: "Jalón al pecho", category: "Espalda" \},/,
  `{ id: "jalon-pecho", name: "Jalón al pecho", nameEn: "Lat Pulldown", nameEs: "Jalón al pecho", category: "Espalda" },`
);
code = code.replace(
  /\{ id: "sentadillas", name: "Sentadillas", category: "Piernas" \},/,
  `{ id: "sentadillas", name: "Sentadillas", nameEn: "Squats", nameEs: "Sentadillas", category: "Piernas" },`
);
code = code.replace(
  /\{ id: "prensa", name: "Prensa", category: "Piernas" \},/,
  `{ id: "prensa", name: "Prensa", nameEn: "Leg Press", nameEs: "Prensa", category: "Piernas" },`
);
code = code.replace(
  /\{ id: "peso-muerto-rumano", name: "Peso muerto rumano", category: "Piernas" \},/,
  `{ id: "peso-muerto-rumano", name: "Peso muerto rumano", nameEn: "Romanian Deadlift", nameEs: "Peso muerto rumano", category: "Piernas" },`
);

fs.writeFileSync("src/lib/gym-store.ts", code);
