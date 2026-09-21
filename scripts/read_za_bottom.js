import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

const zaIdx = code.indexOf('function Za()');
const nextFn = code.indexOf('function ', zaIdx + 50);
console.log('Za bottom:');
console.log(code.substring(nextFn - 2000, nextFn));
