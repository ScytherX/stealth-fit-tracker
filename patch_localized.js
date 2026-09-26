import fs from "fs";
let code = fs.readFileSync("src/lib/gym-store.ts", "utf-8");

if (!code.includes("export function useLocalizedName(")) {
code += `
export function useLocalizedName() {
  const { lang } = useLanguage();
  return (exercise: { name: string; nameEs?: string; nameEn?: string }) => {
    if (lang === "es") return exercise.nameEs || exercise.name;
    if (lang === "en") return exercise.nameEn || exercise.name;
    return exercise.name;
  };
}
`;
fs.writeFileSync("src/lib/gym-store.ts", code);
}
