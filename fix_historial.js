import fs from "fs";
let code = fs.readFileSync("src/routes/historial.tsx", "utf-8");

code = code.replace(
  /import \{ useLogs, Category \} from "@\/lib\/gym-store";/,
  `import { useLogs, Category, useLocalizedName, useExercises } from "@/lib/gym-store";`
);

code = code.replace(
  /const exercises = useGymStore\(\(s\) => s\.exercises\);/,
  `const { exercises } = useExercises();`
);

code = code.replace(
  /e => e\.id/g,
  `(e: any) => e.id`
);

fs.writeFileSync("src/routes/historial.tsx", code);
