import fs from "fs";
let code = fs.readFileSync("src/routes/index.tsx", "utf-8");

code = code.replace(
  /const \[category, setCategory\] = useState<Category>\("Pecho"\);/,
  `const [category, setCategory] = useState<Category>("Pecho");\n  const getLocalizedName = useLocalizedName();`
);

fs.writeFileSync("src/routes/index.tsx", code);
