import fs from 'fs';

async function main() {
  console.log("Fetching data...");
  const response = await fetch("https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json");
  const data = await response.json();
  
  console.log("Total exercises found:", data.length);
  
  const mapped = [];
  const mapBodyPartToCategory = (bodyPart, name) => {
    switch (bodyPart) {
      case "chest": return "Pecho";
      case "back": return "Espalda";
      case "lower legs":
      case "upper legs": return "Piernas";
      case "shoulders": return "Hombros";
      case "upper arms":
      case "lower arms": return "Brazos";
      case "cardio": return "Cardio";
      default: 
        if (bodyPart === "waist") {
            return "Abdomen"; // I will add "Core" or "Abdomen" to categories. Let's use "Core".
        }
        if (bodyPart === "neck") {
            return "Hombros"; // Group neck with shoulders
        }
        return null;
    }
  };

  const seenIds = new Set();

  for (const ex of data) {
    const cat = mapBodyPartToCategory(ex.body_part, ex.name);
    if (!cat) continue;
    
    const name = ex.name || ex.id;
    if (seenIds.has(ex.id)) continue;
    seenIds.add(ex.id);
    
    const titleName = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    mapped.push({
      id: ex.id,
      name: titleName,
      category: cat
    });
  }

  console.log("Mapped exercises:", mapped.length);
  
  const content = `import { Exercise } from "./gym-store";\n\nexport const DATASET_EXERCISES: Exercise[] = ${JSON.stringify(mapped, null, 2)};\n`;
  fs.writeFileSync("src/lib/dataset.ts", content);
  console.log("Written to src/lib/dataset.ts");
}
main().catch(console.error);
