import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

const zaIdx = code.indexOf('function Za()');
console.log(code.substring(zaIdx, zaIdx + 2500));
