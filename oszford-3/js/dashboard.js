/* js/dashboard.js
   Initializes Chart.js charts for the supervisor dashboard. */

'use strict';

let chartComp = null;
let chartKm   = null;

function initDashCharts() {
  if (chartComp) { chartComp.destroy(); chartComp = null; }
  if (chartKm)   { chartKm.destroy();   chartKm   = null; }

  const dark      = window.matchMedia('(prefers-color-scheme:dark)').matches;
  const gridColor = dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)';
  const textColor = dark ? '#9CA3AF' : '#6B7280';

  Chart.defaults.font.family = "'Barlow', sans-serif";
  Chart.defaults.font.size   = 12;

  // ── Compliance 7-day trend ──────────────────
  const ctx1 = document.getElementById('compChart');
  if (ctx1) {
    chartComp = new Chart(ctx1.getContext('2d'), {
      type: 'line',
      data: {
        labels:   ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Hoy'],
        datasets: [{
          label: 'Cumplimiento %',
          data:  [88, 72, 91, 68, 85, 94, 76],
          borderColor: '#0B1E6B', fill: true,
          backgroundColor: 'rgba(11,30,107,.07)',
          pointBackgroundColor: '#F5C01E', pointBorderColor: '#0B1E6B',
          pointRadius: 5, pointHoverRadius: 7,
          tension: .4, borderWidth: 2.5
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#0B1E6B', titleColor: '#F5C01E', bodyColor: '#fff', cornerRadius: 8 }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: { min: 50, max: 100, grid: { color: gridColor }, ticks: { color: textColor, callback: v => v + '%' } }
        }
      }
    });
  }

  // ── Km per vehicle (today) ──────────────────
  const ctx2 = document.getElementById('kmChart');
  if (ctx2) {
    chartKm = new Chart(ctx2.getContext('2d'), {
      type: 'bar',
      data: {
        labels:   ['EKT29F', 'XYZ789', 'DEF456', 'GHI012', 'JKL345'],
        datasets: [{
          label: 'Km hoy',
          data:  [142, 98, 215, 0, 87],
          backgroundColor: ['#16A34A', '#16A34A', '#D97706', '#DC2626', '#16A34A'],
          borderRadius: 6, borderSkipped: false
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#0B1E6B', titleColor: '#F5C01E', bodyColor: '#fff', cornerRadius: 8 }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, callback: v => v + ' km' } }
        }
      }
    });
  }
}
