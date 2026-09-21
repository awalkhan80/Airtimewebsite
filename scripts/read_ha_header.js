import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

const haIdx = code.indexOf('function Ha()');
const headerIdx = code.indexOf('<header', haIdx);
console.log(code.substring(haIdx + 1200, haIdx + 2500));
