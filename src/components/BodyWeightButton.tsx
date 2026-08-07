import { useState } from "react";
import { Scale, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBodyWeights } from "@/lib/gym-store";

export function BodyWeightButton({ date }: { date: string }) {
  const { bodyWeights, latest, addBodyWeight, removeBodyWeight } = useBodyWeights();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const normalized = value.trim().replace(",", ".");
  const n = Number(normalized);
  const empty = normalized === "";
  const invalid = empty || !Number.isFinite(n) || n < 1;

  function handleSave() {
    if (invalid) {
      toast.error("Peso inválido", {
        description: "Escribe un número igual o mayor a 1.",
      });
      return;
    }
    addBodyWeight(n, new Date(`${date}T12:00:00`).toISOString());
    setValue("");
    setOpen(false);
    toast.success("Peso corporal registrado", { description: `${n} kg` });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-10 gap-2 rounded-xl"
          aria-label="Registrar peso corporal"
        >
          <Scale className="size-4 text-primary" />
          {latest ? `${latest.weight} kg` : "Peso"}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Registrar peso corporal</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <Label className="text-xs text-muted-foreground">Peso (kg)</Label>
          <Input
            type="number"
            inputMode="decimal"
            min="1"
            step="0.1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-invalid={invalid && !empty}
            className={
              "h-12 rounded-xl text-center text-lg font-semibold " +
              (invalid && !empty
                ? "border-destructive text-destructive ring-2 ring-destructive/40 focus-visible:ring-destructive"
                : "")
            }
          />
          {invalid && !empty && (
            <p className="text-xs font-medium text-destructive">
              El peso debe ser un número igual o mayor a 1.
            </p>
          )}
        </div>

        {bodyWeights.length > 0 && (
          <ul className="grid max-h-48 gap-2 overflow-y-auto">
            {bodyWeights.slice(0, 8).map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm"
              >
                <span className="font-semibold">{b.weight} kg</span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  {new Date(b.date).toLocaleDateString("es-MX")}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    aria-label="Eliminar registro"
                    onClick={() => removeBodyWeight(b.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        )}

        <DialogFooter>
          <Button onClick={handleSave} className="w-full rounded-xl">
            Registrar peso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}