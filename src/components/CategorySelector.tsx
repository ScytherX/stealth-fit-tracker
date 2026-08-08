import type { Category } from "@/lib/gym-store";

const ICONS: Record<Category, (props: { className?: string }) => JSX.Element> = {
  Pecho: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 16c-2.5-2-6-1.5-7.5-4C3.5 9.5 5 6 8 5c2-.5 4 2 4 2s2-2.5 4-2c3 1 4.5 4.5 3.5 7-1.5 2.5-5 2-7.5 4z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M12 16c-2.5-2-6-1.5-7.5-4C3.5 9.5 5 6 8 5c2-.5 4 2 4 2s2-2.5 4-2c3 1 4.5 4.5 3.5 7-1.5 2.5-5 2-7.5 4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 7v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Espalda: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4c-3 1.5-6 3-6.5 5.5C5 12 6 15 8 17c1.5 1.5 4 2.5 4 2.5s2.5-1 4-2.5c2-2 3-5 2.5-7.5C17.5 7 14 5.5 12 4z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M12 4c-3 1.5-6 3-6.5 5.5C5 12 6 15 8 17c1.5 1.5 4 2.5 4 2.5s2.5-1 4-2.5c2-2 3-5 2.5-7.5C17.5 7 14 5.5 12 4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 4v15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 8.5c1 .5 3 1 4 1s3-.5 4-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Piernas: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 5c-1.5 2-2 5-1 8 .5 1.5 2 4 2.5 6h3c.5-2 2-4.5 2.5-6 1-3 .5-6-1-8-1.5-1-4-1-5.5 0z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M9 5c-1.5 2-2 5-1 8 .5 1.5 2 4 2.5 6h3c.5-2 2-4.5 2.5-6 1-3 .5-6-1-8-1.5-1-4-1-5.5 0z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 4v15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Hombros: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 14c0-3 2.5-6 5.5-6.5 1.5-.3 2.5-.3 4 0 3 .5 5.5 3.5 5.5 6.5v4H5v-4z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M5 14c0-3 2.5-6 5.5-6.5 1.5-.3 2.5-.3 4 0 3 .5 5.5 3.5 5.5 6.5v4H5v-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 14v6M19 14v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Brazos: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 18c-1-2-1-5 1.5-7.5S12 8 14 10s2.5 5.5 1.5 7.5-4 3-5 3-3.5-1-4.5-2.5z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M6 18c-1-2-1-5 1.5-7.5S12 8 14 10s2.5 5.5 1.5 7.5-4 3-5 3-3.5-1-4.5-2.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.5 10.5c1 2 2 3 3 3s2-1 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Cardio: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 21C12 21 4 15.5 4 9.5 4 6 6.5 3.5 9.5 3.5c1.7 0 3.2.9 4.1 2.3.9-1.4 2.4-2.3 4.1-2.3 3 0 5.5 2.5 5.5 6C23 15.5 12 21 12 21z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M12 21C12 21 4 15.5 4 9.5 4 6 6.5 3.5 9.5 3.5c1.7 0 3.2.9 4.1 2.3.9-1.4 2.4-2.3 4.1-2.3 3 0 5.5 2.5 5.5 6C23 15.5 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 12h2l1-2 2 4h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

interface CategorySelectorProps {
  value: Category;
  onChange: (value: Category) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Object.entries(ICONS).map(([category, Icon]) => {
        const isActive = category === value;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category as Category)}
            className={
              "flex flex-col items-center justify-center gap-1 rounded-2xl border p-3 transition-colors " +
              (isActive
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground")
            }
            aria-pressed={isActive}
          >
            <Icon className="size-8" />
            <span className="text-xs font-medium">{category}</span>
          </button>
        );
      })}
    </div>
  );
}
