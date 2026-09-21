import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

const target = 'AIRTIME CMS';
const idx = code.indexOf(target);
console.log(code.substring(idx - 50, idx + 600));
