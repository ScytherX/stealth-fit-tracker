import fs from "fs";
let code = fs.readFileSync("src/components/RoutinesFab.tsx", "utf-8");

// Imports DialogDescription
code = code.replace(
  /DialogHeader,\n\s*DialogTitle,\n\} from "@\/components\/ui\/dialog";/,
  `DialogHeader,\n  DialogTitle,\n  DialogDescription,\n} from "@/components/ui/dialog";`
);

// Scan and Share UI
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

            <div className="flex gap-2 w-full">
              <Button
                onClick={() => setScanOpen(true)}
                variant="outline"
                className="flex-1"
              >
                <QrCode className="size-4 mr-2" /> Escanear QR
              </Button>
              <Button
                onClick={() => setDraft({ id: uid(), name: "", items: [] })}
                className="flex-1"
              >
                <Plus className="size-4 mr-2" /> Nueva rutina
              </Button>
            </div>
`;

code = code.replace(
  /<Button\n\s*className="w-full gap-2"\n\s*onClick=\{\(\) => setDraft\(\{ id: uid\(\), name: "", items: \[\] \}\)\}\n\s*>\n\s*<Plus className="size-4" \/> Nueva rutina\n\s*<\/Button>/,
  qrUI
);

code = code.replace(
  /<Button\n\s*size="icon"\n\s*variant="ghost"\n\s*aria-label="Eliminar rutina"\n\s*onClick=\{\(\) => removeRoutine\(r\.id\)\}\n\s*>/,
  `<Button
                        size="icon"
                        variant="ghost"
                        aria-label="Compartir rutina"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShareRoutine(r);
                        }}
                      >
                        <Share2 className="size-4 text-muted-foreground" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Eliminar rutina"
                        onClick={() => removeRoutine(r.id)}
                      >`
);

fs.writeFileSync("src/components/RoutinesFab.tsx", code);
