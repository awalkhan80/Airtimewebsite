import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');
console.log(code.substring(504300, 505500));
