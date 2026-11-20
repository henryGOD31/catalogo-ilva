'use strict';
/* =====================================================================
   IMÁGENES: guarda tus fotos en la carpeta /images con el nombre que
   aparece en el campo "img" de cada presentación (ver images/LEEME.txt).
   PRECIOS: los valores son de ejemplo, cámbialos en el campo "p".
   ===================================================================== */
const CATS = [{id:'todos',name:'Todos'},{id:'leches',name:'Leches'},{id:'yogurt',name:'Yogurt'},{id:'jugos',name:'Jugos'},{id:'quesos',name:'Quesos'},{id:'mas',name:'Más ILVA'}];
const PRODUCTS = [
  {id:'yogurt',cat:'yogurt',name:'Yogurt ILVA',desc:'Cremoso y fresco, en 3 presentaciones',emoji:'🍶',v:[{l:'200 ml',p:3.5,img:'yogurt-200ml.png'},{l:'1 L',p:13,img:'yogurt-1l.png'},{l:'1,5 L',p:18,img:'yogurt-1-5l.png'}]},
  {id:'yogurt-probiotico',cat:'yogurt',name:'Yogurt probiótico',desc:'Con probióticos para tu bienestar',emoji:'🥣',v:[{l:'',p:16.5,img:'yogurt-probiotico.png'}]},
  {id:'leche-entera',cat:'leches',name:'Leche entera',desc:'Fresca del Valle Alto',emoji:'🥛',v:[{l:'',p:7.5,img:'leche-entera.png'}]},
  {id:'leche-uht',cat:'leches',name:'Chocoilva',desc:'Larga duración, sabor natural',emoji:'🥛',v:[{l:'',p:8.5,img:'leche-uht.png'}]},
  {id:'leche-deslactozada',cat:'leches',name:'Leche Ultra Pasteurizada',desc:'Fácil de digerir',emoji:'🥛',v:[{l:'',p:8.9,img:'leche-deslactozada.png'}]},
  {id:'ilfrut',cat:'jugos',name:'Ilfrut jugo',desc:'Refrescante, en 2 presentaciones',emoji:'🧃',v:[{l:'200 ml',p:3,img:'ilfrut-200ml.png'},{l:'1 L',p:9,img:'ilfrut-1l.png'}]},
  {id:'queso-edam',cat:'quesos',name:'Queso edam',desc:'Sabor suave, ideal para el desayuno',emoji:'🧀',v:[{l:'',p:35,img:'queso-edam.png'}]},
  {id:'chicotron',cat:'mas',name:'Chicotrón',desc:'Línea ILVA',emoji:'⭐',v:[{l:'',p:4,img:'chicotron.png'}]},
  {id:'paneton',cat:'mas',name:'Panetón',desc:'El clásico de temporada',emoji:'🍞',v:[{l:'',p:35,img:'paneton.png'}]}
];
const FEATURED = ['leche-entera','yogurt','ilfrut','queso-edam','yogurt-probiotico','paneton'];
const TILES = ['#ff8fb8','#a8715a','#ffc14d','#4aa3e8','#9b87f5','#5fc9a0'];

/* ---- Puntos ILVA Express (datos de la sección Dónde comprar) ---- */
const EXPRESS = [
  {id:1,name:'ILVA Express – El Prado',zone:'Centro',addr:'Av. Ballivián (El Prado) esq. Calle Reza, frente a Plaza Colón',open:'07:00',close:'21:30',stock:['Leche deslactosada','Crema de leche','Mantequilla'],x:445,y:170},
  {id:2,name:'ILVA Express – América Oeste',zone:'Norte',addr:'Av. América esq. Av. Libertador Simón Bolívar',open:'07:30',close:'21:00',stock:['Línea completa familiar','Quesos','Dulce de leche'],x:290,y:135},
  {id:3,name:'ILVA Express – Heroínas y San Martín',zone:'Centro',addr:'Av. Heroínas esq. Av. San Martín (a 1 cuadra de Plaza 14 de Septiembre)',open:'06:30',close:'20:30',stock:['Packs desayuno','Leche UHT','Mantequilla'],x:470,y:262},
  {id:4,name:'ILVA Express – Blanco Galindo Km 4',zone:'Oeste',addr:'Av. Blanco Galindo Km 4 esq. Av. Beijing',open:'07:00',close:'21:00',stock:['Packs familiares','Cajas de leche 1 L','Yogurt'],x:150,y:322},
  {id:5,name:'ILVA Express – Planta Valle Alto',zone:'Valle Alto',addr:'Av. Gualberto Villarroel, ingreso principal a Punata',open:'06:30',close:'19:30',stock:['Recién elaborados','Quesillo','Mantequilla','Leche fresca'],x:835,y:232},
  {id:6,name:'ILVA Express – Av. Petrolera',zone:'Sur',addr:'Av. Petrolera Km 3,5 (cerca Facultad de Agronomía UMSS)',open:'07:00',close:'20:00',stock:['Leche entera','Leche deslactosada','Crema de leche'],x:440,y:420}
];
const ROADS = [
  {d:'M40 360Q200 300 335 265',l:'Av. Blanco Galindo',lx:70,ly:392,r:-18},
  {d:'M335 265L720 258',l:'Av. Heroínas',lx:540,ly:282,r:0},
  {d:'M430 60Q440 170 450 262',l:'Av. Ballivián',lx:468,ly:105,r:82},
  {d:'M150 110Q290 130 420 150',l:'Av. América',lx:180,ly:112,r:8},
  {d:'M440 262Q440 380 432 480',l:'Av. Petrolera',lx:452,ly:380,r:88},
  {d:'M720 258Q790 250 860 230',l:'Ruta a Punata',lx:715,ly:236,r:-6,route:1}
];

/* ---- Utilidades ---- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = n => 'Bs ' + n.toFixed(2);
function emoji(e){ const s = document.createElement('span'); s.className = 'em'; s.textContent = e; return s; }
window.emoji = emoji;
/* Busca la foto con varias extensiones (png, webp, jpg, jpeg, svg) y recuerda cuál funcionó */
const IMG_EXT = ['png','webp','jpg','jpeg','PNG','JPG','JPEG','svg'], IMG_FOUND = {};
function imgOrEmoji(src, e, alt){
  const base = src.replace(/\.[a-z0-9]+$/i, ''); let k = IMG_FOUND[base] ?? 0;
  const i = new Image(); i.alt = alt || ''; i.decoding = 'async'; i.className = 'fade';
  i.onload = () => { IMG_FOUND[base] = k; i.classList.add('ok'); };
  i.onerror = () => { if(++k < IMG_EXT.length) i.src = `images/${base}.${IMG_EXT[k]}`; else { console.info(`ILVA: no se encontró images/${base}.png (o .jpg/.webp)`); i.replaceWith(emoji(e)); } };
  i.src = `images/${base}.${IMG_EXT[k]}`; return i;
}
function toast(m){ const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2200); }
const ls = { get(k, d){ try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
let cart = ls.get('ilva-cart2', {}), favs = ls.get('ilva-favs', []), pointId = ls.get('ilva-point', null);
let state = {cat:'todos', q:'', sort:''};

/* ---- Tarjetas de producto (con presentaciones) ---- */
function card(p, i){
  const el = document.createElement('article'); el.className = 'card reveal'; el.style.setProperty('--tile', TILES[i % TILES.length]);
  let vi = 0;
  el.innerHTML = `<div class="tile"><button class="heart ${favs.includes(p.id) ? 'on' : ''}" aria-label="Favorito">♥</button><div class="pimg"></div></div>
    <h3>${p.name}</h3><p class="d">${p.desc}</p>
    ${p.v.length > 1 ? `<div class="sizes">${p.v.map((v, k) => `<button class="size ${k ? '' : 'on'}" data-k="${k}">${v.l}</button>`).join('')}</div>` : ''}
    <div class="buy"><span class="price"></span><button class="btn pink add">Agregar</button></div>`;
  const pimg = $('.pimg', el), price = $('.price', el);
  const paint = () => { const v = p.v[vi]; price.textContent = money(v.p); pimg.replaceChildren(imgOrEmoji(v.img, p.emoji, p.name + ' ' + v.l)); };
  paint();
  el.addEventListener('click', e => {
    const s = e.target.closest('.size');
    if(s){ vi = +s.dataset.k; $$('.size', el).forEach(x => x.classList.toggle('on', x === s)); return paint(); }
    const h = e.target.closest('.heart');
    if(h){ favs = favs.includes(p.id) ? favs.filter(f => f !== p.id) : [...favs, p.id]; ls.set('ilva-favs', favs); h.classList.toggle('on'); return toast(h.classList.contains('on') ? 'Guardado en favoritos 💜' : 'Quitado de favoritos'); }
    const a = e.target.closest('.add');
    if(a) addToCart(p.id + ':' + vi, a);
  });
  return el;
}
function renderProducts(){
  const list = PRODUCTS.filter(p => (state.cat === 'todos' || p.cat === state.cat) && (p.name + p.desc).toLowerCase().includes(state.q.toLowerCase()));
  if(state.sort) list.sort((a, b) => state.sort === 'asc' ? a.v[0].p - b.v[0].p : b.v[0].p - a.v[0].p);
  const g = $('#productGrid'); g.replaceChildren();
  if(!list.length){ g.innerHTML = '<p class="empty">No encontramos productos con esa búsqueda 💜</p>'; return; }
  list.forEach((p, i) => g.append(card(p, i))); observeReveal();
}
function renderChips(){
  $('#chips').innerHTML = CATS.map(c => `<button class="chip ${state.cat === c.id ? 'on' : ''}" data-cat="${c.id}">${c.name}</button>`).join('');
}
$('#chips').addEventListener('click', e => { const c = e.target.closest('[data-cat]'); if(!c) return; state.cat = c.dataset.cat; renderChips(); renderProducts(); });
$('#search').addEventListener('input', e => { state.q = e.target.value; renderProducts(); });
$('#sort').addEventListener('change', e => { state.sort = e.target.value; renderProducts(); });
FEATURED.forEach((id, i) => $('#favTrack').append(card(PRODUCTS.find(p => p.id === id), i)));
$('#prevF').onclick = () => $('#favTrack').scrollBy({left:-280, behavior:'smooth'});
$('#nextF').onclick = () => $('#favTrack').scrollBy({left:280, behavior:'smooth'});

/* ---- Carrito ---- */
const openCart = on => { $('#drawer').classList.toggle('on', on); $('#overlay').classList.toggle('on', on); };
$('#openCart').onclick = () => openCart(true);
$('#closeCart').onclick = () => openCart(false);
$('#overlay').onclick = () => { openCart(false); closeModal(); };
document.addEventListener('keydown', e => { if(e.key === 'Escape'){ openCart(false); closeModal(); } });
const lineOf = key => { const [id, vi] = key.split(':'), p = PRODUCTS.find(x => x.id === id); return p && p.v[vi] ? {p, v:p.v[vi]} : null; };
const total = () => Object.entries(cart).reduce((s, [k, n]) => { const l = lineOf(k); return s + (l ? l.v.p * n : 0); }, 0);
function save(){ ls.set('ilva-cart2', cart); renderCart(); }
function addToCart(key, btn){
  cart[key] = (cart[key] || 0) + 1; save();
  const b = $('#openCart'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  if(btn){ const t = btn.textContent; btn.textContent = '✓ Listo'; setTimeout(() => btn.textContent = t, 900); }
  const l = lineOf(key); toast('Agregado: ' + l.p.name + (l.v.l ? ' ' + l.v.l : ''));
}
$('#cartItems').addEventListener('click', e => {
  const q = e.target.closest('[data-q]'), r = e.target.closest('[data-rm]');
  if(q){ cart[q.dataset.k] += +q.dataset.q; if(cart[q.dataset.k] <= 0) delete cart[q.dataset.k]; save(); }
  if(r){ delete cart[r.dataset.rm]; save(); }
});
$('#clearCart').onclick = () => { cart = {}; save(); };
function renderCart(){
  const keys = Object.keys(cart).filter(k => lineOf(k));
  $('#cartCount').textContent = keys.reduce((s, k) => s + cart[k], 0);
  $('#cartTotal').textContent = money(total());
  const box = $('#cartItems');
  if(!keys.length){ box.innerHTML = '<p class="empty">Tu carrito está vacío 🛍️<br>Agrega tus productos favoritos.</p>'; return; }
  box.replaceChildren(); keys.forEach(k => {
    const {p, v} = lineOf(k), row = document.createElement('div'); row.className = 'item';
    row.innerHTML = `<div class="th"></div><div><b>${p.name}</b>${v.l ? ' · ' + v.l : ''}<br><small>${money(v.p)}</small>
      <div class="qty"><button data-q="-1" data-k="${k}" aria-label="Quitar uno">−</button><span>${cart[k]}</span><button data-q="1" data-k="${k}" aria-label="Agregar uno">+</button></div></div>
      <div><b>${money(v.p * cart[k])}</b><br><button class="rm" data-rm="${k}" aria-label="Eliminar">🗑</button></div>`;
    $('.th', row).append(imgOrEmoji(v.img, p.emoji, p.name)); box.append(row);
  });
}

/* ---- Pago (domicilio o recojo en ILVA Express) ---- */
const modal = $('#modal');
const openModal = html => { $('#modalBox').innerHTML = html; modal.classList.add('on'); $('#overlay').classList.add('on'); };
function closeModal(){ modal.classList.remove('on'); if(!$('#drawer').classList.contains('on')) $('#overlay').classList.remove('on'); }
modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
const PAY = {
  qr:'<p>Escanea el QR con tu app bancaria:</p><div class="qr">QR aquí</div>',
  tarjeta:'<label class="f">Número de tarjeta<input class="t" id="card" inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000"></label><label class="f">Vencimiento y CVV<input class="t" id="exp" maxlength="10" placeholder="MM/AA · CVV"></label>',
  transferencia:'<p>Banco: <b>Tu Banco</b><br>Cuenta: <b>000-000000-0</b><br>Titular: <b>ILVA</b></p>',
  efectivo:'<p>Pagas en efectivo al recibir o al recoger tu pedido.</p>'
};
function fakeQR(seed){ /* QR ilustrativo (no es un código real) */
  let h = 7; for(const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  let r = '';
  for(let y = 0; y < 21; y++) for(let x = 0; x < 21; x++){
    const f = (x < 7 || x > 13) && (y < 7 || y > 13) && !(x > 13 && y > 13);
    let on; if(f){ const a = x > 13 ? x - 14 : x, b = y > 13 ? y - 14 : y; on = a == 0 || a == 6 || b == 0 || b == 6 || (a > 1 && a < 5 && b > 1 && b < 5); }
    else { h = (h * 1103515245 + 12345) >>> 0; on = (h >> 16) & 1; }
    if(on) r += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }
  return `<svg viewBox="0 0 21 21" shape-rendering="crispEdges" fill="#2a1a5e" role="img" aria-label="Código QR de recojo ilustrativo">${r}</svg>`;
}
$('#checkoutBtn').onclick = () => {
  if(!Object.keys(cart).length) return toast('Agrega productos antes de pagar');
  openCart(false);
  openModal(`<h3>Finalizar compra</h3><form id="payForm" novalidate>
    <label class="f">Nombre completo<input class="t" name="n"></label>
    <label class="f">Celular<input class="t" name="tel" inputmode="tel"></label>
    <b>¿Cómo lo recibes?</b>
    <div class="opts"><label class="pay"><input type="radio" name="del" value="dom" checked>🚚 A domicilio</label><label class="pay"><input type="radio" name="del" value="rec">🏪 Recojo ILVA Express</label></div>
    <label class="f" id="boxDom">Dirección de entrega<textarea name="dir" rows="2"></textarea></label>
    <label class="f" id="boxRec" hidden>Punto de recojo<select class="t" name="pt">${EXPRESS.map(p => `<option value="${p.id}" ${p.id == pointId ? 'selected' : ''}>${p.name}</option>`).join('')}</select></label>
    <b>Método de pago</b>
    <div class="opts"><label class="pay"><input type="radio" name="pay" value="qr" checked>📱 QR</label><label class="pay"><input type="radio" name="pay" value="tarjeta">💳 Tarjeta</label><label class="pay"><input type="radio" name="pay" value="transferencia">🏦 Transferencia</label><label class="pay"><input type="radio" name="pay" value="efectivo">💵 Efectivo</label></div>
    <div class="pay-extra" id="payExtra">${PAY.qr}</div>
    <div class="total"><span>Total</span><b>${money(total())}</b></div><p class="err" id="payErr"></p>
    <button class="btn pink full" type="submit">Confirmar pedido</button></form>`);
  const f = $('#payForm');
  $$('input[name=del]', f).forEach(r => r.onchange = () => { $('#boxDom').hidden = f.del.value === 'rec'; $('#boxRec').hidden = f.del.value !== 'rec'; });
  $$('input[name=pay]', f).forEach(r => r.onchange = () => $('#payExtra').innerHTML = PAY[r.value]);
  f.onsubmit = e => {
    e.preventDefault(); const err = $('#payErr'), rec = f.del.value === 'rec';
    if(!f.n.value.trim() || !f.tel.value.trim()) return err.textContent = 'Completa tu nombre y celular.';
    if(!/^\+?[\d\s-]{7,}$/.test(f.tel.value)) return err.textContent = 'Escribe un celular válido.';
    if(!rec && !f.dir.value.trim()) return err.textContent = 'Escribe tu dirección de entrega.';
    if(f.pay.value === 'tarjeta' && ($('#card').value.replace(/\D/g, '').length < 13 || !$('#exp').value.trim())) return err.textContent = 'Revisa los datos de tu tarjeta.';
    const num = 'ILVA-' + Math.floor(100000 + Math.random() * 900000), pt = EXPRESS.find(p => p.id == f.pt.value);
    /* AQUÍ conecta tu backend: fetch('/api/pedidos', {method:'POST', body: JSON.stringify({cart, datos})}) */
    cart = {}; save();
    $('#modalBox').innerHTML = `<div class="ok"><div class="tick">🎉</div><h3>¡Pedido confirmado!</h3><p>Pedido <b>${num}</b>. Te contactaremos al ${f.tel.value}.</p>
      ${rec ? `<p>Recoge en <b>${pt.name}</b><br><small>${pt.addr}</small></p>${fakeQR(num + pt.id)}<small>QR de recojo ilustrativo</small>` : ''}<br><br>
      <button class="btn pink" onclick="document.getElementById('overlay').click()">Seguir comprando</button></div>`;
  };
};

/* ---- ILVA Express: lista + mapa ---- */
let zone = 'Todas', exQ = '', selId = pointId || 1;
const mins = t => { const [h, m] = t.split(':'); return h * 60 + +m; };
function status(p){
  const n = new Date(), now = n.getHours() * 60 + n.getMinutes(), o = mins(p.open), c = mins(p.close);
  if(now < o || now >= c) return {c:'closed', t:'Cerrado ahora'};
  return c - now <= 60 ? {c:'soon', t:'Cierra pronto'} : {c:'open', t:'Abierto ahora'};
}
$('#exZones').innerHTML = ['Todas','Centro','Norte','Oeste','Sur','Valle Alto'].map(z => `<button class="chip ${z === zone ? 'on' : ''}" data-z="${z}">${z}</button>`).join('');
$('#exZones').onclick = e => { const b = e.target.closest('[data-z]'); if(!b) return; zone = b.dataset.z; $$('#exZones .chip').forEach(c => c.classList.toggle('on', c === b)); renderExpress(); };
$('#exSearch').oninput = e => { exQ = e.target.value.toLowerCase(); renderExpress(); };
function drawMap(){
  const svg = $('#exMap');
  svg.innerHTML = `<rect width="900" height="520" fill="#eaf2ff"/><ellipse cx="450" cy="250" rx="400" ry="200" fill="#f4f8ff"/>` +
    ROADS.map(r => r.route ? `<path class="road r" d="${r.d}"/>` : `<path class="road b" d="${r.d}"/><path class="road w" d="${r.d}"/>`).join('') +
    ROADS.map(r => `<text class="rl" x="${r.lx}" y="${r.ly}" transform="rotate(${r.r} ${r.lx} ${r.ly})">${r.l}</text>`).join('') +
    EXPRESS.map(p => `<g class="pin" data-id="${p.id}" tabindex="0" role="button" aria-label="${p.name}"><circle class="pulse" cx="${p.x}" cy="${p.y}" r="10"/><circle class="dot" cx="${p.x}" cy="${p.y}" r="10"/><text x="${p.x}" y="${p.y + 4}" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" pointer-events="none">${p.id}</text></g>`).join('');
  const go = e => { const g = e.target.closest('.pin'); if(g) select(+g.dataset.id); };
  svg.onclick = go; svg.onkeydown = e => { if(e.key === 'Enter') go(e); };
}
function select(id){ selId = id; renderExpress(); $('.pt.sel')?.scrollIntoView({block:'nearest', behavior:'smooth'}); }
function renderExpress(){
  const list = EXPRESS.filter(p => (zone === 'Todas' || p.zone === zone) && (p.name + p.zone + p.addr + p.stock.join(' ')).toLowerCase().includes(exQ));
  $('#exList').innerHTML = list.length ? list.map(p => { const s = status(p); return `<article class="pt ${p.id === selId ? 'sel' : ''}" data-id="${p.id}">
    <h4>${p.id}. ${p.name}</h4><span class="st ${s.c}">${s.t}</span><p>📍 ${p.addr}</p><p class="hrs">🕒 ${p.open} – ${p.close} · Zona ${p.zone}</p>
    <div class="tags">${p.stock.map(t => `<span>${t}</span>`).join('')}</div>
    <button class="btn pink pick ${p.id === pointId ? 'done' : ''}" data-pick="${p.id}">${p.id === pointId ? '✓ Punto seleccionado' : 'Seleccionar este punto'}</button></article>`; }).join('') : '<p class="empty">No hay puntos con esa búsqueda.</p>';
  $$('#exMap .pin').forEach(g => { g.style.display = list.some(p => p.id == g.dataset.id) ? '' : 'none'; g.classList.toggle('sel', +g.dataset.id === selId); });
  const p = EXPRESS.find(x => x.id === selId), s = status(p);
  $('#exDetail').innerHTML = `<h4>${p.name}</h4><div class="row"><span class="st ${s.c}">${s.t}</span><span>🕒 ${p.open} – ${p.close}</span></div><p>📍 ${p.addr}</p>
    <div class="row"><a class="btn dark" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.addr + ', Cochabamba')}">Cómo llegar</a></div>`;
}
$('#exList').addEventListener('click', e => {
  const b = e.target.closest('[data-pick]');
  if(b){ pointId = +b.dataset.pick; ls.set('ilva-point', pointId); selId = pointId; renderExpress(); return toast('Punto de recojo: ' + EXPRESS.find(p => p.id === pointId).name); }
  const c = e.target.closest('.pt'); if(c){ selId = +c.dataset.id; renderExpress(); }
});

/* ---- Interacciones generales ---- */
$('#burger').onclick = e => { const o = $('#nav').classList.toggle('on'); e.currentTarget.setAttribute('aria-expanded', o); };
$$('#nav a').forEach(a => a.addEventListener('click', () => $('#nav').classList.remove('on')));
addEventListener('scroll', () => { $('#header').classList.toggle('scrolled', scrollY > 40); $('#toTop').classList.toggle('on', scrollY > 700); }, {passive:true});
$('#toTop').onclick = () => scrollTo({top:0, behavior:'smooth'});
const io = new IntersectionObserver(en => en.forEach(x => { if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); } }), {threshold:.12});
function observeReveal(){ $$('.reveal:not(.in)').forEach(el => io.observe(el)); }
const spy = new IntersectionObserver(en => en.forEach(x => { if(x.isIntersecting) $$('#nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + x.target.id)); }), {rootMargin:'-45% 0px -50% 0px'});
['inicio','nosotros','productos','donde-comprar','contacto'].forEach(id => spy.observe($('#' + id)));
$('#inicio').addEventListener('mousemove', e => { /* movimiento suave de la imagen y las formas */
  if(matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const x = (e.clientX / innerWidth - .5) * 2, y = (e.clientY / innerHeight - .5) * 2;
  $('#heroImg').style.transform = `translate(${x * 14}px,${y * 10}px)`;
  $$('.blob').forEach((b, i) => b.style.transform = `translate(${x * (i ? -22 : 22)}px,${y * 14}px)`);
});
$('#contactForm').onsubmit = e => {
  e.preventDefault(); const f = e.target, m = $('#formMsg');
  if(!f.nombre.value.trim() || !/^\S+@\S+\.\S+$/.test(f.correo.value) || !f.mensaje.value.trim()) return m.textContent = 'Completa tu nombre, un correo válido y el mensaje.';
  const t = `Hola ILVA, soy ${f.nombre.value} (${f.correo.value}). ${f.mensaje.value}`;
  open('https://wa.me/59170346043?text=' + encodeURIComponent(t), '_blank'); m.textContent = '¡Gracias! Abrimos WhatsApp para enviar tu mensaje.'; f.reset();
};

$('#heroImg').append(imgOrEmoji('hero.png', '🥛', 'Productos ILVA'));
$('#bannerImg').append(imgOrEmoji('banner.png', '🧀', ''));
renderChips(); renderProducts(); renderCart(); drawMap(); renderExpress(); observeReveal();
