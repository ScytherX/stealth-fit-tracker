const fs = require('fs');
let code = fs.readFileSync('src/lib/gym-store.ts', 'utf-8');

code = code.replace(/setCustom\(\[\.\.\.custom, ex\]\)/, 'setCustom(prev => [...prev, ex])');
code = code.replace(/setCustom\(custom\.filter\(\(e\) => e\.id !== id\)\)/, 'setCustom(prev => prev.filter(e => e.id !== id))');

code = code.replace(/setLogs\(\[\{ \.\.\.entry, id: uid\(\) \}, \.\.\.logs\]\)/, 'setLogs(prev => [{ ...entry, id: uid() }, ...prev])');
code = code.replace(/setLogs\(\[\.\.\.entries\.map\(\(e\) => \(\{ \.\.\.e, id: uid\(\) \}\)\)\.reverse\(\), \.\.\.logs\]\)/, 'setLogs(prev => [...entries.map(e => ({ ...e, id: uid() })).reverse(), ...prev])');
code = code.replace(/setLogs\(logs\.filter\(\(l\) => l\.id !== id\)\)/, 'setLogs(prev => prev.filter(l => l.id !== id))');

code = code.replace(/setEntries\(\[\{ \.\.\.entry, id: uid\(\) \}, \.\.\.entries\]\)/, 'setEntries(prev => [{ ...entry, id: uid() }, ...prev])');
code = code.replace(/setEntries\(entries\.filter\(\(e\) => e\.id !== id\)\)/, 'setEntries(prev => prev.filter(e => e.id !== id))');

fs.writeFileSync('src/lib/gym-store.ts', code);
