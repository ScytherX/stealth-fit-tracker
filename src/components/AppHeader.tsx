import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Dumbbell, LineChart, History, CalendarDays, HeartPulse, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Ejercicios", icon: Dumbbell },
  { to: "/cuerpo", label: "Cuerpo", icon: HeartPulse },
  { to: "/dia", label: "Por día", icon: CalendarDays },
  { to: "/progreso", label: "Progreso", icon: LineChart },
  { to: "/historial", label: "Historial", icon: History },
] as const;

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  useLayoutEffect(() => {
    console.log("LAYOUT EFFECT RUNNING");
  }, []);

  useEffect(() => {
    console.log("EFFECT RUNNING", openButtonRef.current);
    const btn = openButtonRef.current;
    if (!btn) return;
    function handleClick() {
      console.log("NATIVE CLICK HANDLER");
      setOpen(true);
    }
    btn.addEventListener("click", handleClick);
    return () => btn.removeEventListener("click", handleClick);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-lg items-center px-4">
        <Button
          ref={openButtonRef}
          variant="ghost"
          size="icon"
          className="-ml-2 h-10 w-10 rounded-full"
          aria-label="Abrir menú de navegación"
          aria-expanded={open}
          aria-controls="nav-drawer"
        >
          <Menu className="size-6" />
        </Button>

        <span className="ml-2 text-sm font-semibold tracking-tight">
          {items.find((i) => i.to === currentPath)?.label ?? "Entrenamientos"}
        </span>
      </div>

      {/* Drawer */}
      <div
        id="nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={cn(
          "fixed inset-y-0 left-0 z-[60] flex h-screen w-3/4 max-w-xs flex-col border-r border-border bg-card shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <span className="text-base font-semibold">Menú</span>
          <button
            onClick={() => setOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Cerrar menú"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="grid gap-1">
            {items.map(({ to, label, icon: Icon }) => {
              const active = currentPath === to;
              return (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: to === "/" }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-5">
          <p className="text-xs text-muted-foreground">Registro de entrenamientos</p>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
