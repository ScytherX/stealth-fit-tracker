import { Link, useRouterState } from "@tanstack/react-router";
import { Dumbbell, LineChart, History, CalendarDays, HeartPulse } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Ejercicios", icon: Dumbbell },
  { to: "/cuerpo", label: "Cuerpo", icon: HeartPulse },
  { to: "/dia", label: "Por día", icon: CalendarDays },
  { to: "/progreso", label: "Progreso", icon: LineChart },
  { to: "/historial", label: "Historial", icon: History },
] as const;

export function AppHeader() {
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <input id="nav-toggle" type="checkbox" className="sr-only" />

      <div className="mx-auto flex h-14 max-w-lg items-center px-4">
        <label
          htmlFor="nav-toggle"
          className="-ml-2 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
          aria-label="Abrir menú de navegación"
          aria-controls="nav-drawer"
        >
          <MenuIcon className="size-6" />
        </label>

        <span className="ml-2 text-sm font-semibold tracking-tight">
          {items.find((i) => i.to === currentPath)?.label ?? "Entrenamientos"}
        </span>
      </div>

      <div
        id="nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className="fixed inset-y-0 left-0 z-[60] flex h-screen w-3/4 max-w-xs -translate-x-full flex-col border-r border-border bg-card shadow-2xl transition-transform duration-300 ease-out"
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <span className="text-base font-semibold">Menú</span>
          <label
            htmlFor="nav-toggle"
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Cerrar menú"
          >
            <CloseIcon className="size-4" />
          </label>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="grid gap-1">
            {items.map(({ to, label, icon: Icon }) => {
              const active = currentPath === to;
              return (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => {
                      const toggle = document.getElementById("nav-toggle") as HTMLInputElement | null;
                      if (toggle) toggle.checked = false;
                    }}
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

      <label
        id="nav-overlay"
        htmlFor="nav-toggle"
        className="pointer-events-none fixed inset-0 z-[55] bg-black/0 opacity-0 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />
    </header>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
