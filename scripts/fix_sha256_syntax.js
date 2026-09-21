import fs from 'fs';

let code = fs.readFileSync('src/app-bundle.js', 'utf8');

code = code.replace(
  ',function airtime_sha256(ascii) {',
  ',airtime_sha256=function(ascii){'
);

fs.writeFileSync('src/app-bundle.js', code, 'utf8');
console.log('Replaced function airtime_sha256 with airtime_sha256=function');
