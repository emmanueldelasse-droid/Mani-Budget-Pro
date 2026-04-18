// app.jsx — Main app shell avec écran de déverrouillage token

const { useState, useEffect, useMemo } = React;

// ─── CONFIG — modifie uniquement cette ligne ──────────────────
window.MI_WORKER_URL = 'https://manibudgetpro.emmanueldelasse.workers.dev';
// ─────────────────────────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "editorial",
  "accent": "rouille",
  "font": "serif",
  "density": "confortable",
  "heroStyle": "minimal"
}/*EDITMODE-END*/;

const THEMES = {
  editorial: {
    name: 'Éditorial',
    vars: {
      '--bg': '#f5f1ea', '--card': '#ffffff', '--fg': '#1a1613',
      '--muted': '#7d7268', '--line': 'rgba(0,0,0,0.07)',
      '--chip-bg': 'rgba(0,0,0,0.05)', '--accent-soft': 'rgba(194, 65, 12, 0.12)',
      '--hero-bg': '#1a1613', '--hero-fg': '#f5f1ea',
      '--pos': 'oklch(55% 0.12 150)', '--neg': 'oklch(55% 0.18 30)', '--accent-fg': '#ffffff',
    },
  },
  minimal: {
    name: 'Minimal',
    vars: {
      '--bg': '#fafaf7', '--card': '#ffffff', '--fg': '#0a0a0a',
      '--muted': '#737373', '--line': 'rgba(0,0,0,0.08)',
      '--chip-bg': 'rgba(0,0,0,0.05)', '--accent-soft': 'rgba(10,10,10,0.06)',
      '--hero-bg': '#ffffff', '--hero-fg': '#0a0a0a',
      '--pos': '#16a34a', '--neg': '#dc2626', '--accent-fg': '#fafafa',
    },
  },
  fintech: {
    name: 'Fintech',
    vars: {
      '--bg': '#f7f7fa', '--card': '#ffffff', '--fg': '#0f0f1a',
      '--muted': '#6b7280', '--line': 'rgba(0,0,0,0.06)',
      '--chip-bg': 'rgba(99, 102, 241, 0.08)', '--accent-soft': 'rgba(99, 102, 241, 0.12)',
      '--hero-bg': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', '--hero-fg': '#ffffff',
      '--pos': '#10b981', '--neg': '#f43f5e', '--accent-fg': '#ffffff',
    },
  },
  terminal: {
    name: 'Terminal',
    vars: {
      '--bg': '#0b0d10', '--card': '#14171c', '--fg': '#e8e8e3',
      '--muted': '#7a8089', '--line': 'rgba(255,255,255,0.07)',
      '--chip-bg': 'rgba(255,255,255,0.06)', '--accent-soft': 'rgba(74, 222, 128, 0.14)',
      '--hero-bg': '#14171c', '--hero-fg': '#e8e8e3',
      '--pos': '#4ade80', '--neg': '#f87171', '--accent-fg': '#0b0d10',
    },
  },
};

const ACCENTS = {
  rouille: 'oklch(60% 0.18 45)', indigo: 'oklch(58% 0.2 265)',
  vert: 'oklch(60% 0.18 140)', rose: 'oklch(65% 0.2 350)',
  ambre: 'oklch(72% 0.18 75)', cyan: 'oklch(65% 0.14 210)',
};

const FONTS = {
  serif: `'Fraunces', 'Tiempos', Georgia, serif`,
  sans: `'Inter', system-ui, sans-serif`,
  mono: `'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace`,
  grotesk: `'Space Grotesk', system-ui, sans-serif`,
};

// ─────────────────────────────────────────────────────────────
// Écran de déverrouillage
// ─────────────────────────────────────────────────────────────

function LockScreen({ onUnlock }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!token.trim()) return;
    setLoading(true);
    setError('');
    try {
      // Vérifie le token contre le Worker
      const r = await fetch(`${window.MI_WORKER_URL}/budget`, {
        headers: { 'X-Budget-Token': token.trim() },
      });
      if (r.status === 401) {
        setError('Token incorrect. Réessaie.');
        setLoading(false);
        return;
      }
      // Token valide : on le stocke et on déverrouille
      localStorage.setItem('mi:token', token.trim());
      onUnlock();
    } catch {
      setError('Impossible de contacter le serveur. Vérifie ta connexion.');
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1613',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: `'Fraunces', Georgia, serif`,
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
        {/* Logo */}
        <div style={{ fontSize: 52, fontWeight: 700, color: '#f5f1ea', letterSpacing: -2, marginBottom: 6 }}>
          mbp.
        </div>
        <div style={{ fontSize: 13, color: 'rgba(245,241,234,0.5)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 48 }}>
          Mani Budget Pro
        </div>

        {/* Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: 24,
          padding: 32,
        }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1613', marginBottom: 6 }}>
            Accès sécurisé
          </div>
          <div style={{ fontSize: 13, color: '#7d7268', marginBottom: 24, lineHeight: 1.5 }}>
            Entre ton token pour accéder à tes données
          </div>

          <input
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Token secret"
            autoFocus
            style={{
              width: '100%',
              padding: '14px 16px',
              border: `1.5px solid ${error ? '#dc2626' : 'rgba(0,0,0,0.12)'}`,
              borderRadius: 12,
              fontSize: 16,
              fontFamily: 'inherit',
              color: '#1a1613',
              background: '#fafaf9',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: error ? 8 : 20,
              letterSpacing: 2,
            }}
          />

          {error && (
            <div style={{ fontSize: 12, color: '#dc2626', marginBottom: 16, textAlign: 'left' }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !token.trim()}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              border: 'none',
              background: loading ? 'rgba(0,0,0,0.15)' : '#1a1613',
              color: '#f5f1ea',
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: loading ? 'default' : 'pointer',
              letterSpacing: 0.2,
            }}
          >
            {loading ? 'Vérification…' : 'Déverrouiller'}
          </button>
        </div>

        <div style={{ marginTop: 24, fontSize: 11, color: 'rgba(245,241,234,0.3)', letterSpacing: 0.4 }}>
          Données chiffrées · Cloudflare KV
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// App principale
// ─────────────────────────────────────────────────────────────

function App() {
  const [unlocked, setUnlocked] = useState(!!localStorage.getItem('mi:token'));
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode] = useState(false);
  const [tab, setTab] = useState(localStorage.getItem('mi:tab') || 'month');
  const [monthKey, setMonthKey] = useState(localStorage.getItem('mi:month') || window.CURRENT_MONTH.monthKey);
  const [addOpen, setAddOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [syncStatus, setSyncStatus] = useState(''); // '', 'syncing', 'ok', 'error'

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => localStorage.setItem('mi:tab', tab), [tab]);
  useEffect(() => localStorage.setItem('mi:month', monthKey), [monthKey]);

  // Edit mode protocol
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  // Sync depuis le cloud au chargement (si déjà déverrouillé)
  useEffect(() => {
    if (!unlocked) return;
    window.__storeReady.then(store => {
      setSyncStatus('syncing');
      store.syncFromCloud().then(ok => {
        setSyncStatus(ok ? 'ok' : 'error');
        setTimeout(() => setSyncStatus(''), 2500);
      });
    });
  }, [unlocked]);

  const updateTweak = (key, val) => {
    const next = { ...tweaks, [key]: val };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
  };

  const handleLogout = () => {
    localStorage.removeItem('mi:token');
    setUnlocked(false);
  };

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  const theme = THEMES[tweaks.theme] || THEMES.editorial;
  const accentColor = ACCENTS[tweaks.accent] || ACCENTS.rouille;
  const fontFamily = FONTS[tweaks.font] || FONTS.serif;
  const vars = { ...theme.vars, '--accent': accentColor, '--font': fontFamily };
  const cssVars = Object.entries(vars).map(([k,v]) => `${k}: ${v};`).join(' ');

  const tabs = [
    { key: 'month',   label: 'Mois',       icon: '●' },
    { key: 'history', label: 'Historique', icon: '◷' },
    { key: 'accounts',label: 'Comptes',    icon: '◎' },
    { key: 'more',    label: 'Plus',       icon: '⋯' },
  ];

  const renderScreen = () => {
    if (addOpen) return <ScreenAdd onClose={() => setAddOpen(false)} monthKey={monthKey}/>;
    switch(tab) {
      case 'month':      return <ScreenMonth monthKey={monthKey} setMonthKey={setMonthKey} onOpenAdd={() => setAddOpen(true)}/>;
      case 'history':    return <ScreenHistory setMonthKey={setMonthKey} setTab={setTab}/>;
      case 'charts':     return <ScreenCharts/>;
      case 'categories': return <ScreenCategories/>;
      case 'accounts':   return <ScreenAccounts/>;
      case 'goals':      return <ScreenGoals/>;
      case 'calendar':   return <ScreenCalendar/>;
      case 'more':       return <ScreenMore setTab={setTab} onLogout={handleLogout}/>;
      default:           return <ScreenMonth monthKey={monthKey} setMonthKey={setMonthKey}/>;
    }
  };

  const padScale = tweaks.density === 'compact' ? 0.78 : 1;

  // Indicateur de sync discret
  const syncDot = syncStatus === 'syncing' ? '⟳' : syncStatus === 'ok' ? '✓' : syncStatus === 'error' ? '!' : null;
  const syncColor = syncStatus === 'ok' ? 'var(--pos)' : syncStatus === 'error' ? 'var(--neg)' : 'var(--muted)';

  return (
    <div style={{ minHeight:'100vh', background: theme.vars['--bg'], fontFamily, color: theme.vars['--fg'] }}>
      <style>{`
        :root { ${cssVars} }
        body { background: ${theme.vars['--bg']}; font-family: ${fontFamily}; }
        .screen { padding: ${24*padScale}px ${20*padScale}px; max-width: 520px; margin: 0 auto; }
        .fab {
          position: fixed; bottom: 84px; right: 20px; z-index: 10;
          width: 56px; height: 56px; border-radius: 18px;
          background: var(--accent); color: var(--accent-fg);
          border: none; cursor: pointer; font-size: 28px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          display: flex; align-items: center; justify-content: center;
          font-family: inherit;
        }
        .tabbar {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 20;
          background: var(--card); border-top: 1px solid var(--line);
          display: flex; justify-content: space-around;
          padding: 8px 8px 20px; overflow-x: auto;
        }
        .tabbar button {
          flex: 1; min-width: 56px; max-width: 96px;
          background: transparent; border: none; cursor: pointer;
          padding: 8px 4px; border-radius: 10px;
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          font-family: inherit; color: var(--muted); font-size: 10px; letter-spacing: 0.4px;
        }
        .tabbar button.active { color: var(--accent); }
        .tabbar button .ic { font-size: 16px; }
        @media (min-width: 900px) { .tabbar { display: none; } .fab { bottom: 32px; } }
      `}</style>

      {/* Indicateur sync discret */}
      {syncDot && (
        <div style={{
          position: 'fixed', top: 12, right: 14, zIndex: 999,
          fontSize: 11, color: syncColor, fontFamily: 'inherit',
          opacity: 0.8,
        }}>{syncDot}</div>
      )}

      {isMobile ? (
        <>
          {renderScreen()}
          {!addOpen && (
            <>
              <button className="fab" onClick={() => setAddOpen(true)}>+</button>
              <nav className="tabbar">
                {tabs.map(t => (
                  <button key={t.key} className={tab===t.key ? 'active' : ''} onClick={() => setTab(t.key)}>
                    <span className="ic">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </nav>
            </>
          )}
        </>
      ) : (
        <DesktopShell tabs={tabs} tab={tab} setTab={setTab} onAdd={() => setAddOpen(true)} onLogout={handleLogout} syncDot={syncDot} syncColor={syncColor}>
          {renderScreen()}
        </DesktopShell>
      )}

      {editMode && <TweaksPanel tweaks={tweaks} updateTweak={updateTweak}/>}
    </div>
  );
}

function DesktopShell({ tabs, tab, setTab, onAdd, onLogout, children, syncDot, syncColor }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', minHeight:'100vh' }}>
      <aside style={{
        borderRight:'1px solid var(--line)', padding:'28px 18px',
        position:'sticky', top:0, alignSelf:'start',
        height:'100vh', overflowY:'auto', background:'var(--card)',
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
          <div style={{ fontFamily:'var(--font)', fontSize:24, fontWeight:700, letterSpacing:-0.8 }}>mbp.</div>
          {syncDot && <span style={{ fontSize:11, color: syncColor }}>{syncDot}</span>}
        </div>
        <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase', marginBottom:28 }}>
          Mani Budget Pro
        </div>

        <nav style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'10px 12px', borderRadius:10,
              background: tab===t.key ? 'var(--accent-soft)' : 'transparent',
              color: tab===t.key ? 'var(--accent)' : 'var(--fg)',
              border:'none', cursor:'pointer', textAlign:'left',
              fontFamily:'inherit', fontSize:14, fontWeight:500,
            }}>
              <span style={{ width:16, textAlign:'center', fontSize:12 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <button onClick={onAdd} style={{
          marginTop:24, width:'100%', padding:'12px 14px',
          background:'var(--accent)', color:'var(--accent-fg)',
          border:'none', borderRadius:12, fontWeight:600, fontSize:14,
          fontFamily:'inherit', cursor:'pointer',
        }}>+ Nouvelle dépense</button>

        <div style={{ marginTop:40, padding:'14px 12px', fontSize:11, color:'var(--muted)' }}>
          <div>{window.BUDGET.months.length} mois archivés</div>
          <div>Dernier: {window.CURRENT_MONTH.label}</div>
        </div>

        {/* Déconnexion */}
        <button onClick={onLogout} style={{
          marginTop:12, width:'100%', padding:'10px 14px',
          background:'transparent', color:'var(--muted)',
          border:'1px solid var(--line)', borderRadius:12, fontWeight:500, fontSize:12,
          fontFamily:'inherit', cursor:'pointer',
        }}>Déverrouiller · Changer</button>
      </aside>

      <main style={{ minWidth:0, maxWidth:860, width:'100%', margin:'0 auto', padding:'16px 0 40px' }}>
        {children}
      </main>
    </div>
  );
}

function TweaksPanel({ tweaks, updateTweak }) {
  return (
    <div style={{
      position:'fixed', bottom:100, right:20, zIndex:100,
      width:280, background:'var(--card)', borderRadius:18,
      padding:18, border:'1px solid var(--line)',
      boxShadow:'0 20px 60px rgba(0,0,0,0.2)', fontFamily:'var(--font)',
    }}>
      <div style={{ fontWeight:600, fontSize:14, marginBottom:14, letterSpacing:-0.2 }}>Tweaks</div>

      <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:6 }}>Thème</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
        {Object.entries(THEMES).map(([k,t]) => (
          <button key={k} onClick={() => updateTweak('theme', k)} style={{
            padding:'6px 10px', borderRadius:999, border:'none', cursor:'pointer',
            background: tweaks.theme===k ? 'var(--fg)' : 'var(--chip-bg)',
            color: tweaks.theme===k ? 'var(--bg)' : 'var(--fg)',
            fontSize:12, fontFamily:'inherit',
          }}>{t.name}</button>
        ))}
      </div>

      <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:6 }}>Accent</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
        {Object.entries(ACCENTS).map(([k,c]) => (
          <button key={k} onClick={() => updateTweak('accent', k)} style={{
            padding:'6px 10px', borderRadius:999, border:'none', cursor:'pointer',
            background: tweaks.accent===k ? c : 'var(--chip-bg)',
            color: tweaks.accent===k ? 'white' : 'var(--fg)',
            fontSize:12, fontFamily:'inherit', display:'flex', alignItems:'center', gap:6,
          }}>
            <span style={{ width:10, height:10, borderRadius:999, background:c }}/>
            {k}
          </button>
        ))}
      </div>

      <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:6 }}>Police</div>
      <div style={{ display:'flex', gap:6, marginBottom:14 }}>
        {Object.keys(FONTS).map(k => (
          <button key={k} onClick={() => updateTweak('font', k)} style={{
            flex:1, padding:'8px 10px', borderRadius:8, border:'1px solid var(--line)',
            cursor:'pointer', background: tweaks.font===k ? 'var(--fg)' : 'var(--card)',
            color: tweaks.font===k ? 'var(--bg)' : 'var(--fg)',
            fontSize:12, fontFamily: FONTS[k],
          }}>Aa</button>
        ))}
      </div>

      <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:6 }}>Densité</div>
      <div style={{ display:'flex', gap:6 }}>
        {['compact','confortable'].map(k => (
          <button key={k} onClick={() => updateTweak('density', k)} style={{
            flex:1, padding:'8px 10px', borderRadius:8, border:'1px solid var(--line)',
            cursor:'pointer', background: tweaks.density===k ? 'var(--fg)' : 'var(--card)',
            color: tweaks.density===k ? 'var(--bg)' : 'var(--fg)',
            fontSize:12, fontFamily:'inherit',
          }}>{k}</button>
        ))}
      </div>
    </div>
  );
}

// Boot
window.__storeReady.then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App/>);
});
