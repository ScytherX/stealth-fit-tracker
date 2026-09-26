import fs from "fs";

function replaceRPE(filepath) {
  let code = fs.readFileSync(filepath, "utf-8");
  
  // Replace camelCase & lowercase
  code = code.replace(/rpe/g, "rir");
  code = code.replace(/setRpe/g, "setRir");
  code = code.replace(/Rpe/g, "Rir"); // Just in case
  
  // Replace uppercase strings
  code = code.replace(/RPE/g, "RIR");
  
  fs.writeFileSync(filepath, code);
}

replaceRPE("src/lib/gym-store.ts");
replaceRPE("src/routes/index.tsx");
replaceRPE("src/components/RoutinesFab.tsx");

