/* js/app.js — v2.2 */
'use strict';

const APP = {
  role: 'colab',
  currentVehicle: 'moto',
  vehicleOwner: 'propio',
};

const SESSION = {
  jornada_id: null,
  preoperacional_id: null,
  vehiculo_id: null,
  colaborador_cedula: null,
};

const HEADERS = {
  's-login': { t: 'Acceso al sistema', s: '' },
  's-home': { t: 'Mi jornada', s: '' },
  's-inspect': { t: 'Inspección', s: 'Paso 1 de 2' },
  's-km': { t: 'Kilometraje', s: 'Paso 2 de 2' },
  's-done': { t: 'Turno cerrado ✓', s: '' },
  's-dash': { t: 'Panel supervisor', s: 'Hoy' },
};

const PROG = {
  's-inspect': [0],
  's-km': [0, 1],
};

const NAV_MAP = {
  's-login': 0,
  's-home': 1,
  's-inspect': 2,
  's-km': 3,
  's-done': 3,
  's-dash': null,
};

// ── NAVIGATE ──────────────────────────────────
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');

  const h = HEADERS[id] || { t: 'OSZFORD', s: '' };
  document.getElementById('hdr-title').textContent = h.t;
  document.getElementById('hdr-step').textContent = h.s;

  const pw = document.getElementById('prog-wrap');
  if (PROG[id]) {
    pw.style.display = 'block';
    for (let i = 0; i < 2; i++) {
      const dot = document.getElementById('pd' + i);
      if (!dot) continue;
      dot.className = 'pdot';
      if (PROG[id].includes(i)) dot.classList.add('done');
      else if (i === PROG[id].length) dot.classList.add('act');
    }
  } else {
    pw.style.display = 'none';
  }

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('act'));
  const ni = NAV_MAP[id];
  if (ni != null) {
    const btns = document.querySelectorAll('.nav-btn');
    if (btns[ni]) btns[ni].classList.add('act');
  }

  if (id === 's-inspect') { initInspection(APP.currentVehicle); updateInspectTitle(); }
  if (id === 's-done') { buildDoneSummary(); }
  if (id === 's-dash') { initDashCharts(); updateDashDate(); }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── ROLE ──────────────────────────────────────
function setRole(role) {
  APP.role = role;
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('rc-' + role)?.classList.add('selected');
}

// ── LOGIN ─────────────────────────────────────
function pinNav(pfx, i) {
  const el = document.getElementById(pfx + i);
  el.value = el.value.replace(/\D/g, '');
  
  // Si escribió algo, ir al siguiente
  if (el.value && i < 3) {
    document.getElementById(pfx + (i + 1)).focus();
  }
  
  // Si presionó backspace y está vacío, ir al anterior
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !el.value && i > 0) {
      document.getElementById(pfx + (i - 1)).focus();
    }
  });
}


async function doLogin() {
  const ced = document.getElementById('l-ced').value.trim();
  const pin = ['lp0', 'lp1', 'lp2', 'lp3'].map(id => document.getElementById(id).value).join('');
  const cedField = document.getElementById('l-ced');
  
  if (ced.length < 7) { cedField.parentElement.classList.add('has-err'); return; }
  cedField.parentElement.classList.remove('has-err');
  
  const pinErr = document.getElementById('l-pin-err');
  if (pin.length < 4) { pinErr.style.display = 'block'; return; }
  pinErr.style.display = 'none';
  
  const btnTxt = document.getElementById('l-btn-txt');
  const btnSpin = document.getElementById('l-spin');
  btnTxt.style.display = 'none';
  btnSpin.style.display = 'inline';
  
  try {
    const result = await API.login(ced, pin);
    
    btnTxt.style.display = 'inline';
    btnSpin.style.display = 'none';
    
    APP.role = result.role;
    const nextScreen = result.role === 'super' ? 's-dash' : 's-home';
    goTo(nextScreen);
    
    // Actualizar nombre en la pantalla
document.getElementById('user-name-display').textContent = result.nombre;

  } catch (err) {
    btnTxt.style.display = 'inline';
    btnSpin.style.display = 'none';
    pinErr.textContent = err.message;
    pinErr.style.display = 'block';
  }
}

// ── VEHICLE TYPE ──────────────────────────────
function selectVT(key) {
  APP.currentVehicle = key;
  document.querySelectorAll('.vtype-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('vt-' + key)?.classList.add('selected');
  // placa section only for motorized
  const ps = document.getElementById('placa-section');
  if (ps) ps.style.display = ['moto', 'elec'].includes(key) ? 'block' : 'none';
}

// ── OWNER ─────────────────────────────────────
function selectOwner(owner) {
  APP.vehicleOwner = owner;
  document.querySelectorAll('.owner-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('ow-' + owner)?.classList.add('selected');
}

// ── PLATE ─────────────────────────────────────
function formatPlate(input) {
  let val = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let letters = val.slice(0, 3).replace(/[^A-Z]/g, '');
  let digits = val.slice(3, 6).replace(/[^0-9]/g, '');
  input.value = (letters + digits).slice(0, 6);
  const st = document.getElementById('plate-status');
  if (st) st.style.display = 'none';
}

// ── TECHNOMECÁNICA — toggle "no aplica" ───────
function toggleTecnoNA(cb) {
  const input = document.getElementById('h-tecno');
  if (!input) return;
  input.disabled = cb.checked;
  input.style.opacity = cb.checked ? '.4' : '1';
  if (cb.checked) input.value = '';

  const label = cb.closest('.check-inline');
  if (label) {
    label.classList.remove('pulse-anim');
    void label.offsetWidth; // trigger reflow
    label.classList.add('pulse-anim');
  }
}

// ── INSPECT TITLE ─────────────────────────────
function updateInspectTitle() {
  const sub = document.getElementById('inspect-subtitle');
  if (!sub) return;
  const L = { moto: 'Motocicleta', elec: 'Moto eléctrica', bici: 'Bicicleta', pat: 'Patineta eléctrica' };
  sub.textContent = 'Inspección — ' + (L[APP.currentVehicle] || '');
}

// ── DONE SUMMARY (merged km + fin) ────────────
function buildDoneSummary() {
  const vL = { moto: 'Motocicleta', elec: 'Moto eléctrica', bici: 'Bicicleta', pat: 'Patineta' };
  const plate = (document.getElementById('h-placa')?.value || '').toUpperCase() || '—';
  const owner = APP.vehicleOwner === 'empresa' ? 'Empresa' : 'Propio';
  const puesto = document.getElementById('h-puesto');
  const puestoTxt = puesto ? puesto.options[puesto.selectedIndex]?.text : '—';

  const kmIni = OCR.ini.km || 0;
  const kmFin = OCR.fin.km || 0;
  const kmDiff = kmFin - kmIni;
  const taken = Object.values(partPhotos).filter(Boolean).length;
  const total = VEHICLES[APP.currentVehicle]?.parts?.length || 0;

  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const hora = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('d-veh', (vL[APP.currentVehicle] || '—') + ' · ' + plate);
  set('d-owner', owner + ' · ' + puestoTxt);
  set('d-km-ini', kmIni.toLocaleString('es-CO') + ' km');
  set('d-km-fin', kmFin > 0 ? kmFin.toLocaleString('es-CO') + ' km' : '—');
  set('d-km-rec', kmDiff > 0 ? kmDiff + ' km' : '—');
  set('d-estado', buildInspectSummary());
  set('d-fotos', `${taken} de ${total}`);
  set('d-hora', hora);
}

// ── DASHBOARD DATE ────────────────────────────
function updateDashDate() {
  const el = document.getElementById('dash-date');
  if (el) el.textContent = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Render SVG icons into role cards and vtype cards
  renderIcons();
  goTo('s-login');
});

function renderIcons() {
  // Role cards
  const rcColab = document.getElementById('rc-colab-icon');
  const rcSuper = document.getElementById('rc-super-icon');
  if (rcColab) rcColab.innerHTML = ICONS.colaborador;
  if (rcSuper) rcSuper.innerHTML = ICONS.supervisor;

  // Owner cards
  const owPropio = document.getElementById('ow-propio-icon');
  const owEmpresa = document.getElementById('ow-empresa-icon');
  if (owPropio) owPropio.innerHTML = ICONS.colaborador;
  if (owEmpresa) owEmpresa.innerHTML = ICONS.oszford;

  // Main brand icon
  const mainBrandIcon = document.getElementById('main-brand-icon');
  if (mainBrandIcon) mainBrandIcon.innerHTML = ICONS.oszford;

  // Camera in plate
  const plateCam = document.getElementById('plate-cam-icon');
  if (plateCam) plateCam.innerHTML = ICONS.camera;

  // Vehicle type cards
  const vtMap = { moto: 'moto', elec: 'elec', bici: 'bici', pat: 'pat' };
  Object.entries(vtMap).forEach(([key, icon]) => {
    const el = document.getElementById('vt-' + key + '-icon');
    if (el && ICONS[icon]) el.innerHTML = ICONS[icon];
  });
}
