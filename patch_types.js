import fs from "fs";
let code = fs.readFileSync("src/lib/gym-store.ts", "utf-8");
code = code.replace(
  /export type Exercise = \{[\s\S]*?\};/,
  `export type Exercise = {
  id: string;
  name: string;
  nameEs?: string;
  nameEn?: string;
  category: Category;
  custom?: boolean;
};`
);
code = code.replace(
  /export type LogEntry = \{[\s\S]*?\};/,
  `export type LogEntry = {
  id: string;
  date: string;
  exerciseId: string;
  exerciseName: string;
  exerciseNameEs?: string;
  exerciseNameEn?: string;
  category: Category;
  weight?: number | undefined;
  sets?: number | undefined;
  reps?: number | undefined;
  minutes?: number | undefined;
  speed?: number | undefined;
  incline?: number | undefined;
  rest?: number | undefined;
  notes?: string | undefined;
};`
);
code = code.replace(
  /export type RoutineItem = \{[\s\S]*?\};/,
  `export type RoutineItem = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  exerciseNameEs?: string;
  exerciseNameEn?: string;
  category: Category;
  weight?: number | undefined;
  sets?: number | undefined;
  reps?: number | undefined;
  minutes?: number | undefined;
  speed?: number | undefined;
  incline?: number | undefined;
  rest?: number | undefined;
};`
);
code = code.replace(
  /const BODYWEIGHT_KEY = "gymlog.bodyweights.v1";/,
  `const BODYWEIGHT_KEY = "gymlog.bodyweights.v1";\nconst LANGUAGE_KEY = "gymlog.language.v1";`
);
code += `
export function useLanguage() {
  const [lang, setLang] = useStoreValue<"es" | "en">(LANGUAGE_KEY, "es");
  return { lang, setLang };
}
`;
fs.writeFileSync("src/lib/gym-store.ts", code);
