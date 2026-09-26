import fs from "fs";
let code = fs.readFileSync("src/lib/gym-store.ts", "utf-8");

code = code.replace(
  /export type LogEntry = \{[\s\S]*?\};/,
  (match) => {
    if (!match.includes("rpe?:")) {
      return match.replace("};", "  rpe?: number | undefined;\n};");
    }
    return match;
  }
);

code = code.replace(
  /export type RoutineItem = \{[\s\S]*?\};/,
  (match) => {
    if (!match.includes("rpe?:")) {
      return match.replace("};", "  rpe?: number | undefined;\n};");
    }
    return match;
  }
);

fs.writeFileSync("src/lib/gym-store.ts", code);
