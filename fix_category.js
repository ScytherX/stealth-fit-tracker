import fs from "fs";
let code = fs.readFileSync("src/components/CategorySelector.tsx", "utf-8");

code = code.replace(
  `import { type Category, CATEGORIES } from "@/lib/gym-store";`,
  `import { type Category, CATEGORIES, useTranslation } from "@/lib/gym-store";`
);

code = code.replace(
  `export function CategorySelector({ value, onChange }: CategorySelectorProps) {`,
  `export function CategorySelector({ value, onChange }: CategorySelectorProps) {\n  const t = useTranslation();`
);

code = code.replace(
  `<span className="text-xs font-medium">{category}</span>`,
  `<span className="text-xs font-medium">{t(("cat_" + category) as any)}</span>`
);

fs.writeFileSync("src/components/CategorySelector.tsx", code);
