import fs from "fs";
let code = fs.readFileSync("src/routes/index.tsx", "utf-8");

code = code.replace(
  /import \{ Plus, Save, Flame \} from "lucide-react";/,
  `import { Plus, Save, Flame, MessageSquare } from "lucide-react";`
);
if (!code.includes("MessageSquare")) {
  code = code.replace(/import \{ Plus, /, "import { MessageSquare, Plus, ");
}

code = code.replace(
  /const \[rir, setRir\] = useState\(""\);/,
  `const [rir, setRir] = useState("");\n  const [note, setNote] = useState("");\n  const [showNote, setShowNote] = useState(false);`
);

code = code.replace(
  /setRir\(""\);/,
  `setRir("");\n    setNote("");\n    setShowNote(false);`
);

const noteUI = `
          {showNote && (
            <div className="grid gap-2">
              <Label>Nota de la serie (Opcional)</Label>
              <Input
                placeholder="Ej. Me costó un poco, subir peso la próxima..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setShowNote(!showNote)}
            >
              <MessageSquare className="size-4 mr-2" />
              {showNote ? "Ocultar nota" : "Añadir nota"}
            </Button>
            <Button
              className="flex-1 gap-2 rounded-xl text-base"
              onClick={() => {
                if (!exercise) return;
                const now = new Date();
                const [y, m, d] = date.split("-").map(Number);
                const when = new Date(
                  y ?? now.getFullYear(),
                  (m ?? 1) - 1,
                  d ?? now.getDate(),
                  now.getHours(),
                  now.getMinutes(),
                );
                addLog({
                  date: when.toISOString(),
                  exerciseId: exercise.id,
                  exerciseName: exercise.name,
                  category: exercise.category,
                  ...(rest.trim() === "" ? {} : { rest: num(rest) }),
                  ...(exercise.category === "Cardio"
                    ? { minutes: num(minutes), speed: num(speed), incline: num(incline) }
                    : { weight: num(weight), sets: num(sets), reps: num(reps), ...(rir.trim() === "" ? {} : { rir: num(rir) }), ...(note.trim() === "" ? {} : { note: note.trim() }) }),
                });
                clearFields();
                toast.success("Registro guardado", {
                  description: \`\${exercise.name} · \${when.toLocaleDateString("es-MX")}\`,
                });
              }}
            >
              <Play className="size-5" /> Registrar
            </Button>
          </div>
`;

code = code.replace(
  /<Button\n\s*className="w-full gap-2 rounded-xl text-base"\n\s*onClick=\{[\s\S]*?\n\s*\}\n\s*>\n\s*<Play className="size-5" \/> Registrar\n\s*<\/Button>/,
  noteUI
);

fs.writeFileSync("src/routes/index.tsx", code);
