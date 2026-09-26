import fs from "fs";
let code = fs.readFileSync("src/lib/gym-store.ts", "utf-8");

code = code.replace(
  /export function describeLog\(l: LogEntry\) \{\n\s*const rest = l\.rest != null \? ` · descanso \$\{l\.rest\}s` : "";\n\s*if \(l\.category === "Cardio"\) \{\n\s*return `\$\{l\.minutes \?\? 0\} min · \$\{l\.speed \?\? 0\} km\/h · \$\{l\.incline \?\? 0\}% inclinación\$\{rest\}`;\n\s*\}\n\s*return `\$\{l\.weight \?\? 0\} kg · \$\{l\.sets \?\? 0\} series × \$\{l\.reps \?\? 0\} reps\$\{rest\}`;\n\}/,
  `export function describeLog(l: LogEntry) {
  const rest = l.rest != null ? \` · descanso \${l.rest}s\` : "";
  if (l.category === "Cardio") {
    return \`\${l.minutes ?? 0} min · \${l.speed ?? 0} km/h · \${l.incline ?? 0}% inclinación\${rest}\`;
  }
  const rpeStr = l.rpe != null ? \` · RPE \${l.rpe}\` : "";
  return \`\${l.weight ?? 0} kg · \${l.sets ?? 0} series × \${l.reps ?? 0} reps\${rpeStr}\${rest}\`;
}`
);

code = code.replace(
  /export function describeRoutineItem\(i: RoutineItem\) \{\n\s*const rest = i\.rest != null \? ` · descanso \$\{i\.rest\}s` : "";\n\s*if \(i\.category === "Cardio"\) \{\n\s*return `\$\{i\.minutes \?\? 0\} min · \$\{i\.speed \?\? 0\} km\/h · \$\{i\.incline \?\? 0\}%\$\{rest\}`;\n\s*\}\n\s*return `\$\{i\.weight \?\? 0\} kg · \$\{i\.sets \?\? 0\} × \$\{i\.reps \?\? 0\}\$\{rest\}`;\n\}/,
  `export function describeRoutineItem(i: RoutineItem) {
  const rest = i.rest != null ? \` · descanso \${i.rest}s\` : "";
  if (i.category === "Cardio") {
    return \`\${i.minutes ?? 0} min · \${i.speed ?? 0} km/h · \${i.incline ?? 0}%\${rest}\`;
  }
  const rpeStr = i.rpe != null ? \` · RPE \${i.rpe}\` : "";
  return \`\${i.weight ?? 0} kg · \${i.sets ?? 0} × \${i.reps ?? 0}\${rpeStr}\${rest}\`;
}`
);

fs.writeFileSync("src/lib/gym-store.ts", code);
