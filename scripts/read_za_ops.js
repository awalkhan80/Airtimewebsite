import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');
console.log(code.substring(599333 - 100, 599333 + 1200));
