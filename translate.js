import fs from "fs";
import { translate } from "@vitalets/google-translate-api";

(async () => {
    let content = fs.readFileSync("src/lib/dataset.ts", "utf-8");
    let match = content.match(/export const DATASET_EXERCISES: Exercise\[\] = (\[[\s\S]*\]);/);
    let arr = JSON.parse(match[1]);

    console.log(`Translating ${arr.length} exercises...`);
    
    // Process in batches
    const BATCH_SIZE = 100;
    for (let i = 0; i < arr.length; i += BATCH_SIZE) {
        const batch = arr.slice(i, i + BATCH_SIZE);
        console.log(`Processing batch ${i} to ${i + BATCH_SIZE - 1}...`);
        
        await Promise.all(batch.map(async (ex) => {
            ex.nameEn = ex.name;
            if (ex.nameEs && ex.nameEs !== ex.name) return; // skip if already translated
            try {
                const res = await translate(ex.name, { to: "es" });
                ex.nameEs = res.text;
                await new Promise(r => setTimeout(r, 100)); // sleep to avoid rate limiting
            } catch (err) {
                console.error(`Failed to translate ${ex.name}: ${err.message}`);
                ex.nameEs = ex.name; // fallback
            }
        }));
        
        const outStr = `import { Exercise } from "./gym-store";\n\nexport const DATASET_EXERCISES: Exercise[] = ${JSON.stringify(arr, null, 2)};\n`;
        fs.writeFileSync("src/lib/dataset.ts", outStr);
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log("Done!");
})();
