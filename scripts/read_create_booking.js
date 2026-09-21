import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

const cbIdx = code.indexOf('createBooking:e=>{');
console.log(code.substring(cbIdx, cbIdx + 1200));
