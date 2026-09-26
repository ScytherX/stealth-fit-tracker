import fs from "fs";

let code = fs.readFileSync("src/routes/historial.tsx", "utf-8");

// Add DropdownMenu imports
code = code.replace(
  /import \{ Download, Trash2, FileUp \} from "lucide-react";/,
  `import { Download, Trash2, FileUp, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";`
);

// Replace the Export/Import UI block
const oldBlockRegex = /<div className="grid grid-cols-2 gap-3 mt-3">[\s\S]*?<\/div>\n\s*<\/div>/;

const newBlock = `<div className="grid grid-cols-2 gap-3 mt-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="h-12 rounded-xl w-full">
              <Download className="size-5 mr-2" />
              Exportar
              <ChevronDown className="size-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[calc(50vw-1.5rem)] min-w-[160px] rounded-xl" align="start">
            <DropdownMenuItem className="py-2.5 rounded-lg" onClick={() => { downloadCSV(filtered); toast.success("CSV descargado"); }}>
              Formato CSV
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2.5 rounded-lg" onClick={handleExportText}>
              Formato Texto (TXT)
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2.5 rounded-lg" onClick={handleExportPDF}>
              Documento PDF
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2.5 rounded-lg" onClick={handleExportImage}>
              Imagen (PNG)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex h-12">
          <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.txt,.pdf,image/*" onChange={handleFileUpload} />
          <Button variant="outline" className="h-full rounded-xl w-full" onClick={() => fileInputRef.current?.click()}>
            <FileUp className="size-5 mr-2" />
            Importar
          </Button>
        </div>
      </div>`;

code = code.replace(oldBlockRegex, newBlock);

fs.writeFileSync("src/routes/historial.tsx", code);
