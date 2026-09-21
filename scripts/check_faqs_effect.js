import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

const target = '(0,_.useEffect)(()=>sr(`faqs`,b),[b]),';
const idx = code.indexOf(target);
console.log('Target at:', idx);
console.log(code.substring(idx - 100, idx + 300));
