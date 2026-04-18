// Data module — loads budget.json and exposes helpers
// Usage: include before components.jsx and wait for window.__budgetReady promise

window.__budgetReady = (async () => {
  const res = await fetch('data/budget.json');
  const data = await res.json();

  const MONTH_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

  // Clean + augment months
  for (const m of data.months) {
    m.label = `${MONTH_FR[m.month-1]} ${m.year}`;
    m.shortLabel = `${MONTH_FR[m.month-1].slice(0,3)}. ${String(m.year).slice(-2)}`;
    m.monthKey = `${m.year}-${String(m.month).padStart(2,'0')}`;
    // combined transactions for display
    m.allTx = [
      ...m.depFixes.map(d => ({...d, type:'fixe', date: normalizeFixDate(d, m)})),
      ...m.depVar.map(d => ({...d, type:'var', date: normalizeVarDate(d.date, m)})),
    ].sort((a,b) => (b.date||'').localeCompare(a.date||''));
    m.allGains = m.gains.map(g => ({...g, date: normalizeVarDate(g.date, m)}));
  }

  function normalizeFixDate(d, m) {
    // day is 1-31 number
    if (typeof d.day === 'number' && d.day >= 1 && d.day <= 31) {
      return `${m.year}-${String(m.month).padStart(2,'0')}-${String(d.day).padStart(2,'0')}`;
    }
    return `${m.year}-${String(m.month).padStart(2,'0')}-01`;
  }
  function normalizeVarDate(d, m) {
    if (!d) return `${m.year}-${String(m.month).padStart(2,'0')}-01`;
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    return `${m.year}-${String(m.month).padStart(2,'0')}-01`;
  }

  window.BUDGET = data;
  window.MONTH_FR = MONTH_FR;

  // Helpers
  window.fmtEur = (n, {signed=false}={}) => {
    if (n === undefined || n === null || isNaN(n)) return '—';
    const sign = signed && n > 0 ? '+' : '';
    const abs = Math.abs(n);
    const str = abs >= 1000 ? abs.toLocaleString('fr-FR', {minimumFractionDigits:0, maximumFractionDigits:0}) :
      abs.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2});
    return `${n<0?'−':sign}${str} €`;
  };
  window.fmtEurCompact = (n) => {
    if (n === undefined || n === null || isNaN(n)) return '—';
    const abs = Math.abs(n);
    if (abs >= 1000) return `${n<0?'−':''}${Math.round(abs/100)/10}k€`;
    return `${n<0?'−':''}${Math.round(abs)}€`;
  };

  // Category colors — OKLCH harmonic (same C+L, varied H)
  window.CAT_COLORS = {
    'Logement':      'oklch(68% 0.12 30)',
    'Virements':     'oklch(68% 0.12 80)',
    'Courses':       'oklch(68% 0.12 130)',
    'Resto & Café':  'oklch(68% 0.12 180)',
    'Transport':     'oklch(68% 0.12 230)',
    'Abonnements':   'oklch(68% 0.12 280)',
    'Loisirs':       'oklch(68% 0.12 320)',
    'Santé & Beauté':'oklch(68% 0.12 350)',
    'Vêtements':     'oklch(68% 0.12 10)',
    'Assurances':    'oklch(68% 0.12 60)',
    'Frais':         'oklch(68% 0.12 110)',
    'Enfants':       'oklch(68% 0.12 260)',
    'Autre':         'oklch(68% 0.04 250)',
  };

  window.CAT_ORDER = ['Logement','Courses','Resto & Café','Transport','Abonnements','Loisirs','Santé & Beauté','Vêtements','Assurances','Frais','Enfants','Virements','Autre'];

  // Current month = last chronologically
  window.CURRENT_MONTH = data.months[data.months.length - 1];

  return data;
})();
