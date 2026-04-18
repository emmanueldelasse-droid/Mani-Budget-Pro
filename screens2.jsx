// app.jsx — Mani Budget Pro — 5 onglets + lock screen + sync Cloudflare

const { useState, useEffect } = React;

window.MI_WORKER_URL = 'https://manibudgetpro.emmanueldelasse.workers.dev';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "editorial", "accent": "rouille", "font": "serif", "density": "confortable"
}/*EDITMODE-END*/;

const THEMES = {
  editorial: { name:'Éditorial', vars:{ '--bg':'#f5f1ea','--card':'#ffffff','--fg':'#1a1613','--muted':'#7d7268','--line':'rgba(0,0,0,0.07)','--chip-bg':'rgba(0,0,0,0.05)','--accent-soft':'rgba(194,65,12,0.12)','--hero-bg':'#1a1613','--hero-fg':'#f5f1ea','--pos':'oklch(55% 0.12 150)','--neg':'oklch(55% 0.18 30)','--accent-fg':'#ffffff' } },
  minimal:   { name:'Minimal',   vars:{ '--bg':'#fafaf7','--card':'#ffffff','--fg':'#0a0a0a','--muted':'#737373','--line':'rgba(0,0,0,0.08)','--chip-bg':'rgba(0,0,0,0.05)','--accent-soft':'rgba(10,10,10,0.06)','--hero-bg':'#ffffff','--hero-fg':'#0a0a0a','--pos':'#16a34a','--neg':'#dc2626','--accent-fg':'#fafafa' } },
  fintech:   { name:'Fintech',   vars:{ '--bg':'#f7f7fa','--card':'#ffffff','--fg':'#0f0f1a','--muted':'#6b7280','--line':'rgba(0,0,0,0.06)','--chip-bg':'rgba(99,102,241,0.08)','--accent-soft':'rgba(99,102,241,0.12)','--hero-bg':'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)','--hero-fg':'#ffffff','--pos':'#10b981','--neg':'#f43f5e','--accent-fg':'#ffffff' } },
  terminal:  { name:'Terminal',  vars:{ '--bg':'#0b0d10','--card':'#14171c','--fg':'#e8e8e3','--muted':'#7a8089','--line':'rgba(255,255,255,0.07)','--chip-bg':'rgba(255,255,255,0.06)','--accent-soft':'rgba(74,222,128,0.14)','--hero-bg':'#14171c','--hero-fg':'#e8e8e3','--pos':'#4ade80','--neg':'#f87171','--accent-fg':'#0b0d10' } },
};
const ACCENTS = { rouille:'oklch(60% 0.18 45)', indigo:'oklch(58% 0.2 265)', vert:'oklch(60% 0.18 140)', rose:'oklch(65% 0.2 350)', ambre:'oklch(72% 0.18 75)', cyan:'oklch(65% 0.14 210)' };
const FONTS   = { serif:`'Fraunces','Tiempos',Georgia,serif`, sans:`'Inter',system-ui,sans-serif`, mono:`'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace`, grotesk:`'Space Grotesk',system-ui,sans-serif` };

// ── Lock screen ───────────────────────────────────────────────
function LockScreen({ onUnlock }) {
  const [token, setToken] = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!token.trim()) return;
    setLoading(true); setError('');
    try {
      const r = await fetch(`${window.MI_WORKER_URL}/budget`, { headers:{ 'X-Budget-Token': token.trim() } });
      if (r.status === 401) { setError('Token incorrect.'); setLoading(false); return; }
      localStorage.setItem('mi:token', token.trim());
      onUnlock();
    } catch { setError('Impossible de contacter le serveur.'); setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#1a1613', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:`'Fraunces',Georgia,serif`, padding:24 }}>
      <div style={{ width:'100%', maxWidth:360, textAlign:'center' }}>
        <div style={{ fontSize:52, fontWeight:700, color:'#f5f1ea', letterSpacing:-2, marginBottom:6 }}>mbp.</div>
        <div style={{ fontSize:13, color:'rgba(245,241,234,0.5)', letterSpacing:1.2, textTransform:'uppercase', marginBottom:48 }}>Mani Budget Pro</div>
        <div style={{ background:'#fff', borderRadius:24, padding:32 }}>
          <div style={{ fontSize:18, fontWeight:600, color:'#1a1613', marginBottom:6 }}>Accès sécurisé</div>
          <div style={{ fontSize:13, color:'#7d7268', marginBottom:24, lineHeight:1.5 }}>Entre ton token pour accéder à tes données</div>
          <input type="password" value={token} onChange={e=>setToken(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()}
            placeholder="Token secret" autoFocus
            style={{ width:'100%', padding:'14px 16px', border:`1.5px solid ${error?'#dc2626':'rgba(0,0,0,0.12)'}`, borderRadius:12, fontSize:16, fontFamily:'inherit', color:'#1a1613', background:'#fafaf9', outline:'none', boxSizing:'border-box', marginBottom:error?8:20, letterSpacing:2 }}/>
          {error && <div style={{ fontSize:12, color:'#dc2626', marginBottom:16, textAlign:'left' }}>{error}</div>}
          <button onClick={submit} disabled={loading||!token.trim()}
            style={{ width:'100%', padding:14, borderRadius:12, border:'none', background:loading?'rgba(0,0,0,0.15)':'#1a1613', color:'#f5f1ea', fontSize:15, fontWeight:600, fontFamily:'inherit', cursor:loading?'default':'pointer' }}>
            {loading ? 'Vérification…' : 'Déverrouiller'}
          </button>
        </div>
        <div style={{ marginTop:24, fontSize:11, color:'rgba(245,241,234,0.3)', letterSpacing:0.4 }}>Cloudflare KV · Chiffré</div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────
function App() {
  const [unlocked, setUnlocked]   = useState(!!localStorage.getItem('mi:token'));
  const [tweaks, setTweaks]       = useState(TWEAK_DEFAULTS);
  const [editMode, setEditMode]   = useState(false);
  const [tab, setTab]             = useState(localStorage.getItem('mi:tab') || 'home');
  const [monthKey, setMonthKey]   = useState(localStorage.getItem('mi:month') || window.CURRENT_MONTH.monthKey);
  const [addOpen, setAddOpen]     = useState(false);
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 900);
  const [syncStatus, setSyncStatus] = useState('');

  useEffect(() => { const fn = () => setIsMobile(window.innerWidth < 900); window.addEventListener('resize', fn); return () => window.removeEventListener('resize', fn); }, []);
  useEffect(() => localStorage.setItem('mi:tab', tab), [tab]);
  useEffect(() => localStorage.setItem('mi:month', monthKey), [monthKey]);

  useEffect(() => {
    const h = e => {
      if (e.data?.type==='__activate_edit_mode') setEditMode(true);
      if (e.data?.type==='__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', h);
    window.parent.postMessage({ type:'__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', h);
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    window.__storeReady.then(store => {
      setSyncStatus('syncing');
      store.syncFromCloud().then(ok => { setSyncStatus(ok?'ok':'error'); setTimeout(()=>setSyncStatus(''), 2500); });
    });
  }, [unlocked]);

  const updateTweak = (k, v) => { const n={...tweaks,[k]:v}; setTweaks(n); window.parent.postMessage({type:'__edit_mode_set_keys',edits:{[k]:v}},'*'); };

  if (!unlocked) return <LockScreen onUnlock={()=>setUnlocked(true)}/>;

  const theme = THEMES[tweaks.theme] || THEMES.editorial;
  const accent = ACCENTS[tweaks.accent] || ACCENTS.rouille;
  const font   = FONTS[tweaks.font]   || FONTS.serif;
  const vars   = {...theme.vars, '--accent':accent, '--font':font};
  const cssVars = Object.entries(vars).map(([k,v])=>`${k}:${v};`).join(' ');
  const pad = tweaks.density==='compact' ? 0.78 : 1;

  const tabs = [
    { key:'home',     label:'Accueil',   icon:'●' },
    { key:'month',    label:'Mois',      icon:'◷' },
    { key:'accounts', label:'Comptes',   icon:'◎' },
    { key:'history',  label:'Historique',icon:'▦' },
    { key:'more',     label:'Plus',      icon:'⋯' },
  ];

  const renderScreen = () => {
    if (addOpen) return <ScreenAdd onClose={()=>setAddOpen(false)} monthKey={monthKey}/>;
    switch(tab) {
      case 'home':     return <ScreenHome     monthKey={monthKey} setMonthKey={setMonthKey} onOpenAdd={()=>setAddOpen(true)} setTab={setTab}/>;
      case 'month':    return <ScreenMois     monthKey={monthKey} setMonthKey={setMonthKey} onOpenAdd={()=>setAddOpen(true)} setTab={setTab}/>;
      case 'accounts': return <ScreenAccounts/>;
      case 'history':  return <ScreenHistory  monthKey={monthKey} setMonthKey={setMonthKey} setTab={setTab}/>;
      case 'charts':   return <ScreenCharts/>;
      case 'categories': return <ScreenCategories/>;
      case 'goals':    return <ScreenGoals/>;
      case 'more':     return <ScreenMore setTab={setTab} onLogout={()=>{localStorage.removeItem('mi:token');setUnlocked(false);}}/>;
      default:         return <ScreenHome monthKey={monthKey} setMonthKey={setMonthKey} onOpenAdd={()=>setAddOpen(true)} setTab={setTab}/>;
    }
  };

  const syncDot   = syncStatus==='syncing'?'⟳':syncStatus==='ok'?'✓':syncStatus==='error'?'!':null;
  const syncColor = syncStatus==='ok'?'var(--pos)':syncStatus==='error'?'var(--neg)':'var(--muted)';

  return (
    <div style={{ minHeight:'100vh', background:theme.vars['--bg'], fontFamily:font, color:theme.vars['--fg'] }}>
      <style>{`
        :root { ${cssVars} }
        body { background:${theme.vars['--bg']}; font-family:${font}; }
        .screen { padding:${24*pad}px ${20*pad}px; max-width:520px; margin:0 auto; }
        .fab { position:fixed; bottom:84px; right:20px; z-index:10; width:56px; height:56px; border-radius:18px; background:var(--accent); color:var(--accent-fg); border:none; cursor:pointer; font-size:28px; box-shadow:0 8px 24px rgba(0,0,0,0.15); display:flex; align-items:center; justify-content:center; font-family:inherit; }
        .tabbar { position:fixed; bottom:0; left:0; right:0; z-index:20; background:var(--card); border-top:1px solid var(--line); display:flex; justify-content:space-around; padding:8px 4px 20px; overflow-x:auto; }
        .tabbar button { flex:1; min-width:48px; max-width:80px; background:transparent; border:none; cursor:pointer; padding:6px 2px; border-radius:10px; display:flex; flex-direction:column; align-items:center; gap:3px; font-family:inherit; color:var(--muted); font-size:9px; letter-spacing:0.3px; }
        .tabbar button.active { color:var(--accent); }
        .tabbar button .ic { font-size:15px; }
        @media(min-width:900px){ .tabbar{display:none;} .fab{bottom:32px;} }
      `}</style>

      {syncDot && <div style={{ position:'fixed', top:12, right:14, zIndex:999, fontSize:11, color:syncColor, opacity:0.8 }}>{syncDot}</div>}

      {isMobile ? (
        <>
          {renderScreen()}
          {!addOpen && (
            <>
              <button className="fab" onClick={()=>setAddOpen(true)}>+</button>
              <nav className="tabbar">
                {tabs.map(t => (
                  <button key={t.key} className={tab===t.key?'active':''} onClick={()=>setTab(t.key)}>
                    <span className="ic">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </nav>
            </>
          )}
        </>
      ) : (
        <DesktopShell tabs={tabs} tab={tab} setTab={setTab} onAdd={()=>setAddOpen(true)} onLogout={()=>{localStorage.removeItem('mi:token');setUnlocked(false);}} syncDot={syncDot} syncColor={syncColor}>
          {renderScreen()}
        </DesktopShell>
      )}
      {editMode && <TweaksPanel tweaks={tweaks} updateTweak={updateTweak}/>}
    </div>
  );
}

function DesktopShell({ tabs, tab, setTab, onAdd, onLogout, children, syncDot, syncColor }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', minHeight:'100vh' }}>
      <aside style={{ borderRight:'1px solid var(--line)', padding:'24px 16px', position:'sticky', top:0, alignSelf:'start', height:'100vh', overflowY:'auto', background:'var(--card)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
          <div style={{ fontFamily:'var(--font)', fontSize:24, fontWeight:700, letterSpacing:-0.8 }}>mbp.</div>
          {syncDot && <span style={{ fontSize:11, color:syncColor }}>{syncDot}</span>}
        </div>
        <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase', marginBottom:24 }}>Mani Budget Pro</div>
        <nav style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={()=>setTab(t.key)} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, background:tab===t.key?'var(--accent-soft)':'transparent', color:tab===t.key?'var(--accent)':'var(--fg)', border:'none', cursor:'pointer', textAlign:'left', fontFamily:'inherit', fontSize:14, fontWeight:500 }}>
              <span style={{ width:16, textAlign:'center', fontSize:12 }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <button onClick={onAdd} style={{ marginTop:20, width:'100%', padding:'12px 14px', background:'var(--accent)', color:'var(--accent-fg)', border:'none', borderRadius:12, fontWeight:600, fontSize:14, fontFamily:'inherit', cursor:'pointer' }}>+ Ajouter</button>
        <button onClick={onLogout} style={{ marginTop:8, width:'100%', padding:'10px 14px', background:'transparent', color:'var(--muted)', border:'1px solid var(--line)', borderRadius:12, fontWeight:500, fontSize:12, fontFamily:'inherit', cursor:'pointer' }}>Déverrouiller · Changer</button>
        <div style={{ marginTop:32, padding:'12px', fontSize:11, color:'var(--muted)' }}>
          <div>{window.BUDGET.months.length} mois archivés</div>
          <div>Dernier : {window.CURRENT_MONTH.label}</div>
        </div>
      </aside>
      <main style={{ minWidth:0, maxWidth:860, width:'100%', margin:'0 auto', padding:'16px 0 40px' }}>{children}</main>
    </div>
  );
}

function TweaksPanel({ tweaks, updateTweak }) {
  return (
    <div style={{ position:'fixed', bottom:100, right:20, zIndex:100, width:260, background:'var(--card)', borderRadius:18, padding:16, border:'1px solid var(--line)', boxShadow:'0 20px 60px rgba(0,0,0,0.2)', fontFamily:'var(--font)' }}>
      <div style={{ fontWeight:600, fontSize:13, marginBottom:12 }}>Tweaks</div>
      {[['Thème', Object.entries(THEMES).map(([k,t])=>({k,l:t.name})), 'theme'],
        ['Accent', Object.entries(ACCENTS).map(([k])=>({k,l:k})), 'accent'],
        ['Police', Object.keys(FONTS).map(k=>({k,l:'Aa'})), 'font'],
        ['Densité', [{k:'compact',l:'Compact'},{k:'confortable',l:'Normal'}], 'density'],
      ].map(([title, opts, key]) => (
        <div key={key} style={{ marginBottom:12 }}>
          <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:5 }}>{title}</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
            {opts.map(({k,l}) => (
              <button key={k} onClick={()=>updateTweak(key,k)} style={{ padding:'5px 9px', borderRadius:999, border:'none', cursor:'pointer', background:tweaks[key]===k?'var(--fg)':'var(--chip-bg)', color:tweaks[key]===k?'var(--bg)':'var(--fg)', fontSize:11, fontFamily:key==='font'?FONTS[k]:'inherit' }}>{l}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

window.__storeReady.then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App/>);
});
