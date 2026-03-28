/* js/inspection.js — v2.1
   Inspection logic + photo capture per part */

'use strict';

let inspectStates = [];
const partPhotos  = {}; // { idx: { stamp, file } }

// ─── INIT ─────────────────────────────────────
function initInspection(vehicleKey) {
  const parts = VEHICLES[vehicleKey]?.parts || [];
  inspectStates = new Array(parts.length).fill(0);
  // Reset photos
  Object.keys(partPhotos).forEach(k => delete partPhotos[k]);
  renderVehicleSVG(vehicleKey);
  renderChecklist(vehicleKey);
  checkWarnings();
}

// ─── CYCLE HOTSPOT ────────────────────────────
function cycleHS(idx) {
  inspectStates[idx] = (inspectStates[idx] + 1) % 4;
  updateHotspotVisual(idx);
  renderChecklist(APP.currentVehicle);
  scrollToCheckItem(idx);
  checkWarnings();
}

// ─── SET STATUS FROM CHECKLIST ────────────────
function setStatus(idx, val) {
  inspectStates[idx] = inspectStates[idx] === val ? 0 : val;
  updateHotspotVisual(idx);
  renderChecklist(APP.currentVehicle);
  checkWarnings();
}

// ─── UPDATE SVG HOTSPOT VISUAL ────────────────
function updateHotspotVisual(idx) {
  const hs = document.getElementById('hs' + idx);
  if (!hs) return;
  const s     = inspectStates[idx];
  const outer = hs.querySelector('.hs-outer');
  const txt   = hs.querySelector('.hs-txt');
  outer.className.baseVal = 'hs-outer' + (s > 0 ? ' s' + s : '');
  txt.setAttribute('fill', s > 0 ? '#ffffff' : '#8892B0');
}

// ─── RENDER CHECKLIST + PHOTO BUTTONS ─────────
function renderChecklist(vehicleKey) {
  const parts = VEHICLES[vehicleKey]?.parts || [];
  const list  = document.getElementById('check-list');
  if (!list) return;

  list.innerHTML = parts.map((p, i) => {
    const s       = inspectStates[i];
    const cls     = s > 0 ? 's' + s : '';
    const photo   = partPhotos[i];
    const photoBtnCls  = photo ? 'photo-btn taken' : 'photo-btn';
    const photoBtnTxt  = photo ? '✓ Foto tomada' : '📷 Tomar foto';
    const stampHtml    = photo
      ? `<div class="photo-stamp-sm">🕐 ${photo.stamp}</div>`
      : '';

    return `
    <div class="check-item ${cls}" id="ci${i}">
      <div class="check-num">${i + 1}</div>
      <div class="check-body">
        <div class="check-name">${p.name}</div>
        <div class="check-cat">${p.cat}</div>

        <!-- Estado: verde / amarillo / rojo -->
        <div class="sbtn-group">
          <button class="sbtn g ${s === 1 ? 'act' : ''}" onclick="setStatus(${i},1)" title="Bueno"></button>
          <button class="sbtn a ${s === 2 ? 'act' : ''}" onclick="setStatus(${i},2)" title="Deteriorado"></button>
          <button class="sbtn r ${s === 3 ? 'act' : ''}" onclick="setStatus(${i},3)" title="Malo"></button>
        </div>

        <!-- Foto del parte -->
        <div class="check-photo-area">
          <input type="file" id="pf${i}" accept="image/*" capture="environment"
            onchange="handlePartPhoto(${i}, this)" style="display:none"/>
          <button class="${photoBtnCls}" onclick="document.getElementById('pf${i}').click()">
            ${photoBtnTxt}
          </button>
          ${stampHtml}
        </div>
      </div>
    </div>`;
  }).join('');
}

// ─── HANDLE PHOTO FOR A PART ──────────────────
async function handlePartPhoto(idx, input) {
  if (!input.files || !input.files[0]) return;
  const file  = input.files[0];
  const stamp = formatStamp(new Date());

  // Basic validation
  if (!file.type.startsWith('image/')) {
    alert('El archivo no es una imagen válida.');
    return;
  }
  if (file.size < 1500) {
    alert('La imagen parece estar vacía. Intenta de nuevo.');
    return;
  }

  // Store photo reference
  partPhotos[idx] = { stamp, name: file.name };

  // Re-render to show "Foto tomada" state
  renderChecklist(APP.currentVehicle);
}

// ─── SCROLL HELPER ────────────────────────────
function scrollToCheckItem(idx) {
  const el = document.getElementById('ci' + idx);
  if (!el) return;
  el.classList.add('hl');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => el.classList.remove('hl'), 900);
}

// ─── WARNINGS ────────────────────────────────
function checkWarnings() {
  const reds    = inspectStates.filter(s => s === 3).length;
  const checked = inspectStates.filter(s => s > 0).length;
  const total   = inspectStates.length;
  const warnEl  = document.getElementById('inspect-warn');
  const okEl    = document.getElementById('inspect-ok');
  if (warnEl) warnEl.style.display = reds > 0 ? 'flex' : 'none';
  if (okEl)   okEl.style.display   = (checked === total && reds === 0) ? 'flex' : 'none';
}

// ─── SUBMIT ───────────────────────────────────
async function submitInspect() {
  const checked = inspectStates.filter(s => s > 0).length;
  const total   = inspectStates.length;
  
  if (checked < total) {
    if (!confirm(`Faltan ${total - checked} elemento(s) por evaluar. ¿Continuar de todos modos?`)) return;
  }
  
  try {
    await API.completePreoperacional(SESSION.preoperacional_id);
    goTo('s-km');
  } catch (err) {
    alert('Error completando inspección: ' + err.message);
  }
}

// ─── SUMMARY ─────────────────────────────────
function buildInspectSummary() {
  const reds = inspectStates.filter(s => s === 3).length;
  const yels = inspectStates.filter(s => s === 2).length;
  if (reds > 0) return `⚠️ ${reds} falla(s) crítica(s) — supervisor notificado`;
  if (yels > 0) return `🟡 ${yels} elemento(s) deteriorado(s)`;
  return '✅ Todo en buen estado';
}
