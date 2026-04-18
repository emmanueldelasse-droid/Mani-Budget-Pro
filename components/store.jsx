// store.jsx — Persistence layer avec sync Cloudflare KV
// localStorage = cache local rapide
// Cloudflare KV = source de vérité cloud

window.__storeReady = (async () => {
  await window.__budgetReady;

  const LOCAL_KEY = 'mi:store:v1';
  const WORKER_URL = window.MI_WORKER_URL; // injecté depuis app.jsx
  const getToken = () => localStorage.getItem('mi:token') || '';

  // ── Helpers localStorage ──────────────────────────────────────
  const loadLocal = () => {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {}; }
    catch { return {}; }
  };
  const saveLocal = (s) => localStorage.setItem(LOCAL_KEY, JSON.stringify(s));

  // ── Helpers Cloudflare KV ─────────────────────────────────────
  const cloudLoad = async () => {
    try {
      const r = await fetch(`${WORKER_URL}/budget`, {
        headers: { 'X-Budget-Token': getToken() },
      });
      if (!r.ok) return null;
      return await r.json();
    } catch { return null; }
  };

  const cloudSave = async (s) => {
    try {
      await fetch(`${WORKER_URL}/budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Budget-Token': getToken(),
        },
        body: JSON.stringify(s),
      });
    } catch (e) {
      console.warn('[mi] Cloud save failed:', e.message);
    }
  };

  // ── Init : charge depuis le cloud, fallback localStorage ──────
  let remoteData = await cloudLoad();
  let state = remoteData || loadLocal();

  state.addedTx       = state.addedTx       || [];
  state.addedGains    = state.addedGains    || [];
  state.transfers     = state.transfers     || [];
  state.newMonths     = state.newMonths     || [];
  state.goals         = state.goals         || null;
  state.compteBEntries = state.compteBEntries || [];
  saveLocal(state);

  // ── Sync : sauvegarde locale ET cloud ────────────────────────
  const sub = new Set();
  const notify = () => sub.forEach(fn => fn());

  const save = (s) => {
    saveLocal(s);
    cloudSave(s); // async, pas de await — on ne bloque pas l'UI
  };

  // ── Store API (identique à l'original) ───────────────────────
  const store = {
    get: () => state,
    subscribe: (fn) => { sub.add(fn); return () => sub.delete(fn); },

    // Sync manuel (ex: depuis un autre appareil)
    syncFromCloud: async () => {
      const remote = await cloudLoad();
      if (remote) {
        state = remote;
        saveLocal(state);
        notify();
        return true;
      }
      return false;
    },

    getMonths: () => {
      const st = window.BUDGET.months;
      const combined = [...st];
      for (const nm of state.newMonths) {
        const key = `${nm.year}-${String(nm.month).padStart(2,'0')}`;
        if (!combined.find(m => m.monthKey === key)) {
          combined.push(buildMonth(nm));
        }
      }
      combined.sort((a,b) => a.year*12+a.month - (b.year*12+b.month));
      return combined.map(m => {
        const extraTx    = state.addedTx.filter(t => t.monthKey === m.monthKey);
        const extraGains = state.addedGains.filter(g => g.monthKey === m.monthKey);
        const newDepFixes = [...m.depFixes, ...extraTx.filter(t => t.type === 'fixe').map(t => ({day: t.day, detail: t.detail, amount: t.amount, category: t.category}))];
        const newDepVar   = [...m.depVar, ...extraTx.filter(t => t.type === 'var').map(t => ({date: t.date, detail: t.detail, amount: t.amount, category: t.category}))];
        const newGains    = [...m.gains, ...extraGains.map(g => ({date: g.date, detail: g.detail, amount: g.amount}))];
        const allTx = [
          ...newDepFixes.map(d => ({...d, type:'fixe', date: normalizeFixDate(d, m)})),
          ...newDepVar.map(d => ({...d, type:'var', date: d.date || `${m.monthKey}-01`})),
        ].sort((a,b) => (b.date||'').localeCompare(a.date||''));
        return { ...m, depFixes: newDepFixes, depVar: newDepVar, gains: newGains, allTx };
      });
    },

    getCurrentMonth: () => {
      const ms = store.getMonths();
      return ms[ms.length - 1];
    },

    getSummary: (monthKey) => {
      const m = store.getMonths().find(x => x.monthKey === monthKey);
      if (!m) return null;
      const totalGains = m.gains.reduce((a,b) => a + (b.amount||0), 0);
      const totalFixes = m.depFixes.reduce((a,b) => a + (b.amount||0), 0);
      const totalVar   = m.depVar.reduce((a,b) => a + (b.amount||0), 0);
      const byCategory = {};
      [...m.depFixes, ...m.depVar].forEach(d => {
        const c = d.category || 'Autre';
        byCategory[c] = (byCategory[c]||0) + (d.amount||0);
      });
      return {
        year: m.year, month: m.month,
        totalGains: +totalGains.toFixed(2),
        totalFixes: +totalFixes.toFixed(2),
        totalVar:   +totalVar.toFixed(2),
        reste: +(totalGains - totalFixes - totalVar).toFixed(2),
        byCategory: Object.fromEntries(Object.entries(byCategory).map(([k,v]) => [k, +v.toFixed(2)])),
      };
    },

    addTx: (tx) => {
      state.addedTx.push({ id: Date.now()+Math.random(), ...tx });
      save(state); notify();
    },
    addGain: (g) => {
      state.addedGains.push({ id: Date.now()+Math.random(), ...g });
      save(state); notify();
    },
    addTransfer: (t) => {
      state.transfers.push({ id: Date.now()+Math.random(), ...t });
      save(state); notify();
    },
    createMonth: (year, month, dupFromKey) => {
      const existing = store.getMonths().find(m => m.year===year && m.month===month);
      if (existing) return existing.monthKey;
      let fixes = [];
      if (dupFromKey) {
        const src = store.getMonths().find(m => m.monthKey === dupFromKey);
        if (src) fixes = src.depFixes.map(f => ({...f}));
      }
      state.newMonths.push({ year, month, salaire: 0, depFixes: fixes });
      save(state); notify();
      return `${year}-${String(month).padStart(2,'0')}`;
    },
    deleteAdded: (id) => {
      state.addedTx    = state.addedTx.filter(t => t.id !== id);
      state.addedGains = state.addedGains.filter(g => g.id !== id);
      save(state); notify();
    },
    reset: () => {
      state = { addedTx:[], addedGains:[], transfers:[], newMonths:[], goals:null, compteBEntries:[] };
      save(state); notify();
    },
  };

  function normalizeFixDate(d, m) {
    if (typeof d.day === 'number' && d.day >= 1 && d.day <= 31) {
      return `${m.year}-${String(m.month).padStart(2,'0')}-${String(d.day).padStart(2,'0')}`;
    }
    return `${m.year}-${String(m.month).padStart(2,'0')}-01`;
  }

  function buildMonth(nm) {
    const MF = window.MONTH_FR;
    return {
      year: nm.year, month: nm.month,
      label: `${MF[nm.month-1]} ${nm.year}`,
      shortLabel: `${MF[nm.month-1].slice(0,3)}. ${String(nm.year).slice(-2)}`,
      monthKey: `${nm.year}-${String(nm.month).padStart(2,'0')}`,
      salaire: nm.salaire || 0,
      fixes: nm.depFixes.reduce((a,b) => a+(b.amount||0), 0),
      variables: 0,
      reste: (nm.salaire||0) - nm.depFixes.reduce((a,b) => a+(b.amount||0), 0),
      gains: [], depFixes: nm.depFixes || [], depVar: [], allTx: [], allGains: [],
      userCreated: true,
    };
  }

  window.STORE = store;
  return store;
})();
