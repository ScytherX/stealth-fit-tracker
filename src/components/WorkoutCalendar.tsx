import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CATEGORIES, useLogs, type Category } from "@/lib/gym-store";

export const CATEGORY_DOT: Record<Category, string> = {
  Pecho: "bg-cat-pecho",
  Espalda: "bg-cat-espalda",
  Piernas: "bg-cat-piernas",
  Hombros: "bg-cat-hombros",
  Brazos: "bg-cat-brazos",
  Cardio: "bg-cat-cardio",
};

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];
const WEEKDAYS_SHORT = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function toKey(d: Date) {
  return d.toLocaleDateString("sv-SE");
}

function parseKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1);
}

export function WorkoutCalendar({
  value,
  onChange,
  maxDate,
  className,
}: {
  value: string;
  onChange: (key: string) => void;
  maxDate?: string;
  className?: string;
}) {
  const { logs } = useLogs();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => {
    const d = parseKey(value);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const byDay = useMemo(() => {
    const map = new Map<string, Set<Category>>();
    for (const l of logs) {
      const key = toKey(new Date(l.date));
      if (!map.has(key)) map.set(key, new Set());
      map.get(key)!.add(l.category);
    }
    return map;
  }, [logs]);

  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const out: (Date | null)[] = Array.from({ length: offset }, () => null);
    for (let i = 1; i <= daysInMonth; i++) {
      out.push(new Date(month.getFullYear(), month.getMonth(), i));
    }
    return out;
  }, [month]);

  const todayKey = toKey(new Date());
  const [y, m, d] = value.split("-").map(Number);
  const label = `${WEEKDAYS_SHORT[new Date(Date.UTC(y ?? 2026, (m ?? 1) - 1, d ?? 1)).getUTCDay()]}, ${String(d ?? 1).padStart(2, "0")} de ${MONTHS[(m ?? 1) - 1]} de ${y ?? 2026}`;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          const d = parseKey(value);
          setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-12 w-full justify-start gap-2 rounded-xl font-normal capitalize",
            className,
          )}
        >
          <CalendarDays className="size-4 text-primary" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-md rounded-2xl p-4 sm:p-6">
        <DialogHeader className="space-y-0">
          <DialogTitle className="text-base">Selecciona una fecha</DialogTitle>
        </DialogHeader>
        <div className="pointer-events-auto">
          <div className="flex items-center justify-between">
            <Button
              size="icon"
              variant="ghost"
              aria-label="Mes anterior"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <p className="text-sm font-semibold capitalize">
              {MONTHS[month.getMonth()]} de {month.getFullYear()}
            </p>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Mes siguiente"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
            {WEEKDAYS.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} />;
              const key = toKey(d);
              const cats = byDay.get(key);
              const disabled = maxDate ? key > maxDate : false;
              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-1 rounded-lg text-base transition-colors",
                    "hover:bg-secondary disabled:opacity-30",
                    key === todayKey && "font-bold text-primary",
                    key === value && "bg-primary text-primary-foreground hover:bg-primary",
                  )}
                >
                  <span className="leading-none">{d.getDate()}</span>
                  <span className="flex h-1.5 items-center gap-0.5">
                    {cats &&
                      CATEGORIES.filter((c) => cats.has(c)).map((c) => (
                        <span
                          key={c}
                          className={cn("size-1.5 rounded-full", CATEGORY_DOT[c])}
                        />
                      ))}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-3 text-[11px] text-muted-foreground">
            {CATEGORIES.map((c) => (
              <span key={c} className="flex items-center gap-1">
                <span className={cn("size-2 rounded-full", CATEGORY_DOT[c])} />
                {c}
              </span>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
