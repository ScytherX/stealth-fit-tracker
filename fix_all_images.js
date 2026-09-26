import fs from "fs";
let code = fs.readFileSync("src/components/CategorySelector.tsx", "utf-8");

// Since all 7 categories now have images, we don't need the ternary check
code = code.replace(
  /\{\["Pecho", "Espalda", "Hombros", "Piernas", "Brazos", "Abdomen"\]\.includes\(category\) \? \([\s\S]*?\) : \([\s\S]*?\)\}/,
  `<img \n                src={\`/\${category.toLowerCase()}.png\`} \n                alt={category} \n                className="w-10 h-10 object-contain rounded-md" \n              />`
);

fs.writeFileSync("src/components/CategorySelector.tsx", code);
