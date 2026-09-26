import fs from "fs";

let code = fs.readFileSync("src/routes/index.tsx", "utf-8");

// Remove popover imports and add CommandDialog
code = code.replace(
  /import \{\n  Popover,\n  PopoverContent,\n  PopoverTrigger,\n\} from "@\/components\/ui\/popover";/,
  ""
);

if (!code.includes("CommandDialog")) {
  code = code.replace(
    /CommandEmpty,/,
    "CommandDialog,\n  CommandEmpty,"
  );
}

const oldBlock = `<Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
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
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="center">
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

const newBlock = `<>
              <Button
                variant="outline"
                role="combobox"
                onClick={() => setComboboxOpen(true)}
                className="h-12 rounded-xl w-full justify-between font-normal"
              >
                {exerciseId
                  ? getLocalizedName((exercises.find((e) => e.id === exerciseId) || filtered[0]) as any)
                  : "Selecciona un ejercicio..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
              <CommandDialog open={comboboxOpen} onOpenChange={(val) => { if (val) setComboboxOpen(val); }}>
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
              </CommandDialog>
            </>`;

if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
  fs.writeFileSync("src/routes/index.tsx", code);
  console.log("Replaced Popover with CommandDialog.");
} else {
  console.error("Could not find the Popover block!");
}
