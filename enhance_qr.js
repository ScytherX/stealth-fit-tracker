import fs from "fs";
let code = fs.readFileSync("src/components/RoutinesFab.tsx", "utf-8");

// Optimize JSON payload stringifier
const oldQR = `<QRCode value={JSON.stringify({name: shareRoutine.name, items: shareRoutine.items})} size={200} />`;
const newQR = `
                  <QRCode 
                    value={JSON.stringify({
                      n: shareRoutine.name, 
                      i: shareRoutine.items.map(x => {
                        const { id, exerciseId, category, ...rest } = x;
                        return { e: exerciseId, c: category, ...rest };
                      })
                    })} 
                    size={200} 
                  />
                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    onClick={() => {
                      const payload = JSON.stringify({
                        n: shareRoutine.name, 
                        i: shareRoutine.items.map(x => {
                          const { id, exerciseId, category, ...rest } = x;
                          return { e: exerciseId, c: category, ...rest };
                        })
                      });
                      navigator.clipboard.writeText(payload);
                      toast.success("Código de la rutina copiado");
                    }}
                  >
                    Copiar código de texto
                  </Button>
`;
code = code.replace(oldQR, newQR);

// Optimize Scanner logic to handle both old and new payload formats
const oldScanner = `const r = JSON.parse(text);
          if (r && r.name && r.items) {
            r.id = uid();
            saveRoutine(r);
            toast.success("Rutina importada", { description: r.name });
            setScanOpen(false);
            scanner.clear();
          }`;

const newScanner = `const r = JSON.parse(text);
          let importedRoutine = null;
          if (r && r.name && r.items) { // Old format
            importedRoutine = { ...r, id: uid() };
          } else if (r && r.n && r.i) { // New compressed format
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
            scanner?.clear?.();
          } else {
            throw new Error("Formato inválido");
          }`;
code = code.replace(oldScanner, newScanner);

// Add Paste text box to scanner dialog
const oldScanDialog = `<div id="reader" className="overflow-hidden rounded-xl bg-muted/50 mt-4" />`;
const newScanDialog = `<div id="reader" className="overflow-hidden rounded-xl bg-muted/50 mt-4" />
                <div className="mt-4 grid gap-2">
                  <p className="text-xs text-center text-muted-foreground">Si la cámara no funciona, pega el código aquí:</p>
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
                        // ignore parsing errors while typing
                      }
                    }}
                  />
                </div>`;
code = code.replace(oldScanDialog, newScanDialog);

fs.writeFileSync("src/components/RoutinesFab.tsx", code);
