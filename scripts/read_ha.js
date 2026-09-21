import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

const haIdx = code.indexOf('function Ha()');
console.log(code.substring(haIdx, haIdx + 2000));
