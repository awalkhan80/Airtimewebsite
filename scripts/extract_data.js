import fs from 'fs';

const code = fs.readFileSync('src/app-bundle.js', 'utf8');

// Find where the default data starts:
const startJn = code.indexOf('var Jn={name:');
const endData = code.indexOf('window.__AR_TRANSLATIONS__', startJn);

console.log('startJn:', startJn, 'endData:', endData);

if (startJn !== -1 && endData !== -1) {
  const dataSlice = code.substring(startJn, endData);
  const fn = new Function(dataSlice + '; return { Jn, Yn, Xn, Zn, Qn, $n, er, tr, nr, rr };');
  const result = fn();
  fs.writeFileSync('extracted_data.json', JSON.stringify(result, null, 2));
  console.log('Successfully extracted data to extracted_data.json!');
  console.log('Keys extracted:', Object.keys(result));
  console.log('Umrah packages count:', result.Yn.length);
  console.log('Flight offers count:', result.Xn.length);
  console.log('Group tickets count:', result.Zn.length);
  console.log('Visa count:', result.Qn.length);
  console.log('Medical count:', result.$n.length);
  console.log('Bookings count:', result.er.length);
  console.log('Customers count:', result.tr.length);
  console.log('Testimonials count:', result.nr.length);
  console.log('FAQs count:', result.rr.length);
}
