const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');

console.log("Starting nitro server...");
const serverProcess = exec('node .output/server/index.mjs');

setTimeout(() => {
  console.log("Fetching index.html...");
  http.get('http://localhost:3000/', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      fs.writeFileSync('.output/public/index.html', data);
      console.log("Saved index.html!");
      serverProcess.kill();
      process.exit(0);
    });
  }).on('error', (err) => {
    console.error(err);
    serverProcess.kill();
    process.exit(1);
  });
}, 2000);
