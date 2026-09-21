import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

const crIdx = code.indexOf('cr=({children:e})=>');
console.log('cr starts at:', crIdx);
console.log(code.substring(crIdx, crIdx + 1200));
