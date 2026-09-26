import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Download, Trash2, FileUp, ChevronDown } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { WorkoutCalendar } from "@/components/WorkoutCalendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, describeLog, downloadCSV, useLogs, type Category, useExercises, useLocalizedName, useTranslation } from "@/lib/gym-store";

export const Route = createFileRoute("/historial")({
  head: () => ({
    meta: [
      { title: "Historial y exportación CSV" },
      {
        name: "description",
        content:
          "Consulta todo tu historial de entrenamientos y expórtalo a CSV con columnas de fuerza y cardio.",
      },
      { property: "og:title", content: "Historial y exportación CSV" },
      {
        property: "og:description",
        content: "Tu historial completo, filtrable y exportable a CSV.",
      },
    ],
  }),
  component: HistorialPage,
});

function HistorialPage() {
  const { logs, removeLog } = useLogs();
  const { exercises } = useExercises();
  const getLocalizedName = useLocalizedName();
  const t = useTranslation();
  const [filter, setFilter] = useState<Category | "Todas">("Todas");
  const [day, setDay] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportText = () => {
    if (filtered.length === 0) return;
    const text = filtered.map(l => `${new Date(l.date).toLocaleDateString()} - ${getLocalizedName((exercises.find((e: any) => e.id === l.exerciseId) || l) as any)}: ${describeLog(l as any)}`).join("\n");
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
      doc.text(`${new Date(l.date).toLocaleDateString()} - ${getLocalizedName((exercises.find((e: any) => e.id === l.exerciseId) || l) as any)}: ${describeLog(l as any)}`, 10, y);
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
        import("pdfjs-dist").then(async (pdfjs) => {
          pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: any) => item.str).join(" ") + "\n";
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

  const [defaultDay, setDefaultDay] = useState("");

  useEffect(() => {
    setDefaultDay(new Date().toLocaleDateString("sv-SE"));
  }, []);

  const filtered = useMemo(
    () =>
      logs.filter(
        (l) =>
          (filter === "Todas" || l.category === filter) &&
          (day === "" || new Date(l.date).toLocaleDateString("sv-SE") === day),
      ),
    [logs, filter, day],
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .forEach((l) => {
        const key = new Date(l.date).toLocaleDateString("sv-SE");
        map.set(key, [...(map.get(key) ?? []), l]);
      });
    return [...map.entries()];
  }, [filtered]);

  return (
    <main className="mx-auto w-full max-w-lg px-4 pt-8">
      <h1 className="text-3xl font-extrabold">{t("history_title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {logs.length} registro{logs.length === 1 ? "" : "s"} guardados en este dispositivo.
      </p>

      <div className="mt-6 grid gap-2">
        <Label>{t("filter_category")}</Label>
        <Select value={filter} onValueChange={(v) => setFilter(v as Category | "Todas")}>
          <SelectTrigger className="h-12 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">{t("all")}</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 grid gap-2">
        <Label>{t("view_specific_day")}</Label>
        <div className="flex gap-2">
          <WorkoutCalendar
            value={day || defaultDay}
            onChange={setDay}
            className={day ? "" : "text-muted-foreground"}
          />
          {day && (
            <Button variant="secondary" className="h-12 rounded-xl" onClick={() => setDay("")}>
              Todos
            </Button>
          )}
        </div>
      </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="h-12 rounded-xl w-full">
              <Download className="size-5 mr-2" />
              Exportar
              <ChevronDown className="size-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[calc(50vw-1.5rem)] min-w-[160px] rounded-xl" align="start">
            <DropdownMenuItem className="py-2.5 rounded-lg cursor-pointer" onClick={() => { downloadCSV(filtered); toast.success("CSV descargado"); }}>
              Formato CSV
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2.5 rounded-lg cursor-pointer" onClick={handleExportText}>
              Formato Texto (TXT)
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2.5 rounded-lg cursor-pointer" onClick={handleExportPDF}>
              Documento PDF
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2.5 rounded-lg cursor-pointer" onClick={handleExportImage}>
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
      </div>


      <div className="mt-6 grid gap-6" id="historial-list">
        {groups.map(([key, items]) => (
          <section key={key}>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {new Date(items[0]!.date).toLocaleDateString("es-MX", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </h2>
            <ul className="grid gap-2">
              {items.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{getLocalizedName((exercises.find((e: any) => e.id === l.exerciseId) || l) as any)}</p>
                    <p className="text-xs text-muted-foreground">{describeLog(l)}</p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wider text-primary">
                      {l.category} · {new Date(l.date).toLocaleTimeString("es-MX", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Eliminar registro"
                    onClick={() => removeLog(l.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Sin registros todavía.
        </p>
      )}
    </main>
  );
}