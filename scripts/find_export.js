import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

let pos = 0;
while ((pos = code.indexOf('exportDatabaseJson', pos)) !== -1) {
  console.log('Match at', pos);
  console.log(code.substring(pos - 60, pos + 120));
  pos += 18;
}
