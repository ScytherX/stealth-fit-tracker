import fs from "fs";
let code = fs.readFileSync("src/components/RoutinesFab.tsx", "utf-8");

const start = code.indexOf('{/* Share Routine Dialog */}');
const end = code.indexOf('{/* Scan QR Dialog */}');

if (start !== -1 && end !== -1) {
  const newBlock = `{/* Share Routine Dialog */}
            <Dialog open={!!shareRoutine} onOpenChange={(o) => !o && setShareRoutine(null)}>
              <DialogContent className="max-w-sm text-center">
                <DialogHeader>
                  <DialogTitle>{t("share_routine")}</DialogTitle>
                  <DialogDescription>
                    Pide a tu amigo que escanee o pegue este código.
                  </DialogDescription>
                </DialogHeader>
                <div className="mx-auto mt-4 w-full rounded-xl flex flex-col items-center">
                  {shareRoutine && (
                    <>
                      <div className="bg-white p-4 rounded-xl">
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
                      </div>
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
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            `;
  code = code.substring(0, start) + newBlock + code.substring(end);
  fs.writeFileSync("src/components/RoutinesFab.tsx", code);
}
