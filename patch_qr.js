import fs from "fs";
let code = fs.readFileSync("src/components/RoutinesFab.tsx", "utf-8");

// Imports
code = code.replace(
  /import \{ Check, ChevronRight, Dumbbell, Play, Plus, Search, Trash2, X \} from "lucide-react";/,
  `import { Check, ChevronRight, Dumbbell, Play, Plus, Search, Trash2, X, Share2, QrCode } from "lucide-react";\nimport QRCode from "react-qr-code";\nimport { Html5QrcodeScanner } from "html5-qrcode";`
);

// Add Dialog components
code = code.replace(
  /DialogTrigger,\n\} from "@\/components\/ui\/dialog";/,
  `DialogTrigger,\n  DialogDescription,\n} from "@/components/ui/dialog";`
);

// We need state for QR scanning and sharing
const stateCode = `
  const [shareRoutine, setShareRoutine] = useState<Routine | null>(null);
  const [scanOpen, setScanOpen] = useState(false);
  
  useEffect(() => {
    if (!scanOpen) return;
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
    scanner.render(
      (text) => {
        try {
          const r = JSON.parse(text);
          if (r && r.name && r.items) {
            r.id = uid();
            saveRoutine(r);
            toast.success("Rutina importada", { description: r.name });
            setScanOpen(false);
            scanner.clear();
          }
        } catch(e) {
          toast.error("QR no válido para rutinas");
        }
      },
      (error) => {}
    );
    return () => { scanner.clear().catch(()=>{}); };
  }, [scanOpen, saveRoutine]);
`;

code = code.replace(
  /const \[listOpen, setListOpen\] = useState\(false\);/,
  `const [listOpen, setListOpen] = useState(false);\n${stateCode}`
);

// QR Scanner UI and QR Share UI
const qrUI = `
            {/* Share Routine Dialog */}
            <Dialog open={!!shareRoutine} onOpenChange={(o) => !o && setShareRoutine(null)}>
              <DialogContent className="max-w-sm text-center">
                <DialogHeader>
                  <DialogTitle>Compartir rutina</DialogTitle>
                  <DialogDescription>
                    Pide a tu amigo que escanee este código desde la sección Mis Rutinas de su app.
                  </DialogDescription>
                </DialogHeader>
                <div className="mx-auto mt-4 bg-white p-4 rounded-xl">
                  {shareRoutine && <QRCode value={JSON.stringify({name: shareRoutine.name, items: shareRoutine.items})} size={200} />}
                </div>
              </DialogContent>
            </Dialog>

            {/* Scan QR Dialog */}
            <Dialog open={scanOpen} onOpenChange={setScanOpen}>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Escanear rutina</DialogTitle>
                </DialogHeader>
                <div id="reader" className="mt-4 w-full overflow-hidden rounded-xl"></div>
              </DialogContent>
            </Dialog>

            <div className="flex gap-2">
              <Button
                onClick={() => setScanOpen(true)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                <QrCode className="size-4 mr-2" /> Escanear QR
              </Button>
              <Button
                onClick={() => {
                  setDraft({ id: uid(), name: "", items: [] });
                }}
                className="flex-1 rounded-xl"
              >
                <Plus className="size-4 mr-2" /> Crear nueva
              </Button>
            </div>
`;

code = code.replace(
  /<Button\n\s*onClick=\{\(\) => \{\n\s*setDraft\(\{ id: uid\(\), name: "", items: \[\] \}\);\n\s*\}\}\n\s*className="w-full rounded-xl"\n\s*>\n\s*<Plus className="size-4 mr-2" \/> Crear nueva rutina\n\s*<\/Button>/,
  qrUI
);

// Add Share2 button to each routine
code = code.replace(
  /<Button\n\s*variant="ghost"\n\s*size="icon"\n\s*className="size-8"\n\s*onClick=\{\(e\) => \{\n\s*e\.stopPropagation\(\);\n\s*removeRoutine\(r\.id\);\n\s*\}\}\n\s*>/,
  `<Button
                    variant="ghost"
                    size="icon"
                    className="size-8 mr-1 text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareRoutine(r);
                    }}
                  >
                    <Share2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRoutine(r.id);
                    }}
                  >`
);

fs.writeFileSync("src/components/RoutinesFab.tsx", code);
