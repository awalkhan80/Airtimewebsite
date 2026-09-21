import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

const target = 'Agency Profile & System Settings';
const idx = code.indexOf(target);
console.log('Target at', idx);
console.log(code.substring(idx - 600, idx));
