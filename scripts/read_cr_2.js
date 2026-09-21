import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

const crIdx = code.indexOf('cr=({children:e})=>');
console.log(code.substring(crIdx + 1200, crIdx + 3000));
