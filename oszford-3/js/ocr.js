/* js/ocr.js
   Camera handling, photo validation via canvas pixel analysis,
   OCR odometer simulation, and timestamp capture. */

'use strict';

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
const OCR = {
  ini: { done: false, km: 0, stamp: null },
  fin: { done: false, km: 0, stamp: null },
};

// ─────────────────────────────────────────────
// PHOTO VALIDATION via canvas pixel analysis
// Detects solid colors, very dark images, blurry blanks
// ─────────────────────────────────────────────
function validatePhoto(file, expectType) {
  // expectType: 'odometer' | 'plate'
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('El archivo no es una imagen. Debes tomar una foto.'));
    }
    if (file.size < 2000) {
      return reject(new Error('La imagen parece estar vacía o corrupta.'));
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const SAMPLE = 120;
      canvas.width  = SAMPLE;
      canvas.height = SAMPLE;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, SAMPLE, SAMPLE);
      const px = ctx.getImageData(0, 0, SAMPLE, SAMPLE).data;

      let rSum = 0, gSum = 0, bSum = 0;
      const n = px.length / 4;
      for (let i = 0; i < px.length; i += 4) {
        rSum += px[i]; gSum += px[i + 1]; bSum += px[i + 2];
      }
      const rAvg = rSum / n, gAvg = gSum / n, bAvg = bSum / n;
      const brightness = (rAvg + gAvg + bAvg) / 3;

      let variance = 0;
      for (let i = 0; i < px.length; i += 4) {
        variance +=
          Math.pow(px[i]     - rAvg, 2) +
          Math.pow(px[i + 1] - gAvg, 2) +
          Math.pow(px[i + 2] - bAvg, 2);
      }
      variance /= n;

      // Too dark (camera covered or no light)
      if (brightness < 18) {
        return reject(new Error('La imagen está muy oscura. Mejora la iluminación e intenta de nuevo.'));
      }
      // Solid color / blank (variance too low)
      if (variance < 300) {
        return reject(new Error(
          expectType === 'plate'
            ? '❌ No se detectó una placa. Apunta la cámara directamente a la placa del vehículo.'
            : '❌ No se detectó un odómetro. Apunta la cámara al tablero del vehículo.'
        ));
      }

      resolve({ brightness, variance, w: img.naturalWidth, h: img.naturalHeight });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen. Intenta de nuevo.'));
    };

    img.src = url;
  });
}

// ─────────────────────────────────────────────
// FORMAT TIMESTAMP
// ─────────────────────────────────────────────
function formatStamp(date) {
  const pad = n => String(n).padStart(2, '0');
  const d = date;
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}  ` +
         `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// ─────────────────────────────────────────────
// ODOMETER OCR — INICIO TURNO
// ─────────────────────────────────────────────
function triggerOCR() {
  const fileInput = document.getElementById('ocr-file');
  fileInput.value = '';
  fileInput.click();
}

async function processOCR(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const stamp = new Date();

  const zone  = document.getElementById('ocr-zone');
  const ico   = document.getElementById('ocr-ico');
  const lbl   = document.getElementById('ocr-lbl');
  const sub   = document.getElementById('ocr-sub');
  const res   = document.getElementById('ocr-result');
  const err   = document.getElementById('ocr-error');

  // Reset state
  zone.className = 'ocr-zone loading';
  ico.textContent = '🔍';
  lbl.textContent = 'Analizando imagen...';
  sub.textContent = 'Validando odómetro con visión computacional';
  res.classList.remove('show');
  if (err) err.style.display = 'none';

  // Simulate processing delay
  await new Promise(r => setTimeout(r, 1600 + Math.random() * 600));

  try {
    await validatePhoto(file, 'odometer');

    // Simulated OCR reading
    const km = Math.floor(Math.random() * 70000) + 3000;
    const conf = (93 + Math.random() * 6).toFixed(1);
    OCR.ini.done  = true;
    OCR.ini.km    = km;
    OCR.ini.stamp = stamp;

    zone.className = 'ocr-zone done';
    ico.textContent = '✅';
    lbl.textContent = 'Odómetro detectado correctamente';
    sub.textContent = `Confianza: ${conf}% · ${formatStamp(stamp)}`;

    document.getElementById('ocr-val').textContent  = km.toLocaleString('es-CO') + ' km';
    document.getElementById('ocr-conf').textContent = conf + '%';
    res.classList.add('show');

    // Pre-fill the manual input
    const manualInput = document.getElementById('km-val');
    if (manualInput) {
      manualInput.value = km;
      const hint = document.getElementById('km-hint');
      if (hint) {
        hint.textContent = '✅ Pre-llenado por OCR. Edita solo si hay error (±50 km permitido).';
        hint.style.color = 'var(--green)';
      }
    }

    // Show timestamp
    showStamp('ocr-stamp', stamp);

  } catch (e) {
    zone.className = 'ocr-zone error';
    ico.textContent = '❌';
    lbl.textContent = 'Imagen no válida';
    sub.textContent = 'Intenta de nuevo';
    if (err) { err.textContent = e.message; err.style.display = 'flex'; }
    OCR.ini.done = false;
  }
}

// ─────────────────────────────────────────────
// ODOMETER OCR — FIN TURNO
// ─────────────────────────────────────────────
function triggerOCR2() {
  const fi = document.getElementById('ocr2-file');
  fi.value = '';
  fi.click();
}

async function processOCR2(input) {
  if (!input.files || !input.files[0]) return;
  const file  = input.files[0];
  const stamp = new Date();

  const zone = document.getElementById('ocr2-zone');
  const ico  = document.getElementById('ocr2-ico');
  const lbl  = document.getElementById('ocr2-lbl');
  const sub  = document.getElementById('ocr2-sub');
  const res  = document.getElementById('ocr2-result');
  const err  = document.getElementById('ocr2-error');

  zone.className = 'ocr-zone loading';
  ico.textContent = '🔍';
  lbl.textContent = 'Analizando imagen...';
  sub.textContent = 'Procesando odómetro final';
  res.classList.remove('show');
  if (err) err.style.display = 'none';

  await new Promise(r => setTimeout(r, 1600 + Math.random() * 500));

  try {
    await validatePhoto(file, 'odometer');

    const base = OCR.ini.km > 0 ? OCR.ini.km : 28540;
    const km   = base + Math.floor(Math.random() * 150) + 20;
    const conf = (92 + Math.random() * 7).toFixed(1);
    OCR.fin.done  = true;
    OCR.fin.km    = km;
    OCR.fin.stamp = stamp;

    zone.className = 'ocr-zone done';
    ico.textContent = '✅';
    lbl.textContent = 'Km final detectado';
    sub.textContent = `Confianza: ${conf}%`;

    document.getElementById('ocr2-val').textContent   = km.toLocaleString('es-CO') + ' km';
    document.getElementById('ocr2-conf').textContent  = conf + '%';
    document.getElementById('km-diff-lbl').textContent =
      (km - OCR.ini.km) + ' km recorridos en este turno';
    res.classList.add('show');
    showStamp('ocr2-stamp', stamp);

  } catch (e) {
    zone.className = 'ocr-zone error';
    ico.textContent = '❌';
    lbl.textContent = 'Imagen no válida';
    sub.textContent = 'Intenta de nuevo';
    if (err) { err.textContent = e.message; err.style.display = 'flex'; }
    OCR.fin.done = false;
  }
}

// ─────────────────────────────────────────────
// PLATE PHOTO VALIDATION
// ─────────────────────────────────────────────
function triggerPlatePhoto() {
  const fi = document.getElementById('plate-photo-file');
  fi.value = '';
  fi.click();
}

async function processPlatePhoto(input) {
  if (!input.files || !input.files[0]) return;
  const file  = input.files[0];
  const stamp = new Date();

  const statusEl = document.getElementById('plate-photo-status');
  statusEl.className = 'alert alert-info';
  statusEl.textContent = '🔍 Validando imagen de la placa...';
  statusEl.style.display = 'flex';

  await new Promise(r => setTimeout(r, 1400 + Math.random() * 600));

  try {
    await validatePhoto(file, 'plate');

    // Simulate plate OCR reading
    const letters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums     = '0123456789';
    const detectedPlate =
      letters[Math.floor(Math.random()*26)] +
      letters[Math.floor(Math.random()*26)] +
      letters[Math.floor(Math.random()*26)] +
      nums[Math.floor(Math.random()*10)] +
      nums[Math.floor(Math.random()*10)] +
      nums[Math.floor(Math.random()*10)];

    const plateInput = document.getElementById('r-placa');
    if (plateInput && !plateInput.value) {
      plateInput.value = detectedPlate;
      checkPlateDuplicate(detectedPlate);
    }

    statusEl.className = 'alert alert-ok';
    statusEl.innerHTML = `✅ Placa leída: <strong>${detectedPlate}</strong> · ${formatStamp(stamp)}`;
    showStamp('plate-stamp', stamp);

  } catch (e) {
    statusEl.className = 'alert alert-red';
    statusEl.textContent = e.message;
  }
}

// ─────────────────────────────────────────────
// PLATE DUPLICATE CHECK (simulated DB call)
// ─────────────────────────────────────────────
function checkPlateDuplicate(plate) {
  if (plate.length < 5) return;
  const DEMO_TAKEN = ['ABC123', 'XYZ789'];
  const el = document.getElementById('plate-status');
  if (!el) return;

  setTimeout(() => {
    if (DEMO_TAKEN.includes(plate)) {
      el.className = 'alert alert-red';
      el.textContent = `❌ Placa ${plate} ya registrada — propietario existente`;
    } else {
      el.className = 'alert alert-ok';
      el.textContent = `✅ Placa ${plate} disponible — no registrada previamente`;
    }
    el.style.display = 'flex';
  }, 700);
}

// ─────────────────────────────────────────────
// KM VALIDATION (manual input vs OCR)
// ─────────────────────────────────────────────
function validateKm() {
  if (!OCR.ini.done) return;
  const km  = parseInt(document.getElementById('km-val').value || '0');
  const diff = Math.abs(km - OCR.ini.km);
  const errEl = document.getElementById('km-err');
  const field = document.getElementById('km-field');
  if (diff > 50) {
    if (errEl) errEl.style.display = 'block';
    if (field) field.classList.add('has-err');
  } else {
    if (errEl) errEl.style.display = 'none';
    if (field) field.classList.remove('has-err');
  }
}

function submitKm() {
  if (!OCR.ini.done) {
    alert('Debes fotografiar el odómetro para continuar.');
    return;
  }
  const km = parseInt(document.getElementById('km-val').value || '0');
  if (!km || km < 0) { alert('Ingresa el kilometraje inicial.'); return; }
  if (Math.abs(km - OCR.ini.km) > 50) {
    alert(`El valor ingresado (${km} km) no coincide con el OCR (${OCR.ini.km} km). Máx. ±50 km.`);
    return;
  }
  // Store for fin turno
  document.getElementById('fin-km-ini').textContent = km.toLocaleString('es-CO') + ' km';
  goTo("s-done");
}

function submitFin() {
  if (!OCR.fin.done) {
    alert('Fotografía el odómetro al final del turno para continuar.');
    return;
  }
  document.getElementById('fo-ini').textContent  = (OCR.ini.km || 28540).toLocaleString('es-CO') + ' km';
  document.getElementById('fo-fin').textContent  = OCR.fin.km.toLocaleString('es-CO') + ' km';
  document.getElementById('fo-diff').textContent = (OCR.fin.km - OCR.ini.km) + ' km ✓ (GPS validado)';
  goTo("s-done");
}

// ─────────────────────────────────────────────
// SHOW TIMESTAMP BADGE
// ─────────────────────────────────────────────
function showStamp(id, date) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `<span>🕐</span> <span>${formatStamp(date)}</span>`;
  el.style.display = 'flex';
}
