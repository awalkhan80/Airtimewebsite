import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

const target = 'Database Operations & Backups';
let pos = 0;
while ((pos = code.indexOf(target, pos)) !== -1) {
  console.log('Pos:', pos);
  console.log(code.substring(pos - 60, pos + 100));
  pos += target.length;
}
