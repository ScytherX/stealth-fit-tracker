import { type Category, CATEGORIES, useTranslation } from "@/lib/gym-store";

const EMOJI_ICONS: Record<Category, string> = {
  Pecho: "🦍", // Fallback, though we'll use the image
  Espalda: "🪽",
  Piernas: "🦵",
  Hombros: "🏋️",
  Brazos: "💪",
  Abdomen: "🍫",
  Cardio: "❤️",
};

interface CategorySelectorProps {
  value: Category;
  onChange: (value: Category) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const t = useTranslation();
  return (
    <div className="grid grid-cols-3 gap-2">
      {CATEGORIES.map((category) => {
        const isActive = category === value;
        const baseClass =
          "flex flex-col items-center justify-center gap-1 rounded-2xl border p-3 transition-colors ";
        const stateClass = isActive
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground";

        const emoji = EMOJI_ICONS[category];

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={baseClass + stateClass}
            aria-pressed={isActive}
          >
            <img 
                src={`/${category.toLowerCase()}.png`} 
                alt={category} 
                className="w-10 h-10 object-contain rounded-md" 
              />
            <span className="text-xs font-medium">{t(("cat_" + category) as any)}</span>
          </button>
        );
      })}
    </div>
  );
}
