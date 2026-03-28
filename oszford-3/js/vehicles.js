/* js/vehicles.js
   SVG diagrams + inspection parts per vehicle type.
   IMPORTANT: hotspots use absolute cx/cy (NO transform="" on <g>)
   so that CSS hover scale works correctly via transform-box:fill-box */

'use strict';

// ─────────────────────────────────────────────
// Helper: render hotspot circles at absolute coords
// ─────────────────────────────────────────────
function buildHotspots(parts) {
  return parts.map((p, i) => `
    <g class="hotspot" id="hs${i}" onclick="cycleHS(${i})">
      <circle class="hs-bg"    cx="${p.cx}" cy="${p.cy}" r="20"/>
      <circle class="hs-outer" cx="${p.cx}" cy="${p.cy}" r="15"/>
      <text   class="hs-txt"   x="${p.cx}"  y="${p.cy}">${i + 1}</text>
    </g>`).join('');
}

// ─────────────────────────────────────────────
// VEHICLE DEFINITIONS
// ─────────────────────────────────────────────
const VEHICLES = {

  /* ══ MOTOCICLETA ══════════════════════════ */
  moto: {
    label: 'Motocicleta',
    parts: [
      { id: 0, name: 'Rueda delantera', cat: 'Ruedas',  cx: 415, cy: 195 },
      { id: 1, name: 'Rueda trasera',   cat: 'Ruedas',  cx: 93,  cy: 195 },
      { id: 2, name: 'Luces',           cat: 'Luces',   cx: 442, cy: 158 },
      { id: 3, name: 'Espejos',         cat: 'Espejos', cx: 352, cy:  98 },
    ],
    getSVG() {
      const body = `
        <!-- Rear wheel -->
        <circle cx="93"  cy="178" r="57" fill="none" stroke="#D1D5E8" stroke-width="10"/>
        <circle cx="93"  cy="178" r="8"  fill="#D1D5E8"/>
        <line x1="93"  y1="121" x2="93"  y2="235" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="36"  y1="178" x2="150" y2="178" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="52"  y1="138" x2="134" y2="218" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <line x1="134" y1="138" x2="52"  y2="218" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <!-- Front wheel -->
        <circle cx="415" cy="178" r="57" fill="none" stroke="#D1D5E8" stroke-width="10"/>
        <circle cx="415" cy="178" r="8"  fill="#D1D5E8"/>
        <line x1="415" y1="121" x2="415" y2="235" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="358" y1="178" x2="472" y2="178" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="374" y1="138" x2="456" y2="218" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <line x1="456" y1="138" x2="374" y2="218" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <!-- Frame -->
        <path d="M143,174 L179,150 L296,130 L369,142 L391,165" fill="none" stroke="#C8CCE0" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M93,178 L143,174"  fill="none" stroke="#C8CCE0" stroke-width="6" stroke-linecap="round"/>
        <path d="M179,150 L161,128 Q211,114 269,118 L296,130" fill="none" stroke="#C8CCE0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Seat -->
        <path d="M155,126 Q216,110 273,117" stroke="#C8CCE0" stroke-width="10" stroke-linecap="round" fill="none"/>
        <!-- Tank -->
        <rect x="249" y="112" width="76" height="40" rx="12" fill="#DDE0EE" stroke="#C8CCE0" stroke-width="1.5"/>
        <!-- Engine -->
        <rect x="175" y="150" width="118" height="64" rx="9" fill="#E8EAF5" stroke="#C8CCE0" stroke-width="1.5"/>
        <text x="234" y="186" text-anchor="middle" font-size="8" fill="#8892B0" font-family="Barlow,sans-serif" font-weight="700" letter-spacing="1">MOTOR</text>
        <!-- Front fork -->
        <line x1="369" y1="142" x2="401" y2="168" stroke="#C8CCE0" stroke-width="7" stroke-linecap="round"/>
        <line x1="381" y1="142" x2="413" y2="168" stroke="#C8CCE0" stroke-width="5" stroke-linecap="round"/>
        <!-- Handlebar -->
        <line x1="369" y1="142" x2="355" y2="110" stroke="#C8CCE0" stroke-width="7" stroke-linecap="round"/>
        <line x1="338" y1="110" x2="368" y2="110" stroke="#C8CCE0" stroke-width="7" stroke-linecap="round"/>
        <!-- Headlight -->
        <ellipse cx="432" cy="158" rx="20" ry="16" fill="#E8EAF5" stroke="#C8CCE0" stroke-width="2"/>
        <!-- Rear light -->
        <rect x="48" y="148" width="18" height="10" rx="3" fill="#E8EAF5" stroke="#C8CCE0" stroke-width="1.5"/>
        <!-- Mirrors -->
        <rect x="335" y="97"  width="24" height="9" rx="3" fill="#E8EAF5" stroke="#C8CCE0" stroke-width="1.5"/>
        <rect x="362" y="97"  width="24" height="9" rx="3" fill="#E8EAF5" stroke="#C8CCE0" stroke-width="1.5"/>`;
      return body + buildHotspots(this.parts);
    }
  },

  /* ══ MOTO ELÉCTRICA ═══════════════════════ */
  elec: {
    label: 'Moto eléctrica',
    parts: [
      { id: 0, name: 'Rueda delantera', cat: 'Ruedas',  cx: 415, cy: 195 },
      { id: 1, name: 'Rueda trasera',   cat: 'Ruedas',  cx: 93,  cy: 195 },
      { id: 2, name: 'Luces',           cat: 'Luces',   cx: 442, cy: 158 },
      { id: 3, name: 'Batería',         cat: 'Batería', cx: 287, cy: 130 },
    ],
    getSVG() {
      const body = `
        <!-- Rear wheel -->
        <circle cx="93"  cy="178" r="57" fill="none" stroke="#D1D5E8" stroke-width="10"/>
        <circle cx="93"  cy="178" r="8"  fill="#D1D5E8"/>
        <line x1="93"  y1="121" x2="93"  y2="235" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="36"  y1="178" x2="150" y2="178" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="52"  y1="138" x2="134" y2="218" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <line x1="134" y1="138" x2="52"  y2="218" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <!-- Front wheel -->
        <circle cx="415" cy="178" r="57" fill="none" stroke="#D1D5E8" stroke-width="10"/>
        <circle cx="415" cy="178" r="8"  fill="#D1D5E8"/>
        <line x1="415" y1="121" x2="415" y2="235" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="358" y1="178" x2="472" y2="178" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="374" y1="138" x2="456" y2="218" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <line x1="456" y1="138" x2="374" y2="218" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <!-- Frame -->
        <path d="M143,174 L179,150 L296,130 L369,142 L391,165" fill="none" stroke="#C8CCE0" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M93,178 L143,174"  fill="none" stroke="#C8CCE0" stroke-width="6" stroke-linecap="round"/>
        <path d="M179,150 L161,128 Q211,114 269,118 L296,130" fill="none" stroke="#C8CCE0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Seat -->
        <path d="M155,126 Q216,110 273,117" stroke="#C8CCE0" stroke-width="10" stroke-linecap="round" fill="none"/>
        <!-- Battery pack (instead of fuel tank) -->
        <rect x="242" y="110" width="92" height="44" rx="12" fill="#DDE0EE" stroke="#C8CCE0" stroke-width="1.5"/>
        <text x="288" y="133" text-anchor="middle" font-size="14" fill="#8892B0" font-family="Barlow,sans-serif" font-weight="700">⚡</text>
        <!-- Motor eléctrico -->
        <rect x="175" y="150" width="118" height="64" rx="9" fill="#E8EAF5" stroke="#C8CCE0" stroke-width="1.5"/>
        <text x="234" y="186" text-anchor="middle" font-size="8" fill="#8892B0" font-family="Barlow,sans-serif" font-weight="700" letter-spacing="1">ELEC</text>
        <!-- Front fork -->
        <line x1="369" y1="142" x2="401" y2="168" stroke="#C8CCE0" stroke-width="7" stroke-linecap="round"/>
        <line x1="381" y1="142" x2="413" y2="168" stroke="#C8CCE0" stroke-width="5" stroke-linecap="round"/>
        <!-- Handlebar -->
        <line x1="369" y1="142" x2="355" y2="110" stroke="#C8CCE0" stroke-width="7" stroke-linecap="round"/>
        <line x1="338" y1="110" x2="368" y2="110" stroke="#C8CCE0" stroke-width="7" stroke-linecap="round"/>
        <!-- Headlight -->
        <ellipse cx="432" cy="158" rx="20" ry="16" fill="#E8EAF5" stroke="#C8CCE0" stroke-width="2"/>
        <!-- Rear light -->
        <rect x="48" y="148" width="18" height="10" rx="3" fill="#E8EAF5" stroke="#C8CCE0" stroke-width="1.5"/>`;
      return body + buildHotspots(this.parts);
    }
  },

  /* ══ BICICLETA ════════════════════════════ */
  bici: {
    label: 'Bicicleta',
    parts: [
      { id: 0, name: 'Rueda delantera', cat: 'Ruedas', cx: 392, cy: 192 },
      { id: 1, name: 'Rueda trasera',   cat: 'Ruedas', cx: 118, cy: 192 },
      { id: 2, name: 'Frenos',          cat: 'Frenos', cx: 362, cy: 112 },
      { id: 3, name: 'Luces',           cat: 'Luces',  cx: 412, cy: 158 },
    ],
    getSVG() {
      const body = `
        <!-- Rear wheel -->
        <circle cx="118" cy="178" r="60" fill="none" stroke="#D1D5E8" stroke-width="9"/>
        <circle cx="118" cy="178" r="8"  fill="#D1D5E8"/>
        <line x1="118" y1="118" x2="118" y2="238" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="58"  y1="178" x2="178" y2="178" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="76"  y1="136" x2="160" y2="220" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <line x1="160" y1="136" x2="76"  y2="220" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <!-- Front wheel -->
        <circle cx="392" cy="178" r="60" fill="none" stroke="#D1D5E8" stroke-width="9"/>
        <circle cx="392" cy="178" r="8"  fill="#D1D5E8"/>
        <line x1="392" y1="118" x2="392" y2="238" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="332" y1="178" x2="452" y2="178" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="350" y1="136" x2="434" y2="220" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <line x1="434" y1="136" x2="350" y2="220" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <!-- Bottom bracket -->
        <circle cx="244" cy="196" r="9" fill="#E8EAF5" stroke="#C8CCE0" stroke-width="2"/>
        <!-- Chain stay -->
        <path d="M118,178 L244,196" fill="none" stroke="#C8CCE0" stroke-width="6" stroke-linecap="round"/>
        <!-- Seat stays -->
        <path d="M118,178 L226,110" fill="none" stroke="#C8CCE0" stroke-width="5" stroke-linecap="round"/>
        <!-- Seat tube -->
        <path d="M226,110 L244,196" fill="none" stroke="#C8CCE0" stroke-width="7" stroke-linecap="round"/>
        <!-- Top tube -->
        <path d="M226,110 L358,106" fill="none" stroke="#C8CCE0" stroke-width="6" stroke-linecap="round"/>
        <!-- Down tube -->
        <path d="M244,196 L358,106" fill="none" stroke="#C8CCE0" stroke-width="6" stroke-linecap="round"/>
        <!-- Head tube -->
        <path d="M358,106 L366,132" fill="none" stroke="#C8CCE0" stroke-width="9" stroke-linecap="round"/>
        <!-- Fork -->
        <path d="M366,132 L392,178" fill="none" stroke="#C8CCE0" stroke-width="6" stroke-linecap="round"/>
        <!-- Seat horizontal -->
        <path d="M202,108 L254,108" fill="none" stroke="#C8CCE0" stroke-width="12" stroke-linecap="round"/>
        <!-- Handlebar (flat) -->
        <path d="M344,101 L380,101" fill="none" stroke="#C8CCE0" stroke-width="8" stroke-linecap="round"/>
        <!-- Brake levers (small lines down from handlebar ends) -->
        <path d="M348,101 L345,116" fill="none" stroke="#C8CCE0" stroke-width="3" stroke-linecap="round"/>
        <path d="M376,101 L373,116" fill="none" stroke="#C8CCE0" stroke-width="3" stroke-linecap="round"/>
        <!-- Pedal cranks -->
        <line x1="244" y1="196" x2="222" y2="213" stroke="#C8CCE0" stroke-width="5" stroke-linecap="round"/>
        <line x1="244" y1="196" x2="266" y2="179" stroke="#C8CCE0" stroke-width="5" stroke-linecap="round"/>
        <rect x="213" y="210" width="18" height="7" rx="3" fill="#D1D5E8"/>
        <rect x="257" y="175" width="18" height="7" rx="3" fill="#D1D5E8"/>
        <!-- Front light (small circle) -->
        <circle cx="412" cy="158" r="9" fill="#E8EAF5" stroke="#C8CCE0" stroke-width="1.5"/>`;
      return body + buildHotspots(this.parts);
    }
  },

  /* ══ PATINETA ELÉCTRICA ═══════════════════ */
  pat: {
    label: 'Patineta eléctrica',
    parts: [
      { id: 0, name: 'Rueda delantera', cat: 'Ruedas',  cx: 418, cy: 205 },
      { id: 1, name: 'Rueda trasera',   cat: 'Ruedas',  cx: 90,  cy: 205 },
      { id: 2, name: 'Frenos',          cat: 'Frenos',  cx: 344, cy:  64 },
      { id: 3, name: 'Batería',         cat: 'Batería', cx: 242, cy: 196 },
    ],
    getSVG() {
      const body = `
        <!-- Rear wheel (bigger) -->
        <circle cx="90"  cy="192" r="42" fill="none" stroke="#D1D5E8" stroke-width="9"/>
        <circle cx="90"  cy="192" r="7"  fill="#D1D5E8"/>
        <line x1="90"  y1="150" x2="90"  y2="234" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="48"  y1="192" x2="132" y2="192" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="60"  y1="162" x2="120" y2="222" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <line x1="120" y1="162" x2="60"  y2="222" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <!-- Front wheel (smaller) -->
        <circle cx="418" cy="200" r="35" fill="none" stroke="#D1D5E8" stroke-width="9"/>
        <circle cx="418" cy="200" r="6"  fill="#D1D5E8"/>
        <line x1="418" y1="165" x2="418" y2="235" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="383" y1="200" x2="453" y2="200" stroke="#D1D5E8" stroke-width="1.5" opacity=".5"/>
        <line x1="393" y1="173" x2="443" y2="227" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <line x1="443" y1="173" x2="393" y2="227" stroke="#D1D5E8" stroke-width="1.5" opacity=".35"/>
        <!-- Main deck (standing platform) -->
        <rect x="128" y="168" width="272" height="20" rx="6" fill="#E8EAF5" stroke="#C8CCE0" stroke-width="1.5"/>
        <!-- Battery under deck -->
        <rect x="152" y="186" width="182" height="22" rx="5" fill="#DDE0EE" stroke="#C8CCE0" stroke-width="1.5"/>
        <text x="243" y="200" text-anchor="middle" font-size="8" fill="#8892B0" font-family="Barlow,sans-serif" font-weight="700" letter-spacing="1">BATERÍA</text>
        <!-- Rear connection -->
        <path d="M128,178 L90,192"  fill="none" stroke="#C8CCE0" stroke-width="7" stroke-linecap="round"/>
        <!-- Front connection -->
        <path d="M400,168 L418,165" fill="none" stroke="#C8CCE0" stroke-width="7" stroke-linecap="round"/>
        <!-- Steering stem (diagonal) -->
        <path d="M392,168 L344,58"  fill="none" stroke="#C8CCE0" stroke-width="8" stroke-linecap="round"/>
        <!-- Handlebar (horizontal) -->
        <line x1="318" y1="58" x2="372" y2="58" stroke="#C8CCE0" stroke-width="8" stroke-linecap="round"/>
        <!-- Grips -->
        <circle cx="318" cy="58" r="7" fill="#DDE0EE" stroke="#C8CCE0" stroke-width="1.5"/>
        <circle cx="372" cy="58" r="7" fill="#DDE0EE" stroke="#C8CCE0" stroke-width="1.5"/>
        <!-- Brake lever -->
        <path d="M344,59 L340,80" fill="none" stroke="#C8CCE0" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Fender front -->
        <path d="M400,168 Q420,162 418,165" fill="none" stroke="#C8CCE0" stroke-width="4" stroke-linecap="round"/>
        <!-- Fender rear -->
        <path d="M128,178 Q94,152 90,150" fill="none" stroke="#C8CCE0" stroke-width="4" stroke-linecap="round"/>`;
      return body + buildHotspots(this.parts);
    }
  }
};

// ─────────────────────────────────────────────
// Render selected vehicle into the SVG container
// ─────────────────────────────────────────────
function renderVehicleSVG(typeKey) {
  const v = VEHICLES[typeKey];
  if (!v) return;
  const container = document.getElementById('vehicle-svg');
  if (!container) return;
  container.innerHTML = v.getSVG();
}
