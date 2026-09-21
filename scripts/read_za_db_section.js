import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

const target = 'Database Operations & Backups';
const idx = code.lastIndexOf(target);
console.log('Last idx of target:', idx);
console.log(code.substring(idx - 150, idx + 1000));
