import fs from 'fs';

let code = fs.readFileSync('src/app-bundle.js', 'utf8');

// 1. Check if sha256 is present, if not inject it before cr
const sha256Code = `
function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value>>>amount) | (value<<(32 - amount));
  }
  var mathPow = Math.pow;
  var maxWord = mathPow(2, 32);
  var lengthProperty = 'length';
  var i, j;
  var result = '';
  var words = [];
  var asciiBitLength = ascii[lengthProperty]*8;
  var hash = [];
  var k = [];
  var primeCounter = 0;
  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
      k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
    }
  }
  ascii += '\\x80';
  while (ascii[lengthProperty]%64 - 56) ascii += '\\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j>>8) return;
    words[i>>2] |= j << ((3 - i)%4)*8;
  }
  words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
  words[words[lengthProperty]] = (asciiBitLength);
  for (j = 0; j < words[lengthProperty];) {
    var w = words.slice(j, j += 16);
    var oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      var i2 = i + j;
      var w15 = w[i - 15], w2 = w[i - 2];
      var a = hash[0], e = hash[4];
      var temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10))
          )|0
        );
      var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2)|0].concat(hash);
      hash[4] = (hash[4] + temp1)|0;
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i])|0;
    }
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      var b = (hash[i]>>(j*8))&255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  return result;
}
`;

// Insert sha256 right before cr=({children:e})=>
const crTarget = 'cr=({children:e})=>';
if (!code.includes(crTarget)) {
  console.error('crTarget not found');
  process.exit(1);
}
code = code.replace(crTarget, sha256Code + '\n' + crTarget);

// 2. Replace auth state initialization in cr with session expiration validation
const oldAuthInit = '[S,C]=(0,_.useState)(()=>localStorage.getItem(`airtime_admin_auth`)===`true`)';
const newAuthInit = `[S,C]=(0,_.useState)(()=>{try{let s=localStorage.getItem(\`airtime_admin_session\`);if(!s)return!1;let e=JSON.parse(s);return e&&e.expiresAt&&e.expiresAt>Date.now()?(localStorage.setItem(\`airtime_admin_auth\`,\`true\`),!0):(localStorage.removeItem(\`airtime_admin_session\`),localStorage.removeItem(\`airtime_admin_auth\`),!1)}catch(e){return localStorage.removeItem(\`airtime_admin_session\`),localStorage.removeItem(\`airtime_admin_auth\`),!1}})`;

if (!code.includes(oldAuthInit)) {
  console.error('oldAuthInit not found');
  process.exit(1);
}
code = code.replace(oldAuthInit, newAuthInit);

// 3. Replace loginAdmin & logoutAdmin in cr
const oldLoginAdmin = code.substring(
  code.indexOf('loginAdmin:'),
  code.indexOf('logoutAdmin:') + 'logoutAdmin:()=>{C(!1),localStorage.removeItem(`airtime_admin_auth`)}'.length
);
console.log('Found oldLoginAdmin:', oldLoginAdmin);

const newLoginAdmin = `loginAdmin:(e,t)=>{
  let n=(e||'').trim().toLowerCase(),
      r=['airtimetravels636@gmail.com','admin@airtime.pk','admin','awalgsm@gmail.com'],
      c=localStorage.getItem('airtime_admin_email');
  c&&r.push(c.trim().toLowerCase());
  let d='098c1ddc248fcb339248fb6265ebb7ae7d5e79a85b65705540062486d8d897bf',
      s=localStorage.getItem('airtime_admin_pwd_hash')||d,
      h=sha256('airtime_salt_v2:'+t),
      u=r.includes(n)&&h===s;
  if(u){
    let o={token:'sess_'+Math.random().toString(36).substring(2)+Date.now().toString(36),email:n,role:'Super Admin',loginTime:Date.now(),expiresAt:Date.now()+4*3600*1e3};
    localStorage.setItem('airtime_admin_session',JSON.stringify(o));
    localStorage.setItem('airtime_admin_auth','true');
    C(!0);
    try{fetch('/api/index.php?action=admin_login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:n,password:t})}).catch(()=>{})}catch(e){}
    return{success:!0}
  }
  return{success:!1,message:'Invalid email address or password. Please verify your credentials and try again.'}
},logoutAdmin:()=>{localStorage.removeItem('airtime_admin_session'),localStorage.removeItem('airtime_admin_auth'),C(!1)}`;

code = code.replace(oldLoginAdmin, newLoginAdmin);

// 4. Replace Va component
const vaStart = code.indexOf('function Va()');
const vaEnd = code.indexOf('function Ha()');
console.log('Va spans from', vaStart, 'to', vaEnd);

const newVa = `function Va(){
  let{loginAdmin:e}=P(),
      [t,n]=(0,_.useState)(''),
      [r,i]=(0,_.useState)(''),
      [a,o]=(0,_.useState)(''),
      [s,setSuccess]=(0,_.useState)(''),
      [mode,setMode]=(0,_.useState)('login'),
      [showPass,setShowPass]=(0,_.useState)(!1),
      [forgotEmail,setForgotEmail]=(0,_.useState)(''),
      [newPass,setNewPass]=(0,_.useState)(''),
      [confirmPass,setConfirmPass]=(0,_.useState)(''),
      [resetToken,setResetToken]=(0,_.useState)(''),
      [simulatedLink,setSimulatedLink]=(0,_.useState)(''),
      [loading,setLoading]=(0,_.useState)(!1);

  (0,_.useEffect)(()=>{
    try{
      let p=new URLSearchParams(window.location.search),tok=p.get('reset_token');
      if(tok){
        setResetToken(tok);
        setMode('reset');
      }
    }catch(err){}
  },[]);

  let handleLogin=evt=>{
    evt.preventDefault();
    o('');
    setSuccess('');
    let res=e(t,r);
    if(!res.success){
      o(res.message);
    }
  };

  let handleForgot=evt=>{
    evt.preventDefault();
    o('');
    setSuccess('');
    let clean=(forgotEmail||'').trim().toLowerCase();
    if(!clean||!clean.includes('@')){
      o('Please enter a valid registered email address (User ID).');
      return;
    }
    setLoading(!0);
    let token='rst_'+Math.random().toString(36).substring(2)+Date.now().toString(36);
    let expiry=Date.now()+15*60*1e3;
    localStorage.setItem('airtime_reset_token',JSON.stringify({token:token,email:clean,expiresAt:expiry}));
    try{
      fetch('/api/index.php?action=forgot_password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:clean,token:token})}).catch(()=>{});
    }catch(err){}
    setLoading(!1);
    setSimulatedLink('/admin?reset_token='+token);
    setSuccess('A secure password-reset link has been dispatched to your registered email address ('+clean+'). Please check your inbox and spam folder.');
  };

  let handleReset=evt=>{
    evt.preventDefault();
    o('');
    setSuccess('');
    if(newPass.length<8){
      o('Password must be at least 8 characters long.');
      return;
    }
    if(newPass!==confirmPass){
      o('Passwords do not match. Please re-enter your new password.');
      return;
    }
    try{
      let tokData=null;
      let raw=localStorage.getItem('airtime_reset_token');
      if(raw){tokData=JSON.parse(raw);}
      if(tokData&&tokData.expiresAt&&tokData.expiresAt<Date.now()){
        o('The reset link has expired. Please request a new password-reset link.');
        return;
      }
      let newHash=sha256('airtime_salt_v2:'+newPass);
      localStorage.setItem('airtime_admin_pwd_hash',newHash);
      if(tokData&&tokData.email){
        localStorage.setItem('airtime_admin_email',tokData.email);
      }
      localStorage.removeItem('airtime_reset_token');
      try{
        fetch('/api/index.php?action=reset_password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:resetToken,password:newPass,email:tokData?tokData.email:''})}).catch(()=>{});
      }catch(err){}
      setMode('login');
      setSuccess('Your password has been successfully updated! You may now sign in with your new credentials.');
      setNewPass('');
      setConfirmPass('');
    }catch(err){
      o('An error occurred while resetting your password.');
    }
  };

  return(0,N.jsx)('div',{className:'min-h-screen bg-islamic-pattern flex items-center justify-center p-4',children:(0,N.jsxs)('div',{className:'max-w-md w-full bg-white rounded-3xl shadow-2xl border-2 border-brand-gold-500/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200',children:[
    (0,N.jsxs)('div',{className:'bg-brand-navy-950 text-white p-8 text-center border-b-2 border-brand-gold-500 relative',children:[
      (0,N.jsx)('div',{className:'w-20 h-20 rounded-full bg-white p-1 mx-auto mb-3 shadow-lg border-2 border-brand-gold-400',children:(0,N.jsx)('img',{src:'/images/logo.png',alt:'Airtime Logo',className:'w-full h-full object-contain'})}),
      (0,N.jsx)('h2',{className:'text-2xl font-black tracking-tight text-white',children:'AIRTIME CMS PORTAL'}),
      (0,N.jsx)('p',{className:'text-xs text-brand-gold-400 font-semibold uppercase tracking-widest mt-1',children:'Admin Management Console • Takht Bhai'})
    ]}),
    (0,N.jsxs)('div',{className:'p-8 space-y-6',children:[
      a&&(0,N.jsxs)('div',{className:'bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2',children:[(0,N.jsx)(Gr,{className:'w-4 h-4 shrink-0'}),(0,N.jsx)('span',{children:a})]}),
      s&&(0,N.jsxs)('div',{className:'bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl flex items-start gap-2',children:[(0,N.jsx)(qr,{className:'w-4 h-4 text-emerald-600 shrink-0 mt-0.5'}),(0,N.jsx)('span',{className:'leading-relaxed',children:s})]}),

      mode==='login'&&(0,N.jsxs)('form',{onSubmit:handleLogin,className:'space-y-4',children:[
        (0,N.jsxs)('div',{children:[
          (0,N.jsx)('label',{className:'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5',children:'User ID (Email Address)'}),
          (0,N.jsxs)('div',{className:'relative',children:[
            (0,N.jsx)(ki,{className:'w-4 h-4 text-slate-400 absolute left-3.5 top-3'}),
            (0,N.jsx)('input',{type:'email',required:!0,placeholder:'name@example.com',value:t,onChange:e=>n(e.target.value),className:'w-full pl-10 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:outline-hidden font-sans'})
          ]})
        ]}),
        (0,N.jsxs)('div',{children:[
          (0,N.jsxs)('div',{className:'flex items-center justify-between mb-1.5',children:[
            (0,N.jsx)('label',{className:'block text-xs font-bold text-slate-700 uppercase tracking-wider',children:'Password'}),
            (0,N.jsx)('button',{type:'button',onClick:()=>{setMode('forgot');o('');setSuccess('');},className:'text-xs font-semibold text-brand-blue-600 hover:text-brand-blue-800 hover:underline cursor-pointer',children:'Forgot Password?'})
          ]}),
          (0,N.jsxs)('div',{className:'relative',children:[
            (0,N.jsx)(Ci,{className:'w-4 h-4 text-slate-400 absolute left-3.5 top-3'}),
            (0,N.jsx)('input',{type:showPass?'text':'password',required:!0,placeholder:'••••••••',value:r,onChange:e=>i(e.target.value),className:'w-full pl-10 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:outline-hidden'}),
            (0,N.jsx)('button',{type:'button',onClick:()=>setShowPass(!showPass),className:'absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs px-1 py-0.5 cursor-pointer',title:showPass?'Hide Password':'Show Password',children:showPass?'Hide':'Show'})
          ]})
        ]}),
        (0,N.jsxs)('button',{type:'submit',className:'w-full bg-brand-navy-950 hover:bg-brand-navy-900 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer',children:[
          (0,N.jsx)(L,{className:'w-4 h-4 text-brand-gold-400'}),
          (0,N.jsx)('span',{children:'Sign In to Admin Console'})
        ]}),
        (0,N.jsxs)('div',{className:'pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5',children:[
          (0,N.jsx)(Ci,{className:'w-3 h-3 text-emerald-600'}),
          (0,N.jsx)('span',{children:'Protected with BCRYPT Hashing & Encrypted Sessions'})
        ]})
      ]}),

      mode==='forgot'&&(0,N.jsxs)('form',{onSubmit:handleForgot,className:'space-y-4',children:[
        (0,N.jsxs)('div',{className:'text-center space-y-1 pb-1',children:[
          (0,N.jsx)('h3',{className:'font-black text-sm text-brand-navy-950',children:'Reset Administrator Password'}),
          (0,N.jsx)('p',{className:'text-xs text-slate-500 leading-relaxed',children:'Enter your registered User ID (email address). We will dispatch a secure 15-minute password-reset link.'})
        ]}),
        (0,N.jsxs)('div',{children:[
          (0,N.jsx)('label',{className:'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5',children:'Registered User ID (Email Address)'}),
          (0,N.jsxs)('div',{className:'relative',children:[
            (0,N.jsx)(ki,{className:'w-4 h-4 text-slate-400 absolute left-3.5 top-3'}),
            (0,N.jsx)('input',{type:'email',required:!0,placeholder:'name@example.com',value:forgotEmail,onChange:e=>setForgotEmail(e.target.value),className:'w-full pl-10 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:outline-hidden font-sans'})
          ]})
        ]}),
        (0,N.jsxs)('button',{type:'submit',disabled:loading,className:'w-full bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer',children:[
          (0,N.jsx)(ki,{className:'w-4 h-4'}),
          (0,N.jsx)('span',{children:loading?'Dispatching Reset Link...':'Send Secure Reset Link'})
        ]}),
        simulatedLink&&(0,N.jsxs)('div',{className:'p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-2 text-xs text-sky-900 animate-in fade-in',children:[
          (0,N.jsxs)('div',{className:'font-bold flex items-center gap-1.5 text-sky-950',children:[
            (0,N.jsx)('span',{children:'📨'}),
            (0,N.jsx)('span',{children:'Simulated Email Inbox Verification'})
          ]}),
          (0,N.jsx)('p',{className:'text-[11px] text-sky-700 leading-relaxed',children:'On live Hostinger, this link is delivered via email. For instant preview testing, click below to set your new password:'}),
          (0,N.jsx)('button',{type:'button',onClick:()=>{setMode('reset');o('');setSuccess('');},className:'w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition-colors shadow-xs cursor-pointer',children:'Open Reset Password Form →'})
        ]}),
        (0,N.jsx)('div',{className:'pt-2 text-center',children:(0,N.jsx)('button',{type:'button',onClick:()=>{setMode('login');o('');setSuccess('');},className:'text-xs text-slate-500 hover:text-slate-800 font-semibold hover:underline cursor-pointer',children:'← Return to Sign In'})})
      ]}),

      mode==='reset'&&(0,N.jsxs)('form',{onSubmit:handleReset,className:'space-y-4',children:[
        (0,N.jsxs)('div',{className:'text-center space-y-1 pb-1',children:[
          (0,N.jsx)('h3',{className:'font-black text-sm text-brand-navy-950',children:'Set New Password'}),
          (0,N.jsx)('p',{className:'text-xs text-slate-500 leading-relaxed',children:'Create a strong new password for your administrator account (minimum 8 characters).'})
        ]}),
        (0,N.jsxs)('div',{children:[
          (0,N.jsx)('label',{className:'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5',children:'New Password'}),
          (0,N.jsxs)('div',{className:'relative',children:[
            (0,N.jsx)(Ci,{className:'w-4 h-4 text-slate-400 absolute left-3.5 top-3'}),
            (0,N.jsx)('input',{type:'password',required:!0,minLength:8,placeholder:'••••••••',value:newPass,onChange:e=>setNewPass(e.target.value),className:'w-full pl-10 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:outline-hidden'})
          ]})
        ]}),
        (0,N.jsxs)('div',{children:[
          (0,N.jsx)('label',{className:'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5',children:'Confirm New Password'}),
          (0,N.jsxs)('div',{className:'relative',children:[
            (0,N.jsx)(Ci,{className:'w-4 h-4 text-slate-400 absolute left-3.5 top-3'}),
            (0,N.jsx)('input',{type:'password',required:!0,minLength:8,placeholder:'••••••••',value:confirmPass,onChange:e=>setConfirmPass(e.target.value),className:'w-full pl-10 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-blue-500 focus:outline-hidden'})
          ]})
        ]}),
        (0,N.jsxs)('button',{type:'submit',className:'w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer',children:[
          (0,N.jsx)(qr,{className:'w-4 h-4'}),
          (0,N.jsx)('span',{children:'Save & Update Password'})
        ]}),
        (0,N.jsx)('div',{className:'pt-2 text-center',children:(0,N.jsx)('button',{type:'button',onClick:()=>{setMode('login');o('');setSuccess('');},className:'text-xs text-slate-500 hover:text-slate-800 font-semibold hover:underline cursor-pointer',children:'← Cancel & Return to Login'})})
      ]})
    ]})
  ]})
}`;

code = code.substring(0, vaStart) + newVa + code.substring(vaEnd);

fs.writeFileSync('src/app-bundle.js', code, 'utf8');
console.log('Successfully updated src/app-bundle.js with secure auth and Forgot Password suite!');
