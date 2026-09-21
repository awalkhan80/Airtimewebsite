import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

const target = 'Admin Management Console';
let pos = 0;
while ((pos = code.indexOf(target, pos)) !== -1) {
  console.log('Pos:', pos);
  console.log(code.substring(pos - 40, pos + 100));
  pos += target.length;
}
