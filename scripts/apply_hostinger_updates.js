import fs from 'fs';

let code = fs.readFileSync('src/app-bundle.js', 'utf8');

// 1. Add fetch init in cr
const faqsEffect = '(0,_.useEffect)(()=>sr(`faqs`,b),[b]),';
const initEffect = `(0,_.useEffect)(()=>sr(\`faqs\`,b),[b]),(0,_.useEffect)(()=>{try{fetch('/api/index.php?action=init').then(e=>e.ok?e.json():null).then(e=>{if(e&&e.success&&e.data){let d=e.data;d.settings&&n(d.settings),d.umrahPackages?.length&&i(d.umrahPackages),d.flightOffers?.length&&o(d.flightOffers),d.groupTickets?.length&&c(d.groupTickets),d.visaServices?.length&&u(d.visaServices),d.medicalServices?.length&&f(d.medicalServices),d.bookings?.length&&m(d.bookings),d.customers?.length&&g(d.customers),d.testimonials?.length&&y(d.testimonials),d.faqs?.length&&x(d.faqs)}}).catch(()=>{})}catch(e){}},[]),`;

if (!code.includes(faqsEffect)) {
  console.error('Could not find faqsEffect');
  process.exit(1);
}
code = code.replace(faqsEffect, initEffect);

// 2. Add Hostinger sync to updateSettings
const oldUpdateSettings = 'updateSettings:e=>{n(t=>({...t,...e}))},';
const newUpdateSettings = `updateSettings:e=>{n(t=>({...t,...e}));try{fetch('/api/index.php?action=update_settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(e)}).catch(()=>{})}catch(t){}},`;
if (!code.includes(oldUpdateSettings)) {
  console.error('Could not find oldUpdateSettings');
  process.exit(1);
}
code = code.replace(oldUpdateSettings, newUpdateSettings);

// 3. Add Hostinger sync to createBooking
const oldCreateBooking = 'm(e=>[n,...e]);let r=h.find(t=>t.phone===e.customerPhone||e.customerEmail&&t.email===e.customerEmail);';
const newCreateBooking = `m(e=>[n,...e]);try{fetch('/api/index.php?action=create_booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(n)}).catch(()=>{})}catch(e){}let r=h.find(t=>t.phone===e.customerPhone||e.customerEmail&&t.email===e.customerEmail);`;
if (!code.includes(oldCreateBooking)) {
  console.error('Could not find oldCreateBooking');
  process.exit(1);
}
code = code.replace(oldCreateBooking, newCreateBooking);

// 4. Add Hostinger sync to updateBooking
const oldUpdateBooking = 'updateBooking:(e,t)=>{m(n=>n.map(n=>n.id===e?{...n,...t}:n))},';
const newUpdateBooking = `updateBooking:(e,t)=>{m(n=>n.map(n=>n.id===e?{...n,...t}:n));try{fetch('/api/index.php?action=update_booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:e,...t})}).catch(()=>{})}catch(e){}},`;
if (!code.includes(oldUpdateBooking)) {
  console.error('Could not find oldUpdateBooking');
  process.exit(1);
}
code = code.replace(oldUpdateBooking, newUpdateBooking);

// 5. Add Hostinger button in Ha header
const targetHaHeader = '(0,N.jsxs)(M,{to:`/`,target:`_blank`,className:`flex items-center gap-1.5 bg-brand-navy-900 hover:bg-brand-navy-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors font-semibold`,';
const newHaHeader = `(0,N.jsxs)(\`a\`,{href:\`/airtime-travel-hostinger.zip\`,download:\`airtime-travel-hostinger.zip\`,className:\`flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs text-xs\`,children:[(0,N.jsx)(\`span\`,{children:\`📦\`}),(0,N.jsx)(\`span\`,{className:\`hidden md:inline\`,children:\`Download Hostinger Package\`})]}),${targetHaHeader}`;
if (!code.includes(targetHaHeader)) {
  console.error('Could not find targetHaHeader');
  process.exit(1);
}
code = code.replace(targetHaHeader, newHaHeader);

// 6. Add Hostinger MySQL & Live Deployment card in Za
const zaDbTarget = '(0,N.jsxs)(`div`,{className:`bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-4`,children:[(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`h3`,{className:`font-bold text-sm text-brand-navy-950`,children:`Database Operations & Backups`}),';

const hostingerCard = `(0,N.jsxs)(\`div\`,{className:\`bg-gradient-to-br from-slate-900 via-brand-navy-950 to-slate-900 rounded-2xl border border-brand-navy-800 shadow-md p-6 sm:p-8 space-y-6 text-white\`,children:[
  (0,N.jsxs)(\`div\`,{className:\`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4\`,children:[
    (0,N.jsxs)(\`div\`,{children:[
      (0,N.jsxs)(\`div\`,{className:\`flex items-center gap-2\`,children:[
        (0,N.jsx)(\`span\`,{className:\`text-2xl\`,children:\`🗄️\`}),
        (0,N.jsx)(\`h3\`,{className:\`font-black text-base text-white\`,children:\`Hostinger MySQL Database & Live Deployment\`})
      ]}),
      (0,N.jsx)(\`p\`,{className:\`text-xs text-slate-400 mt-1\`,children:\`Connect your website to your Hostinger MySQL database for persistent real-time bookings across all devices.\`})
    ]}),
    (0,N.jsxs)(\`div\`,{className:\`flex flex-wrap items-center gap-2 shrink-0\`,children:[
      (0,N.jsxs)(\`a\`,{href:\`/api/test_db.php\`,target:\`_blank\`,rel:\`noopener noreferrer\`,className:\`bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors\`,children:[
        (0,N.jsx)(\`span\`,{children:\`⚡ Test DB Status\`})
      ]}),
      (0,N.jsxs)(\`a\`,{href:\`/database.sql\`,download:\`database.sql\`,className:\`bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow transition-colors\`,children:[
        (0,N.jsx)(\`span\`,{children:\`📥 Download database.sql\`})
      ]})
    ]})
  ]}),
  (0,N.jsxs)(\`div\`,{className:\`grid grid-cols-1 sm:grid-cols-2 gap-4\`,children:[
    (0,N.jsxs)(\`div\`,{className:\`bg-slate-950/60 p-4 rounded-xl border border-slate-800/80\`,children:[
      (0,N.jsx)(\`div\`,{className:\`text-xs font-bold text-sky-400 flex items-center gap-1.5 mb-2\`,children:\`📦 Hostinger 1-Click Deployment ZIP\`}),
      (0,N.jsx)(\`p\`,{className:\`text-xs text-slate-400 mb-3\`,children:\`Contains production website build, .htaccess SPA routing, PHP MySQL API backend, and database schema ready to extract into Hostinger public_html.\`}),
      (0,N.jsxs)(\`a\`,{href:\`/airtime-travel-hostinger.zip\`,download:\`airtime-travel-hostinger.zip\`,className:\`w-full inline-flex justify-center items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all\`,children:[
        (0,N.jsx)(\`span\`,{children:\`⬇️ Download Hostinger ZIP Package\`})
      ]})
    ]}),
    (0,N.jsxs)(\`div\`,{className:\`bg-slate-950/60 p-4 rounded-xl border border-slate-800/80\`,children:[
      (0,N.jsx)(\`div\`,{className:\`text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2\`,children:\`⚙️ Hostinger 3-Step Setup Instructions\`}),
      (0,N.jsxs)(\`ul\`,{className:\`text-xs text-slate-300 space-y-1.5\`,children:[
        (0,N.jsxs)(\`li\`,{children:[(0,N.jsx)(\`strong\`,{children:\`1.\`}),\` In Hostinger hPanel → Databases → Create MySQL Database & User.\`]}),
        (0,N.jsxs)(\`li\`,{children:[(0,N.jsx)(\`strong\`,{children:\`2.\`}),\` Open phpMyAdmin → Import tab → Import \`,(0,N.jsx)(\`code\`,{className:\`text-sky-300\`,children:\`database.sql\`}),\`.\`]}),
        (0,N.jsxs)(\`li\`,{children:[(0,N.jsx)(\`strong\`,{children:\`3.\`}),\` In File Manager → open \`,(0,N.jsx)(\`code\`,{className:\`text-sky-300\`,children:\`api/config.php\`}),\` & set DB name/user/pass.\`]})
      ]})
    ]})
  ]})
]}),${zaDbTarget}`;

if (!code.includes(zaDbTarget)) {
  console.error('Could not find zaDbTarget');
  process.exit(1);
}
code = code.replace(zaDbTarget, hostingerCard);

fs.writeFileSync('src/app-bundle.js', code, 'utf8');
console.log('All Hostinger updates successfully applied to src/app-bundle.js!');
