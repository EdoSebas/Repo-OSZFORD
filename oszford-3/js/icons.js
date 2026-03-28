/* js/icons.js
   SVG icons in OSZFORD navy (#0B1E6B) + gold (#F5C01E)
   matching the Gemini-generated image style */

'use strict';

const ICONS = {

  colaborador: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="20" r="11" fill="#0B1E6B"/>
    <path d="M10 54c0-12.15 9.85-22 22-22s22 9.85 22 22" stroke="#0B1E6B" stroke-width="5" stroke-linecap="round"/>
    <path d="M24 20c0 4.4 3.6 8 8 8" stroke="#F5C01E" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  supervisor: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 4 L56 16 L56 36 C56 49 44 58 32 62 C20 58 8 49 8 36 L8 16 Z" fill="#0B1E6B"/>
    <path d="M32 10 L50 20 L50 36 C50 46 42 53 32 57 C22 53 14 46 14 36 L14 20 Z" fill="#F5C01E" opacity=".25"/>
    <circle cx="32" cy="28" r="8" fill="#F5C01E"/>
    <path d="M20 46c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#F5C01E" stroke-width="3" stroke-linecap="round"/>
    <circle cx="44" cy="18" r="5" fill="#F5C01E"/>
    <path d="M41 18h6M44 15v6" stroke="#0B1E6B" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,

  moto: `<svg viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="36" r="10" stroke="#0B1E6B" stroke-width="5" fill="none"/>
    <circle cx="18" cy="36" r="4" fill="#F5C01E"/>
    
    <circle cx="62" cy="36" r="10" stroke="#0B1E6B" stroke-width="5" fill="none"/>
    <circle cx="62" cy="36" r="4" fill="#F5C01E"/>
    
    <path d="M12 28 Q 20 20 32 20 L 40 12 L 48 10 Q 56 16 56 22 L 64 26 L 50 28 L 44 36 L 26 36 Z" fill="#0B1E6B"/>
    <path d="M48 10 Q 54 4 60 12 L 56 22 Z" fill="#0B1E6B"/>
  </svg>`,

  elec: `<svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 38 C 10 10, 70 10, 56 38" stroke="#0B1E6B" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M56 38 L 60 38 L 60 42 L 56 42 Z" fill="#0B1E6B"/>
    <path d="M60 39 L 64 39 M 60 41 L 64 41" stroke="#0B1E6B" stroke-width="1.5"/>
    
    <circle cx="20" cy="46" r="9" stroke="#0B1E6B" stroke-width="5" fill="none"/>
    <circle cx="20" cy="46" r="4" fill="#F5C01E"/>
    <circle cx="60" cy="46" r="9" stroke="#0B1E6B" stroke-width="5" fill="none"/>
    <circle cx="60" cy="46" r="4" fill="#F5C01E"/>
    
    <path d="M14 40 Q 14 28 26 38 L 40 40 L 46 26 L 54 26 L 56 32 L 64 36 L 54 44 L 28 44 Z" fill="#0B1E6B"/>
    <rect x="44" y="24" width="10" height="4" fill="#0B1E6B"/>
    
    <path d="M48 30 L 44 36 L 48 36 L 46 42 L 52 34 L 48 34 Z" fill="#F5C01E"/>
  </svg>`,

  bici: `<svg viewBox="0 0 80 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="36" r="13" fill="none" stroke="#0B1E6B" stroke-width="4"/>
    <circle cx="16" cy="36" r="4"  fill="#F5C01E"/>
    <circle cx="64" cy="36" r="13" fill="none" stroke="#0B1E6B" stroke-width="4"/>
    <circle cx="64" cy="36" r="4"  fill="#F5C01E"/>
    <circle cx="40" cy="32" r="4"  fill="#0B1E6B"/>
    <path d="M16 36 L40 32 L64 36" stroke="#0B1E6B" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M40 32 L34 14" stroke="#0B1E6B" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M34 14 L54 14" stroke="#0B1E6B" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M34 14 L16 36" stroke="#0B1E6B" stroke-width="3" stroke-linecap="round"/>
    <path d="M54 14 L64 36" stroke="#0B1E6B" stroke-width="3" stroke-linecap="round"/>
    <!-- Seat -->
    <path d="M28 11 L40 11" stroke="#F5C01E" stroke-width="5" stroke-linecap="round"/>
    <line x1="34" y1="11" x2="34" y2="18" stroke="#0B1E6B" stroke-width="3" stroke-linecap="round"/>
    <!-- Handlebar -->
    <path d="M50 10 L60 10" stroke="#0B1E6B" stroke-width="4" stroke-linecap="round"/>
    <line x1="54" y1="10" x2="54" y2="16" stroke="#0B1E6B" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  pat: `<svg viewBox="0 0 72 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Rear wheel -->
    <circle cx="14" cy="52" r="10" fill="none" stroke="#0B1E6B" stroke-width="4"/>
    <circle cx="14" cy="52" r="4"  fill="#F5C01E"/>
    <!-- Front wheel (smaller) -->
    <circle cx="58" cy="54" r="8"  fill="none" stroke="#0B1E6B" stroke-width="4"/>
    <circle cx="58" cy="54" r="3"  fill="#F5C01E"/>
    <!-- Deck -->
    <rect x="20" y="38" width="36" height="7" rx="3" fill="#0B1E6B"/>
    <!-- Battery pack -->
    <rect x="24" y="43" width="24" height="6" rx="2" fill="#F5C01E"/>
    <!-- Stem (diagonal) -->
    <line x1="50" y1="38" x2="38" y2="8"  stroke="#0B1E6B" stroke-width="5" stroke-linecap="round"/>
    <!-- Handlebar -->
    <line x1="28" y1="8"  x2="50" y2="8"  stroke="#0B1E6B" stroke-width="6" stroke-linecap="round"/>
    <!-- Grips -->
    <circle cx="28" cy="8"  r="5" fill="#F5C01E"/>
    <circle cx="50" cy="8"  r="5" fill="#F5C01E"/>
    <!-- Rear connection -->
    <line x1="20" y1="41" x2="14" y2="42" stroke="#0B1E6B" stroke-width="4" stroke-linecap="round"/>
    <!-- Front connection -->
    <line x1="56" y1="40" x2="58" y2="46" stroke="#0B1E6B" stroke-width="4" stroke-linecap="round"/>
    <!-- Lightning bolt on battery -->
    <path d="M36 44 L33 47 L36 47 L33 50" stroke="#0B1E6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  camera: `<svg viewBox="0 0 64 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="14" width="56" height="34" rx="6" fill="#0B1E6B"/>
    <path d="M20 14 L24 6 L40 6 L44 14" fill="#0B1E6B"/>
    <circle cx="32" cy="32" r="12" fill="#F5C01E"/>
    <circle cx="32" cy="32" r="7"  fill="#0B1E6B"/>
    <circle cx="32" cy="32" r="3"  fill="#F5C01E"/>
    <circle cx="50" cy="22" r="4"  fill="#F5C01E"/>
    <rect x="8"  y="18" width="8" height="5" rx="2" fill="#F5C01E" opacity=".5"/>
  </svg>`,

  oszford: `<svg viewBox="-20 -20 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Outer circles -->
    <circle cx="50" cy="50" r="46" stroke="#B1B3C0" stroke-width="3" fill="#FFF"/>
    <circle cx="50" cy="50" r="43" stroke="#F5C01E" stroke-width="2"/>
    <circle cx="50" cy="50" r="40" stroke="#F5C01E" stroke-width="3"/>
    
    <!-- 6 Stars -->
    <path d="M30 25 l3 -7 l3 7 l-6 -4 l7 0 -7 4 Z" fill="#0B1E6B"/>
    <path d="M40 16 l3 -7 l3 7 l-6 -4 l7 0 -7 4 Z" fill="#0B1E6B"/>
    <path d="M50 12 l3 -7 l3 7 l-6 -4 l7 0 -7 4 Z" fill="#0B1E6B"/>
    <path d="M60 16 l3 -7 l3 7 l-6 -4 l7 0 -7 4 Z" fill="#0B1E6B"/>
    <path d="M70 25 l3 -7 l3 7 l-6 -4 l7 0 -7 4 Z" fill="#0B1E6B"/>
    
    <!-- Shield -->
    <path d="M44 38 L 56 38 L 56 50 C 56 56 50 60 50 63 C 50 60 44 56 44 50 Z" fill="#F5C01E" stroke="#0B1E6B" stroke-width="1.5"/>
    <path d="M50 43 l2 6 l6 0 l-5 4 l2 6 l-5 -4 l-5 4 l2 -6 l-5 -4 l6 0 Z" fill="#0B1E6B" transform="scale(0.35) translate(92, 85)"/>
    
    <!-- OSZFORD TEXT -->
    <text x="50" y="58" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="#0B1E6B" text-anchor="middle" letter-spacing="1">OSZFORD</text>
    
    <!-- SEGURIDAD ESPECIALIZADA TEXT -->
    <path id="text-arc" d="M 22 62 A 32 32 0 0 0 78 62" fill="none"/>
    <text font-family="Arial, sans-serif" font-weight="bold" font-size="7" fill="#0B1E6B">
      <textPath href="#text-arc" startOffset="50%" text-anchor="middle">SEGURIDAD ESPECIALIZADA</textPath>
    </text>
  </svg>`,

};

// Helper: get icon HTML string
function getIcon(name, size = 48) {
  const svg = ICONS[name];
  if (!svg) return '';
  return `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center">${svg}</div>`;
}
