import { Link, useRouterState } from "@tanstack/react-router";
import { Dumbbell, LineChart, History, CalendarDays, HeartPulse } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "nav_exercises", icon: Dumbbell },
  { to: "/cuerpo", label: "nav_body", icon: HeartPulse },
  { to: "/dia", label: "nav_by_day", icon: CalendarDays },
  { to: "/progreso", label: "nav_progress", icon: LineChart },
  { to: "/historial", label: "nav_history", icon: History },
] as const;

import { useTranslation } from "@/lib/gym-store";

export function AppHeader() {
  const t = useTranslation();
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });

  return (
    <>
      <style>{`
        #nav-drawer:target { translate: 0; }
        #nav-drawer:target ~ #nav-overlay { pointer-events: auto; background-color: rgba(0,0,0,0.5); opacity: 1; }
      `}</style>

      <a
        href="#nav-drawer"
        className="fixed left-2 top-2 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur-xl transition-colors hover:bg-accent"
        aria-label="Abrir menú de navegación"
        aria-controls="nav-drawer"
      >
        <MenuIcon className="size-6" />
      </a>

      <div
        id="nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className="fixed inset-y-0 left-0 z-[60] flex h-screen w-3/4 max-w-xs -translate-x-full flex-col border-r border-border bg-card shadow-2xl transition-transform duration-300 ease-out"
      >
        <div className="flex items-center justify-end p-5">
          <a
            href="#"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Cerrar menú"
          >
            <CloseIcon className="size-4" />
          </a>
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
                      // Remove the hash so the :target drawer closes
                      if (window.location.hash === "#nav-drawer") {
                        window.history.replaceState(null, "", window.location.pathname);
                      }
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
                    {t(label as any)}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 px-4">
            <LanguageSelector />
          </div>
        </nav>
      </div>

      <a
        id="nav-overlay"
        href="#"
        className="pointer-events-none fixed inset-0 z-[55] bg-black/0 opacity-0 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />
    </>
  );
}

import { useLanguage } from "../lib/gym-store";

function LanguageSelector() {
  const t = useTranslation();
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {t("language")}
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => setLang("es")}
          className={cn(
            "flex-1 rounded-xl py-2 text-sm font-medium transition-colors border",
            lang === "es"
              ? "bg-primary/10 border-primary text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          )}
        >
          Español
        </button>
        <button
          onClick={() => setLang("en")}
          className={cn(
            "flex-1 rounded-xl py-2 text-sm font-medium transition-colors border",
            lang === "en"
              ? "bg-primary/10 border-primary text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          )}
        >
          English
        </button>
      </div>
    </div>
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
