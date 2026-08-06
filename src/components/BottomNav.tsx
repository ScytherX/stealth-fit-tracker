import { Link } from "@tanstack/react-router";
import { Dumbbell, LineChart, History, CalendarDays } from "lucide-react";

const items = [
  { to: "/", label: "Registrar", icon: Dumbbell },
  { to: "/dia", label: "Por día", icon: CalendarDays },
  { to: "/progreso", label: "Progreso", icon: LineChart },
  { to: "/historial", label: "Historial", icon: History },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-2">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium text-muted-foreground transition-colors"
            activeProps={{ className: "text-primary" }}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}