import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

const target = 'Database Operations & Backups';
const idx = code.indexOf(target);
console.log(code.substring(idx - 100, idx + 800));
