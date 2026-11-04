/* Asistente de Manojito: preguntas frecuentes sin servidor. Editá la lista FAQ para cambiar respuestas. */
(function () {
  if (window.__mjAsist) return; window.__mjAsist = 1;
  var WA = '5492617142759';
  var FAQ = [
    { k: ['envio', 'enviar', 'retiro', 'retirar', 'entrega', 'donde', 'direccion', 'ubicacion', 'mendoza', 'correo'],
      a: 'Por ahora trabajamos con **retiro en Mendoza**. Coordinamos día y lugar por WhatsApp una vez confirmado tu pedido.',
      l: [['Coordinar por WhatsApp', 'wa', 'Hola! Quiero coordinar el retiro de mi pedido']] },
    { k: ['comprar', 'compra', 'pedido', 'pedir', 'carrito', 'como compro'],
      a: 'Es simple: elegí tus productos, agregalos al **carrito** y enviá el pedido. Lo confirmamos por WhatsApp y coordinamos pago y retiro.',
      l: [['Ver la tienda', 'url', 'index.html#menu'], ['Ver insumos', 'url', 'insumos.html']] },
    { k: ['pago', 'pagar', 'transferencia', 'alias', 'cbu', 'cvu', 'mercado pago', 'mercadopago', 'titular', 'medios'],
      a: 'Podés pagar por **transferencia / Mercado Pago**:\nAlias: **casa.ejerce.raba.mp**\nTitular: Facundo Calderón\nDespués mandanos el comprobante por WhatsApp.',
      l: [['Copiar alias', 'copy', 'casa.ejerce.raba.mp'], ['Enviar comprobante', 'wa', 'Hola! Te envío el comprobante de mi pago']] },
    { k: ['suscri', 'plan', 'membresia', 'mensual', 'anual', 'cuanto sale', 'precio plan', 'abono'],
      a: 'La suscripción te da acceso a los **cursos paso a paso** de porcelana fría:\n• Mensual: **$4.900**\n• Anual: **$36.000** (ahorrás 39%)\nElegís el plan, transferís y activamos tu cuenta apenas llega el comprobante.',
      l: [['Ver planes', 'url', 'index.html#suscripcion']] },
    { k: ['curso', 'clase', 'actividad', 'aprender', 'tutorial', 'video', 'paso a paso', 'principiante'],
      a: 'Las **actividades** son cursos con materiales, pasos y videos. Hay una ruta para principiantes y se suman novedades. Son para suscriptores.',
      l: [['Ir a Actividades', 'url', 'actividades.html'], ['Ver planes', 'url', 'index.html#suscripcion']] },
    { k: ['activar', 'activacion', 'ya pague', 'no me activaron', 'no puedo entrar', 'acceso', 'no veo'],
      a: 'Si ya pagaste, mandanos el **comprobante y el email de tu cuenta** por WhatsApp y activamos tu plan. Después cerrá sesión y volvé a entrar.',
      l: [['Avisar por WhatsApp', 'wa', 'Hola! Ya hice el pago de la suscripción. Mi email es: ']] },
    { k: ['contrasena', 'clave', 'password', 'olvide', 'recuperar', 'cambiar contra'],
      a: 'Si estás logueada/o, entrá a **tu perfil → Cambiar contraseña**. Si la olvidaste, escribinos por WhatsApp y te damos una **clave temporal**.',
      l: [['Pedir clave temporal', 'wa', 'Hola! Olvidé mi contraseña. Mi email es: ']] },
    { k: ['insumo', 'ojos', 'pintura', 'acrilico', 'herramienta', 'molde', 'materiales', 'verniz', 'barniz'],
      a: 'En **Insumos** tenés ojos, pinturas, herramientas y accesorios para tus manualidades. Se piden por WhatsApp y se retiran en Mendoza.',
      l: [['Ir a Insumos', 'url', 'insumos.html']] },
    { k: ['app', 'instalar', 'descargar', 'pwa', 'pantalla de inicio', 'icono'],
      a: 'Podés instalar Manojito como app: en Chrome tocá el botón de descarga del encabezado; en otros navegadores, menú **⋮ → Instalar app / Agregar a pantalla de inicio** (en iPhone: Compartir → Agregar a inicio).' },
    { k: ['precio', 'cuanto', 'vale', 'costo', 'broche', 'imperdible', 'porcelana', 'horquilla', 'navidad', 'figura'],
      a: 'Los precios están en cada producto de la tienda: broches desde **$1.800**, hechos a mano en porcelana fría. ¿Buscás algo en especial o un pedido personalizado?',
      l: [['Ver productos', 'url', 'index.html#menu'], ['Pedido personalizado', 'wa', 'Hola! Quiero consultar por un pedido personalizado']] },
    { k: ['hola', 'buenas', 'buen dia', 'buenas tardes', 'buenas noches', 'gracias'],
      a: '¡Hola! 🌸 Soy el asistente de Manojito. Elegí un tema o escribime tu pregunta.' },
    { k: ['humano', 'persona', 'whatsapp', 'hablar', 'contacto', 'contactar', 'telefono'],
      a: 'Claro, te atiende Manojito directamente por WhatsApp.',
      l: [['Abrir WhatsApp', 'wa', 'Hola! Tengo una consulta']] }
  ];
  var CHIPS = ['Retiro en Mendoza', 'Cómo pagar', 'Suscripción', 'Cursos', 'Instalar la app'];
  var CHIPQ = { 'Retiro en Mendoza': 'retiro', 'Cómo pagar': 'pagar', 'Suscripción': 'suscripcion', 'Cursos': 'curso', 'Instalar la app': 'instalar app' };

  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function find(q) {
    var n = ' ' + norm(q) + ' ', best = null, bs = 0;
    FAQ.forEach(function (f) {
      var s = 0; f.k.forEach(function (k) { if (n.indexOf(k.length > 4 ? k : ' ' + k + ' ') > -1) s += k.length > 4 ? 2 : 1; });
      if (s > bs) { bs = s; best = f; }
    });
    return best;
  }

  var css = '#mja-b{position:fixed;left:14px;bottom:16px;z-index:9000;width:60px;height:60px;padding:0;border-radius:22px 22px 22px 6px;border:2.5px solid #f0c060;background:linear-gradient(145deg,#3a2150,#7c4fa0);color:#fff;cursor:pointer;display:grid;place-items:center;box-shadow:0 8px 22px rgba(40,10,60,.45);-webkit-tap-highlight-color:transparent;transition:transform .2s;animation:mjaBob 3.2s ease-in-out infinite}' +
    '@keyframes mjaBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}' +
    '#mja-b:active{transform:scale(.93)}#mja-b .mja-ic{font-size:28px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,.3))}' +
    '#mja-b .mja-bd{position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;border-radius:10px;background:#ef6a4c;color:#fff;font:800 11px/20px Nunito,sans-serif;text-align:center;border:2px solid #fff}' +
    '#mja-tip{position:fixed;left:84px;bottom:30px;z-index:9000;background:#fff;color:#4a2f5c;font:700 13.5px/1.35 Nunito,"DM Sans",system-ui,sans-serif;padding:10px 14px;border-radius:14px 14px 14px 4px;box-shadow:0 6px 20px rgba(40,10,60,.25);max-width:190px;opacity:0;transform:translateX(-8px);pointer-events:none;transition:opacity .3s,transform .3s}' +
    '#mja-tip.on{opacity:1;transform:none}' +
    '#mja-w{position:fixed;left:10px;right:10px;bottom:10px;max-width:400px;height:min(540px,82vh);z-index:10000;background:#fff;border-radius:20px;box-shadow:0 14px 44px rgba(40,10,50,.4);display:none;flex-direction:column;overflow:hidden;font-family:Nunito,"DM Sans",system-ui,sans-serif}' +
    '#mja-w.on{display:flex;animation:mjaUp .3s ease}@keyframes mjaUp{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}' +
    '#mja-h{background:linear-gradient(135deg,#9e5f74,#7c4fa0);color:#fff;padding:13px 14px;display:flex;align-items:center;gap:10px}' +
    '#mja-h b{font-size:15px;display:block}#mja-h small{opacity:.85;font-size:12px}#mja-h .av{width:36px;height:36px;border-radius:50%;background:#ffffff30;display:grid;place-items:center;font-size:19px;flex:none}' +
    '#mja-x{margin-left:auto;background:none;border:none;color:#fff;font-size:26px;line-height:1;cursor:pointer;padding:4px 8px}' +
    '#mja-m{flex:1;overflow-y:auto;padding:14px;background:#faf6fb;display:flex;flex-direction:column;gap:9px}' +
    '.mja-msg{max-width:86%;padding:9px 12px;border-radius:14px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}' +
    '.mja-bot{background:#fff;color:#33283a;border:1px solid #eadff0;border-bottom-left-radius:4px;align-self:flex-start}' +
    '.mja-me{background:#7c4fa0;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}' +
    '.mja-acts{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-start;max-width:92%}' +
    '.mja-acts a,.mja-acts button,#mja-c button{font:inherit;font-size:13px;font-weight:700;border-radius:999px;padding:7px 12px;cursor:pointer;text-decoration:none;border:1.5px solid #7c4fa0;background:#fff;color:#7c4fa0}' +
    '.mja-acts .wa{background:#25a05a;border-color:#25a05a;color:#fff}' +
    '#mja-c{padding:8px 10px 0;display:flex;gap:6px;overflow-x:auto;background:#fff;scrollbar-width:none}#mja-c button{white-space:nowrap;flex:none;font-size:12.5px}' +
    '#mja-f{display:flex;gap:8px;padding:10px;background:#fff}#mja-f input{flex:1;border:1.5px solid #e0d4ea;border-radius:999px;padding:10px 14px;font:inherit;font-size:14px;outline:none;min-width:0}#mja-f input:focus{border-color:#7c4fa0}' +
    '#mja-f button{border:none;background:#7c4fa0;color:#fff;border-radius:50%;width:42px;height:42px;font-size:18px;cursor:pointer;flex:none}' +
    '@media(min-width:560px){#mja-w{left:14px;right:auto;bottom:80px;width:380px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var b = document.createElement('button'); b.id = 'mja-b'; b.type = 'button'; b.setAttribute('aria-label', 'Abrir asistente');
  b.innerHTML = '<span class="mja-ic">💬</span><span class="mja-bd">1</span>';
  var w = document.createElement('div'); w.id = 'mja-w'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Asistente de Manojito');
  w.innerHTML = '<div id="mja-h"><div class="av">🌸</div><div><b>Asistente Manojito</b><small>Te respondo al instante</small></div><button id="mja-x" type="button" aria-label="Cerrar">×</button></div><div id="mja-m"></div><div id="mja-c"></div><form id="mja-f"><input id="mja-i" type="text" placeholder="Escribí tu pregunta…" autocomplete="off" maxlength="200"><button type="submit" aria-label="Enviar">➤</button></form>';
  document.body.appendChild(b); document.body.appendChild(w);
  var M = w.querySelector('#mja-m'), C = w.querySelector('#mja-c'), I = w.querySelector('#mja-i'), started = false;

  function bold(el, txt) { txt.split('**').forEach(function (p, i) { if (!p) return; var n = i % 2 ? document.createElement('b') : document.createTextNode(''); if (i % 2) { n.textContent = p; el.appendChild(n); } else el.appendChild(document.createTextNode(p)); }); }
  function say(txt, me) { var d = document.createElement('div'); d.className = 'mja-msg ' + (me ? 'mja-me' : 'mja-bot'); if (me) d.textContent = txt; else bold(d, txt); M.appendChild(d); M.scrollTop = M.scrollHeight; }
  function acts(list) {
    if (!list || !list.length) return;
    var box = document.createElement('div'); box.className = 'mja-acts';
    list.forEach(function (x) {
      var t = x[1], el;
      if (t === 'copy') { el = document.createElement('button'); el.type = 'button'; el.textContent = x[0]; el.onclick = function () { try { navigator.clipboard.writeText(x[2]); } catch (e) {} el.textContent = '¡Copiado!'; }; }
      else { el = document.createElement('a'); el.textContent = x[0]; if (t === 'wa') { el.className = 'wa'; el.target = '_blank'; el.rel = 'noopener'; el.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(x[2]); } else { el.href = x[2]; } }
      box.appendChild(el);
    });
    M.appendChild(box); M.scrollTop = M.scrollHeight;
  }
  function ask(q, label) {
    q = q.trim(); if (!q) return; say(label || q, true);
    var f = find(q);
    setTimeout(function () {
      if (f) { say(f.a); acts(f.l); }
      else { say('No estoy segura de cómo ayudarte con eso 🙈. Escribile a Manojito por WhatsApp y te responde en persona.'); acts([['Preguntar por WhatsApp', 'wa', 'Hola! Tengo una consulta: ' + q]]); }
    }, 350);
  }
  function open() { tip.classList.remove('on'); w.classList.add('on'); b.style.display = 'none'; if (!started) { started = true; say('¡Hola! 🌸 Soy el asistente de Manojito. ¿En qué te ayudo?'); } setTimeout(function () { I.focus(); }, 300); }
  function close() { w.classList.remove('on'); b.style.display = 'grid'; }
  CHIPS.forEach(function (c) { var x = document.createElement('button'); x.type = 'button'; x.textContent = c; x.onclick = function () { ask(CHIPQ[c], c); }; C.appendChild(x); });
  b.onclick = open; w.querySelector('#mja-x').onclick = close;
  w.querySelector('#mja-f').onsubmit = function (e) { e.preventDefault(); var v = I.value; I.value = ''; ask(v); };
  var tip = document.createElement('div'); tip.id = 'mja-tip'; tip.textContent = '¡Hola! 🌸 ¿Necesitás ayuda con algo?'; document.body.appendChild(tip);
  setTimeout(function(){ if (!started) tip.classList.add('on'); }, 3500);
  setTimeout(function(){ tip.classList.remove('on'); }, 11000);
  window.mjAsistente = { open: open };
})();
