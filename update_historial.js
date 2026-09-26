import fs from "fs";

let code = fs.readFileSync("src/routes/historial.tsx", "utf-8");

// We will replace the current Export button with a custom Export/Import UI

const newImports = `
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import Tesseract from "tesseract.js";
import { Upload, FileText, Image as ImageIcon, FileOutput, FileUp } from "lucide-react";

// Config pdfjs worker
GlobalWorkerOptions.workerSrc = \`//cdnjs.cloudflare.com/ajax/libs/pdf.js/\${pdfjsLib?.version || '4.0.189'}/pdf.worker.min.js\`;
`;

code = code.replace(
  /import \{ Download, Calendar, Dumbbell \} from "lucide-react";/,
  `import { Download, Calendar, Dumbbell, Upload, FileText, Image as ImageIcon, FileOutput, FileUp } from "lucide-react";\nimport { jsPDF } from "jspdf";\nimport html2canvas from "html2canvas";`
);

// We need to inject the logic into HistorialPage

const logic = `
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExportText = () => {
    if (filtered.length === 0) return;
    const text = filtered.map(l => \`\${new Date(l.date).toLocaleDateString()} - \${l.exerciseName}: \${describeLog(l as any)}\`).join("\\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "historial.txt";
    a.click();
  };

  const handleExportPDF = () => {
    if (filtered.length === 0) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Historial de Entrenamiento", 10, 10);
    doc.setFontSize(10);
    let y = 20;
    filtered.forEach((l) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(\`\${new Date(l.date).toLocaleDateString()} - \${l.exerciseName}: \${describeLog(l as any)}\`, 10, y);
      y += 7;
    });
    doc.save("historial.pdf");
  };

  const handleExportImage = async () => {
    if (filtered.length === 0) return;
    const el = document.getElementById("historial-list");
    if (!el) return;
    try {
      const canvas = await html2canvas(el);
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "historial.png";
      a.click();
    } catch (e) {
      console.error(e);
      toast.error("Error al generar la imagen");
    }
  };

  const parseImportedText = (text: string) => {
    toast.success("Importación completada (simulada)", { description: "Texto leído correctamente: " + text.slice(0, 30) + "..."});
    // Here we would parse CSV/TXT and use addLog()
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    toast.info("Procesando archivo...");
    try {
      if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
        const text = await file.text();
        parseImportedText(text);
      } else if (file.name.endsWith(".pdf")) {
        // PDFJS would be imported dynamically
        import("pdfjs-dist").then(async (pdfjs) => {
          pdfjs.GlobalWorkerOptions.workerSrc = \`//cdnjs.cloudflare.com/ajax/libs/pdf.js/\${pdfjs.version}/pdf.worker.min.js\`;
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: any) => item.str).join(" ") + "\\n";
          }
          parseImportedText(text);
        });
      } else if (file.type.startsWith("image/")) {
        import("tesseract.js").then(async (Tesseract) => {
          const result = await Tesseract.default.recognize(file, "spa");
          parseImportedText(result.data.text);
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al importar");
    }
  };
`;

code = code.replace(
  /const \[searchQuery, setSearchQuery\] = useState\(""\);/,
  `const [searchQuery, setSearchQuery] = useState("");\n${logic}`
);

const newButtons = `
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="flex flex-col gap-2 border border-border p-3 rounded-xl">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Exportar</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" size="sm" onClick={() => { downloadCSV(filtered); toast.success("CSV descargado"); }}>CSV</Button>
            <Button variant="secondary" size="sm" onClick={handleExportText}>TXT</Button>
            <Button variant="secondary" size="sm" onClick={handleExportPDF}>PDF</Button>
            <Button variant="secondary" size="sm" onClick={handleExportImage}>IMG</Button>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 border border-border p-3 rounded-xl">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Importar</p>
          <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.txt,.pdf,image/*" onChange={handleFileUpload} />
          <Button variant="outline" className="h-full" onClick={() => fileInputRef.current?.click()}>
            <FileUp className="size-5 mr-2" />
            Cargar archivo
          </Button>
        </div>
      </div>
`;

code = code.replace(
  /<Button\n\s*onClick=\{\(\) => \{\n\s*if \(filtered\.length === 0\) \{\n\s*toast\.error\("No hay registros para exportar"\);\n\s*return;\n\s*\}\n\s*downloadCSV\(filtered\);\n\s*toast\.success\("CSV descargado"\);\n\s*\}\}\n\s*variant="secondary"\n\s*className="mt-3 h-12 w-full gap-2 rounded-xl"\n\s*>\n\s*<Download className="size-5" \/> Exportar datos \(CSV\)\n\s*<\/Button>/,
  newButtons
);

code = code.replace(
  /<div className="mt-6 grid gap-6">/,
  `<div className="mt-6 grid gap-6" id="historial-list">`
);

fs.writeFileSync("src/routes/historial.tsx", code);
