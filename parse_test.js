import fs from "fs";
let content = fs.readFileSync("src/lib/dataset.ts", "utf-8");
let match = content.match(/export const DATASET_EXERCISES: Exercise\[\] = (\[[\s\S]*\]);/);
if (match) {
  let arr = JSON.parse(match[1]);
  console.log("Parsed! Length:", arr.length);
} else {
  console.log("Failed to match array");
}
