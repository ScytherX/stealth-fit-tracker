import fs from "fs";

let code = fs.readFileSync("src/routes/index.tsx", "utf-8");

// Imports
code = code.replace(
  /import \{ Plus, Save, Flame, MessageSquare \} from "lucide-react";/,
  `import { Plus, Save, Flame, MessageSquare, Check, ChevronsUpDown } from "lucide-react";`
);

code = code.replace(
  /import \{\n  CATEGORIES,/,
  `import {\n  Popover,\n  PopoverContent,\n  PopoverTrigger,\n} from "@/components/ui/popover";\nimport {\n  Command,\n  CommandEmpty,\n  CommandGroup,\n  CommandInput,\n  CommandItem,\n  CommandList,\n} from "@/components/ui/command";\nimport {\n  CATEGORIES,`
);

code = code.replace(
  /import \{ cn \} from "@\/lib\/utils";/,
  `import { cn } from "@/lib/utils";`
);
if (!code.includes('import { cn } from "@/lib/utils";')) {
    code = code.replace(
      /import \{ toast \} from "sonner";/,
      `import { toast } from "sonner";\nimport { cn } from "@/lib/utils";`
    );
}

// State
code = code.replace(
  /const \[exerciseId, setExerciseId\] = useState<string>\(""\);/,
  `const [exerciseId, setExerciseId] = useState<string>("");\n  const [comboboxOpen, setComboboxOpen] = useState(false);`
);

// JSX replacement
const oldSelect = `<Select value={exerciseId} onValueChange={setExerciseId}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selecciona un ejercicio" />
              </SelectTrigger>
              <SelectContent position="popper" align="center">
                {filtered.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {getLocalizedName(e as any)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>`;

const newCombobox = `<Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="h-12 rounded-xl w-full justify-between font-normal"
                >
                  {exerciseId
                    ? getLocalizedName((exercises.find((e) => e.id === exerciseId) || filtered[0]) as any)
                    : "Selecciona un ejercicio..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-2rem)] p-0" align="center">
                <Command>
                  <CommandInput placeholder="Buscar ejercicio..." />
                  <CommandList>
                    <CommandEmpty>No se encontraron ejercicios.</CommandEmpty>
                    <CommandGroup>
                      {filtered.map((e) => (
                        <CommandItem
                          key={e.id}
                          value={getLocalizedName(e as any)}
                          onSelect={() => {
                            setExerciseId(e.id);
                            setComboboxOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              exerciseId === e.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {getLocalizedName(e as any)}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>`;

if (code.includes(oldSelect)) {
  code = code.replace(oldSelect, newCombobox);
  fs.writeFileSync("src/routes/index.tsx", code);
  console.log("Replaced Select with Combobox.");
} else {
  console.error("Could not find Select string!");
}
