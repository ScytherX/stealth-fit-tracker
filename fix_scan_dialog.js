import fs from "fs";
let code = fs.readFileSync("src/components/RoutinesFab.tsx", "utf-8");

const oldScanBlock = `{/* Scan QR Dialog */}
            <Dialog open={scanOpen} onOpenChange={setScanOpen}>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>{t("scan_routine")}</DialogTitle>
                </DialogHeader>
                <div id="reader" className="mt-4 w-full overflow-hidden rounded-xl"></div>
              </DialogContent>
            </Dialog>`;

const newScanBlock = `{/* Scan QR Dialog */}
            <Dialog open={scanOpen} onOpenChange={setScanOpen}>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>{t("scan_routine")}</DialogTitle>
                </DialogHeader>
                <div id="reader" className="mt-4 w-full overflow-hidden rounded-xl bg-muted/50"></div>
                <div className="mt-2 grid gap-2">
                  <p className="text-xs text-center text-muted-foreground mt-2">Si la cámara no funciona, pega el código aquí:</p>
                  <Input 
                    placeholder="Pega el código de texto..." 
                    onChange={(e) => {
                      const text = e.target.value.trim();
                      if (!text) return;
                      try {
                        const r = JSON.parse(text);
                        let importedRoutine = null;
                        if (r && r.name && r.items) {
                          importedRoutine = { ...r, id: uid() };
                        } else if (r && r.n && r.i) {
                          importedRoutine = {
                            id: uid(),
                            name: r.n,
                            items: r.i.map((x: any) => ({
                              id: uid(),
                              exerciseId: x.e,
                              category: x.c,
                              ...x
                            }))
                          };
                        }
                        if (importedRoutine) {
                          saveRoutine(importedRoutine);
                          toast.success("Rutina importada", { description: importedRoutine.name });
                          setScanOpen(false);
                        }
                      } catch(err) {
                        // ignore parse errors
                      }
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>`;

code = code.replace(oldScanBlock, newScanBlock);
fs.writeFileSync("src/components/RoutinesFab.tsx", code);
