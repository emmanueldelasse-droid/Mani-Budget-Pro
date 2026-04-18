// Screens for the Budget app — all screens + shared primitives
// Exports via window: Screen components used by app.jsx

const { useState, useMemo, useEffect, useRef, Fragment } = React;

// ─────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────

function Money({ value, size='md', signed=false, muted=false }) {
  const n = value;
  const str = window.fmtEur(n, {signed});
  const neg = n < 0;
  const fsize = size==='xl'?48 : size==='lg'?32 : size==='md'?17 : 14;
  return (
    <span style={{
      fontVariantNumeric: 'tabular-nums',
      fontWeight: size==='xl'||size==='lg' ? 600 : 500,
      fontSize: fsize,
      letterSpacing: size==='xl' ? -1.2 : size==='lg' ? -0.6 : -0.2,
      color: muted ? 'var(--muted)' : neg ? 'var(--neg)' : 'var(--fg)',
    }}>{str}</span>
  );
}

function Chip({ children, color, onClick, active }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 10px', borderRadius: 999,
      fontSize: 12, fontWeight: 500,
      background: active ? 'var(--fg)' : 'var(--chip-bg)',
      color: active ? 'var(--bg)' : 'var(--fg)',
      border: 'none', cursor: 'pointer',
      fontFamily: 'inherit',
    }}>
      {color && <span style={{ width:8, height:8, borderRadius:999, background:color }}/>}
      {children}
    </button>
  );
}

function CatDot({ cat, size=10 }) {
  return <span style={{
    width:size, height:size, borderRadius:999,
    background: window.CAT_COLORS[cat] || 'var(--muted)',
    display: 'inline-block', flexShrink:0,
  }}/>;
}

function Card({ children, pad=20, style={} }) {
  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: 18,
      padding: pad,
      border: '1px solid var(--line)',
      ...style,
    }}>{children}</div>
  );
}

function Section({ title, action, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'baseline',
        marginBottom: 12, padding: '0 4px',
      }}>
        <h3 style={{ margin:0, fontSize:13, fontWeight:600, letterSpacing:0.6,
          textTransform:'uppercase', color:'var(--muted)' }}>{title}</h3>
        {action && <span style={{ fontSize:13, color:'var(--accent)', cursor:'pointer' }}>{action}</span>}
      </div>
      {children}
    </div>
  );
}

// Simple inline bar chart
function Bars({ values, max, height=80, color='var(--accent)', muted='var(--line)' }) {
  const m = max || Math.max(...values.map(v => Math.abs(v)), 1);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap: 3, height }}>
      {values.map((v, i) => {
        const h = Math.max(2, (Math.abs(v)/m) * height);
        const neg = v < 0;
        return <div key={i} style={{
          flex:1, height:h,
          background: neg ? 'var(--neg)' : color,
          opacity: neg ? 0.7 : 1,
          borderRadius: 2,
        }}/>;
      })}
    </div>
  );
}

// Sparkline path
function Spark({ values, width=160, height=36, color='var(--accent)' }) {
  if (!values.length) return null;
  const min = Math.min(...values), max = Math.max(...values);
  const r = max - min || 1;
  const pts = values.map((v,i) => {
    const x = (i/(values.length-1)) * width;
    const y = height - ((v-min)/r) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={width} height={height} style={{ display:'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

// Donut chart
function Donut({ data, size=180, thick=28 }) {
  const total = data.reduce((a,b)=>a+b.value,0) || 1;
  const r = (size-thick)/2;
  const cx = size/2, cy = size/2;
  const circ = 2*Math.PI*r;
  let offset = 0;
  return (
    <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
      {data.map((d,i) => {
        const pct = d.value/total;
        const len = pct * circ;
        const seg = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={d.color} strokeWidth={thick}
            strokeDasharray={`${len} ${circ-len}`}
            strokeDashoffset={-offset}
          />
        );
        offset += len;
        return seg;
      })}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen: Mois en cours
// ─────────────────────────────────────────────────────────────

function ScreenMonth({ monthKey, setMonthKey, onOpenAdd }) {
  const B = window.BUDGET;
  const m = B.months.find(x => x.monthKey === monthKey) || window.CURRENT_MONTH;
  const summary = B.summary.find(s => s.year===m.year && s.month===m.month);
  const totalGains = summary.totalGains;
  const totalOut = summary.totalFixes + summary.totalVar;
  const reste = totalGains - totalOut;

  const idx = B.months.findIndex(x => x.monthKey === m.monthKey);
  const prev = idx > 0 ? B.months[idx-1] : null;
  const next = idx < B.months.length-1 ? B.months[idx+1] : null;

  // Top categories
  const catEntries = Object.entries(summary.byCategory)
    .sort((a,b) => b[1]-a[1]).slice(0,6);

  // Recent transactions
  const txs = m.allTx.slice(0, 12);

  // Daily spend chart
  const dailyMap = {};
  m.allTx.forEach(t => {
    if (t.type === 'fixe') return;
    const d = t.date?.slice(8,10);
    if (!d) return;
    dailyMap[+d] = (dailyMap[+d]||0) + t.amount;
  });
  const days = [];
  for (let d=1; d<=31; d++) days.push(dailyMap[d]||0);

  return (
    <div className="screen">
      {/* Month nav */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        marginBottom: 20,
      }}>
        <button onClick={() => prev && setMonthKey(prev.monthKey)}
          disabled={!prev}
          style={iconBtn}>‹</button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:12, color:'var(--muted)', letterSpacing:1.2, textTransform:'uppercase' }}>Budget du mois</div>
          <div style={{ fontSize:22, fontWeight:600, letterSpacing:-0.3 }}>{m.label}</div>
        </div>
        <button onClick={() => next && setMonthKey(next.monthKey)}
          disabled={!next}
          style={iconBtn}>›</button>
      </div>

      {/* Hero card */}
      <div style={{
        background: 'var(--hero-bg)',
        color: 'var(--hero-fg)',
        borderRadius: 24, padding: 24,
        marginBottom: 20,
        border: '1px solid var(--line)',
      }}>
        <div style={{ fontSize:12, letterSpacing:1.2, textTransform:'uppercase', opacity:0.7 }}>
          Reste
        </div>
        <div style={{
          fontSize: 44, fontWeight:600, letterSpacing:-1.5,
          fontVariantNumeric:'tabular-nums',
          color: reste < 0 ? 'var(--neg)' : 'var(--hero-fg)',
          marginTop: 4,
        }}>{window.fmtEur(reste, {signed:true})}</div>
        <div style={{ display:'flex', gap:24, marginTop:20, fontSize:13 }}>
          <div>
            <div style={{ opacity:0.6, marginBottom:2 }}>Entrées</div>
            <div style={{ fontWeight:500, fontVariantNumeric:'tabular-nums' }}>{window.fmtEur(totalGains)}</div>
          </div>
          <div>
            <div style={{ opacity:0.6, marginBottom:2 }}>Fixes</div>
            <div style={{ fontWeight:500, fontVariantNumeric:'tabular-nums' }}>{window.fmtEur(-summary.totalFixes)}</div>
          </div>
          <div>
            <div style={{ opacity:0.6, marginBottom:2 }}>Variables</div>
            <div style={{ fontWeight:500, fontVariantNumeric:'tabular-nums' }}>{window.fmtEur(-summary.totalVar)}</div>
          </div>
        </div>
        {/* Ratio bar */}
        <div style={{ marginTop:20, height:6, borderRadius:3, background:'var(--chip-bg)', overflow:'hidden', display:'flex' }}>
          <div style={{ width: `${Math.min(100, summary.totalFixes/totalGains*100)}%`, background:'var(--fg)', opacity:0.9 }}/>
          <div style={{ width: `${Math.min(100-summary.totalFixes/totalGains*100, summary.totalVar/totalGains*100)}%`, background:'var(--accent)', opacity:0.8 }}/>
        </div>
      </div>

      {/* Daily spend */}
      <Section title="">
        <Card>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:12 }}>
            <div>
              <div style={{ fontSize:28, fontWeight:600, letterSpacing:-0.8 }}>
                {window.fmtEur(summary.totalVar)}
              </div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>sur le mois, hors charges fixes</div>
            </div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>{m.allTx.filter(t=>t.type==='var').length} tx</div>
          </div>
          <Bars values={days} height={60} color="var(--accent)"/>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:11, color:'var(--muted)' }}>
            <span>1</span><span>10</span><span>20</span><span>31</span>
          </div>
        </Card>
      </Section>

      {/* Top catégories */}
      <Section title="Top catégories">
        <Card pad={0}>
          {catEntries.map(([cat, val], i) => {
            const pct = val / totalOut * 100;
            return (
              <div key={cat} style={{
                padding:'14px 20px',
                borderTop: i===0 ? 'none' : '1px solid var(--line)',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <CatDot cat={cat}/>
                    <span style={{ fontSize:14, fontWeight:500 }}>{cat}</span>
                  </div>
                  <div style={{ fontVariantNumeric:'tabular-nums', fontWeight:500, fontSize:14 }}>
                    {window.fmtEur(val)}
                  </div>
                </div>
                <div style={{ height:3, background:'var(--line)', borderRadius:2 }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:window.CAT_COLORS[cat], borderRadius:2 }}/>
                </div>
              </div>
            );
          })}
        </Card>
      </Section>

      {/* Transactions */}
      <Section title="Dernières transactions" action="Tout voir">
        <Card pad={0}>
          {txs.map((t, i) => (
            <TxRow key={i} tx={t} isLast={i===txs.length-1}/>
          ))}
        </Card>
      </Section>

      {/* Add button spacer */}
      <div style={{ height: 80 }}/>
    </div>
  );
}

function TxRow({ tx, isLast }) {
  const cat = tx.category || 'Autre';
  const date = tx.date;
  const day = date ? date.slice(8,10) : '—';
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12,
      padding:'12px 20px',
      borderTop: isLast ? 'none' : undefined,
      borderBottom: isLast ? 'none' : '1px solid var(--line)',
    }}>
      <div style={{
        width:36, height:36, borderRadius:10,
        background: window.CAT_COLORS[cat],
        opacity: 0.18,
        position:'relative', flexShrink:0,
      }}>
        <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:11, fontWeight:600, letterSpacing:0.3,
          color:'var(--fg)' }}>{day}</span>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:15, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{tx.detail || '—'}</div>
        <div style={{ fontSize:12, color:'var(--muted)', display:'flex', alignItems:'center', gap:6 }}>
          <CatDot cat={cat} size={7}/>
          {cat}
          {tx.type==='fixe' && <span style={{ fontSize:10, padding:'1px 6px', background:'var(--chip-bg)', borderRadius:4 }}>FIXE</span>}
        </div>
      </div>
      <div style={{ fontVariantNumeric:'tabular-nums', fontWeight:500, fontSize:15 }}>
        −{window.fmtEur(tx.amount).replace('−','')}
      </div>
    </div>
  );
}

const iconBtn = {
  width: 36, height: 36, borderRadius: 999,
  background: 'var(--chip-bg)', color:'var(--fg)',
  border:'none', cursor:'pointer', fontSize: 20,
  display:'inline-flex', alignItems:'center', justifyContent:'center',
  fontFamily:'inherit', fontWeight: 500,
};

// ─────────────────────────────────────────────────────────────
// Screen: Historique
// ─────────────────────────────────────────────────────────────

function ScreenHistory({ setMonthKey, setTab }) {
  const B = window.BUDGET;
  const months = [...B.months].reverse();

  // Avg reste
  const avgReste = months.reduce((a,m) => a + (m.reste||0), 0) / months.length;
  const totalReste = months.reduce((a,m) => a + (m.reste||0), 0);

  return (
    <div className="screen">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize:12, color:'var(--muted)', letterSpacing:1.2, textTransform:'uppercase' }}>Historique</div>
        <div style={{ fontSize:28, fontWeight:600, letterSpacing:-0.6, marginTop:4 }}>{months.length} mois</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
        <Card>
          <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:6 }}>Reste moyen</div>
          <div style={{ fontSize:22, fontWeight:600, fontVariantNumeric:'tabular-nums', letterSpacing:-0.4, color: avgReste<0?'var(--neg)':'var(--fg)' }}>
            {window.fmtEur(avgReste, {signed:true})}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:6 }}>Cumul sur période</div>
          <div style={{ fontSize:22, fontWeight:600, fontVariantNumeric:'tabular-nums', letterSpacing:-0.4, color: totalReste<0?'var(--neg)':'var(--fg)' }}>
            {window.fmtEur(totalReste, {signed:true})}
          </div>
        </Card>
      </div>

      <Section title="Chronologie">
        <Card pad={0}>
          {months.map((m, i) => {
            const s = B.summary.find(x => x.year===m.year && x.month===m.month);
            const totalOut = s.totalFixes + s.totalVar;
            return (
              <div key={m.monthKey}
                onClick={() => { setMonthKey(m.monthKey); setTab('month'); }}
                style={{
                  display:'flex', alignItems:'center', gap:14,
                  padding:'14px 20px', cursor:'pointer',
                  borderTop: i===0?'none':'1px solid var(--line)',
                }}>
                <div style={{ width:46, textAlign:'center' }}>
                  <div style={{ fontSize:20, fontWeight:600, letterSpacing:-0.3 }}>
                    {String(m.month).padStart(2,'0')}
                  </div>
                  <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:0.4 }}>{m.year}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500 }}>{m.label}</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>
                    {window.fmtEur(s.totalGains)} · −{window.fmtEur(totalOut).replace('−','')}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{
                    fontSize:15, fontWeight:600, fontVariantNumeric:'tabular-nums',
                    color: m.reste<0?'var(--neg)':'var(--pos)',
                  }}>
                    {window.fmtEur(m.reste, {signed:true})}
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      </Section>

      <div style={{ height: 80 }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen: Graphiques
// ─────────────────────────────────────────────────────────────

function ScreenCharts() {
  const B = window.BUDGET;
  const months = B.months;
  const [mode, setMode] = useState('flux'); // flux | categories | salaires

  const sal = months.map(m => m.salaire||0);
  const fix = months.map(m => m.fixes||0);
  const vari = months.map(m => m.variables||0);
  const reste = months.map(m => m.reste||0);

  // Category totals across all time
  const catTotals = {};
  B.summary.forEach(s => {
    Object.entries(s.byCategory).forEach(([c,v]) => {
      catTotals[c] = (catTotals[c]||0) + v;
    });
  });
  const catSorted = Object.entries(catTotals).sort((a,b)=>b[1]-a[1]);
  const donutData = catSorted.map(([c,v]) => ({ value:v, color: window.CAT_COLORS[c] }));

  return (
    <div className="screen">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize:12, color:'var(--muted)', letterSpacing:1.2, textTransform:'uppercase' }}>Tendances</div>
        <div style={{ fontSize:28, fontWeight:600, letterSpacing:-0.6, marginTop:4 }}>Analyse</div>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {[['flux','Flux'],['categories','Catégories'],['salaires','Salaires']].map(([k,l]) => (
          <Chip key={k} active={mode===k} onClick={() => setMode(k)}>{l}</Chip>
        ))}
      </div>

      {mode === 'flux' && (
        <>
          <Section title="Reste en fin de mois">
            <Card>
              <div style={{ fontSize:28, fontWeight:600, letterSpacing:-0.6, marginBottom:4 }}>
                {window.fmtEur(reste[reste.length-1], {signed:true})}
              </div>
              <div style={{ fontSize:12, color:'var(--muted)', marginBottom:16 }}>
                Moyenne: {window.fmtEur(reste.reduce((a,b)=>a+b,0)/reste.length, {signed:true})}
              </div>
              <Bars values={reste} height={90} color="var(--accent)"/>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:10, color:'var(--muted)' }}>
                <span>{months[0].shortLabel}</span>
                <span>{months[Math.floor(months.length/2)].shortLabel}</span>
                <span>{months[months.length-1].shortLabel}</span>
              </div>
            </Card>
          </Section>

          <Section title="Entrées vs Sorties">
            <Card>
              <div style={{ display:'flex', gap:12, marginBottom:16, fontSize:12 }}>
                <span><span style={{display:'inline-block',width:8,height:8,borderRadius:2,background:'var(--accent)',marginRight:6}}/>Entrées</span>
                <span><span style={{display:'inline-block',width:8,height:8,borderRadius:2,background:'var(--fg)',marginRight:6}}/>Fixes</span>
                <span><span style={{display:'inline-block',width:8,height:8,borderRadius:2,background:'var(--muted)',marginRight:6}}/>Variables</span>
              </div>
              <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:120, overflow:'hidden' }}>
                {months.map((m, i) => {
                  const maxVal = Math.max(...sal, ...months.map(x => (x.fixes||0)+(x.variables||0)));
                  const hIn = Math.min(58, (sal[i]/maxVal)*58);
                  const hOutTotal = Math.min(58, ((fix[i]+vari[i])/maxVal)*58);
                  const hFix = (fix[i]/maxVal)*58;
                  const hVar = (vari[i]/maxVal)*58;
                  return (
                    <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', gap:4, height:'100%', justifyContent:'flex-end' }}>
                      <div style={{ height:Math.max(2,hIn), background:'var(--accent)', borderRadius:2, flexShrink:0 }}/>
                      <div style={{ display:'flex', flexDirection:'column', flexShrink:0 }}>
                        <div style={{ height:Math.max(1,hFix), background:'var(--fg)', borderTopLeftRadius:2, borderTopRightRadius:2 }}/>
                        <div style={{ height:Math.max(1,hVar), background:'var(--muted)', borderBottomLeftRadius:2, borderBottomRightRadius:2 }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </Section>
        </>
      )}

      {mode === 'categories' && (
        <>
          <Section title="Répartition totale">
            <Card>
              <div style={{ display:'flex', gap:20, alignItems:'center' }}>
                <div style={{ position:'relative', width:160, height:160, flexShrink:0 }}>
                  <Donut data={donutData} size={160} thick={24}/>
                  <div style={{
                    position:'absolute', inset:0, display:'flex', flexDirection:'column',
                    alignItems:'center', justifyContent:'center',
                  }}>
                    <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:0.4, textTransform:'uppercase' }}>Total</div>
                    <div style={{ fontSize:18, fontWeight:600, fontVariantNumeric:'tabular-nums', letterSpacing:-0.3 }}>
                      {Math.round(catSorted.reduce((a,b)=>a+b[1],0)/1000)}k€
                    </div>
                  </div>
                </div>
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                  {catSorted.slice(0,6).map(([c,v]) => (
                    <div key={c} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12 }}>
                      <CatDot cat={c} size={8}/>
                      <span style={{ flex:1 }}>{c}</span>
                      <span style={{ fontVariantNumeric:'tabular-nums', fontWeight:500 }}>{Math.round(v/1000)}k€</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Section>

          <Section title="Évolution par catégorie">
            <Card>
              {catSorted.slice(0,5).map(([c], i) => {
                const vals = B.summary.map(s => s.byCategory[c]||0);
                return (
                  <div key={c} style={{
                    display:'flex', alignItems:'center', gap:12,
                    padding:'10px 0', borderTop: i===0?'none':'1px solid var(--line)',
                  }}>
                    <CatDot cat={c}/>
                    <div style={{ flex:1, fontSize:13 }}>{c}</div>
                    <Spark values={vals} width={80} height={24} color={window.CAT_COLORS[c]}/>
                    <div style={{ fontSize:12, color:'var(--muted)', fontVariantNumeric:'tabular-nums', minWidth:48, textAlign:'right' }}>
                      {window.fmtEurCompact(vals[vals.length-1])}
                    </div>
                  </div>
                );
              })}
            </Card>
          </Section>
        </>
      )}

      {mode === 'salaires' && (
        <Section title="Salaire mensuel">
          <Card>
            <div style={{ fontSize:28, fontWeight:600, letterSpacing:-0.6, marginBottom:4 }}>
              {window.fmtEur(sal[sal.length-1])}
            </div>
            <div style={{ fontSize:12, color:'var(--muted)', marginBottom:16 }}>
              Moyenne: {window.fmtEur(sal.reduce((a,b)=>a+b,0)/sal.length)}
            </div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:120 }}>
              {sal.map((v,i) => {
                const max = Math.max(...sal);
                const h = (v/max)*120;
                return <div key={i} style={{ flex:1, height:h, background:'var(--accent)', borderRadius:2, minHeight:2 }}/>;
              })}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:10, color:'var(--muted)' }}>
              <span>{months[0].shortLabel}</span>
              <span>{months[months.length-1].shortLabel}</span>
            </div>
          </Card>
        </Section>
      )}

      <div style={{ height: 80 }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen: Ajout rapide
// ─────────────────────────────────────────────────────────────

function ScreenAdd({ onClose }) {
  const [amount, setAmount] = useState('');
  const [detail, setDetail] = useState('');
  const [cat, setCat] = useState('Courses');
  const [kind, setKind] = useState('var');

  const cats = window.CAT_ORDER;
  const shortcuts = [
    { label: 'Café', cat: 'Resto & Café', amount: 1.5, icon:'☕' },
    { label: 'Pakpak', cat: 'Resto & Café', amount: 7, icon:'🥐' },
    { label: 'Leclerc', cat: 'Courses', amount: 80, icon:'🛒' },
    { label: 'Essence', cat: 'Transport', amount: 30, icon:'⛽' },
    { label: 'Macdo', cat: 'Resto & Café', amount: 15, icon:'🍔' },
    { label: 'Retrait', cat: 'Transport', amount: 40, icon:'💶' },
  ];

  return (
    <div className="screen">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <button onClick={onClose} style={{...iconBtn, width:'auto', padding:'0 14px'}}>Annuler</button>
        <div style={{ fontSize:15, fontWeight:600 }}>Nouvelle dépense</div>
        <button style={{...iconBtn, width:'auto', padding:'0 14px', background:'var(--accent)', color:'var(--accent-fg)' }}>Ajouter</button>
      </div>

      {/* Amount */}
      <div style={{ textAlign:'center', padding:'30px 0 20px' }}>
        <div style={{
          fontSize: 56, fontWeight: 600, letterSpacing:-2,
          fontVariantNumeric:'tabular-nums',
          color: amount ? 'var(--fg)' : 'var(--muted)',
        }}>
          {amount ? `−${amount}` : '0'} €
        </div>
      </div>

      {/* Keypad */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8, marginBottom:24,
      }}>
        {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(k => (
          <button key={k} onClick={() => {
            if (k === '⌫') setAmount(s => s.slice(0,-1));
            else setAmount(s => (s+k).replace(/^0+(\d)/,'$1').replace(/\.\./,'.'));
          }} style={{
            height: 52, border:'none', borderRadius:14,
            background:'var(--card)', fontSize:22, fontWeight:500,
            fontFamily:'inherit', color:'var(--fg)',
            cursor:'pointer',
          }}>{k}</button>
        ))}
      </div>

      {/* Détail */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.6, textTransform:'uppercase', marginBottom:8 }}>Détail</div>
        <input value={detail} onChange={e=>setDetail(e.target.value)}
          placeholder="Ex: Leclerc, Pakpak, Essence…"
          style={{
            width:'100%', padding:'14px 16px', border:'1px solid var(--line)',
            borderRadius:12, background:'var(--card)', color:'var(--fg)',
            fontSize:15, fontFamily:'inherit', boxSizing:'border-box', outline:'none',
          }}/>
      </div>

      {/* Catégories */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.6, textTransform:'uppercase', marginBottom:8 }}>Catégorie</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {cats.map(c => (
            <Chip key={c} color={window.CAT_COLORS[c]} active={cat===c} onClick={() => setCat(c)}>{c}</Chip>
          ))}
        </div>
      </div>

      {/* Raccourcis */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.6, textTransform:'uppercase', marginBottom:8 }}>Raccourcis habituels</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8 }}>
          {shortcuts.map(s => (
            <button key={s.label} onClick={() => {
              setAmount(String(s.amount));
              setDetail(s.label);
              setCat(s.cat);
            }} style={{
              padding:'12px 8px', border:'1px solid var(--line)',
              borderRadius:12, background:'var(--card)', cursor:'pointer',
              display:'flex', flexDirection:'column', alignItems:'center', gap:4,
              fontFamily:'inherit', color:'var(--fg)',
            }}>
              <div style={{ fontSize:20 }}>{s.icon}</div>
              <div style={{ fontSize:11, fontWeight:500 }}>{s.label}</div>
              <div style={{ fontSize:10, color:'var(--muted)' }}>{s.amount}€</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 80 }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen: Catégories
// ─────────────────────────────────────────────────────────────

function ScreenCategories() {
  const B = window.BUDGET;
  const curr = window.CURRENT_MONTH;
  const summary = B.summary.find(s => s.year===curr.year && s.month===curr.month);
  const entries = Object.entries(summary.byCategory).sort((a,b)=>b[1]-a[1]);
  const total = entries.reduce((a,b)=>a+b[1],0);

  return (
    <div className="screen">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize:12, color:'var(--muted)', letterSpacing:1.2, textTransform:'uppercase' }}>Catégories</div>
        <div style={{ fontSize:28, fontWeight:600, letterSpacing:-0.6, marginTop:4 }}>{curr.label}</div>
      </div>

      <Section title={`Total ${window.fmtEur(total)}`}>
        <Card pad={0}>
          {entries.map(([c,v], i) => {
            const pct = v/total*100;
            const txs = [...curr.depFixes, ...curr.depVar].filter(t => t.category===c);
            return (
              <div key={c} style={{
                padding:'16px 20px',
                borderTop: i===0?'none':'1px solid var(--line)',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <div style={{
                    width:34, height:34, borderRadius:10,
                    background: window.CAT_COLORS[c], opacity:0.24,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <div style={{ width:10, height:10, borderRadius:3, background: window.CAT_COLORS[c] }}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:500 }}>{c}</div>
                    <div style={{ fontSize:11, color:'var(--muted)' }}>{txs.length} transactions · {pct.toFixed(1)}%</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:15, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{window.fmtEur(v)}</div>
                  </div>
                </div>
                <div style={{ height:4, background:'var(--line)', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:window.CAT_COLORS[c] }}/>
                </div>
              </div>
            );
          })}
        </Card>
      </Section>

      <div style={{ height: 80 }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen: Comptes secondaires
// ─────────────────────────────────────────────────────────────

function ScreenAccounts() {
  const B = window.BUDGET;
  const compteB = B.extras['Compte B'] || [];
  const vinted = B.extras['Vinted'] || [];
  const vacances = B.extras['Vacance'] || [];

  // Parse Compte B summary
  const entrees = compteB.find(r => r.rowNum===5)?.B || 0;
  const sorties = compteB.find(r => r.rowNum===8)?.B || 0;
  const reste = compteB.find(r => r.rowNum===11)?.B || 0;

  // Vinted sold items
  const vintedSold = vinted.filter(r => typeof r.O === 'number' && r.O > 0);
  const vintedProfit = vintedSold.reduce((a,b) => a + (b.O||0), 0);
  const vintedCost = vinted.filter(r => typeof r.I === 'number').reduce((a,b) => a + b.I, 0);

  const [sub, setSub] = useState('compteB');

  return (
    <div className="screen">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize:12, color:'var(--muted)', letterSpacing:1.2, textTransform:'uppercase' }}>Comptes</div>
        <div style={{ fontSize:28, fontWeight:600, letterSpacing:-0.6, marginTop:4 }}>Secondaires</div>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        <Chip active={sub==='compteB'} onClick={()=>setSub('compteB')}>Compte B</Chip>
        <Chip active={sub==='vinted'} onClick={()=>setSub('vinted')}>Vinted</Chip>
        <Chip active={sub==='vacances'} onClick={()=>setSub('vacances')}>Vacances</Chip>
      </div>

      {sub === 'compteB' && (
        <>
          <div style={{
            background:'var(--hero-bg)', color:'var(--hero-fg)',
            borderRadius:24, padding:24, marginBottom:20,
            border: '1px solid var(--line)',
          }}>
            <div style={{ fontSize:12, letterSpacing:1.2, textTransform:'uppercase', opacity:0.7 }}>Compte B · Épargne</div>
            <div style={{ fontSize:44, fontWeight:600, letterSpacing:-1.5, marginTop:4, fontVariantNumeric:'tabular-nums' }}>
              {window.fmtEur(reste)}
            </div>
            <div style={{ display:'flex', gap:24, marginTop:20, fontSize:13 }}>
              <div>
                <div style={{ opacity:0.6, marginBottom:2 }}>Entrées</div>
                <div style={{ fontWeight:500 }}>{window.fmtEur(entrees)}</div>
              </div>
              <div>
                <div style={{ opacity:0.6, marginBottom:2 }}>Sorties</div>
                <div style={{ fontWeight:500 }}>{window.fmtEur(sorties)}</div>
              </div>
            </div>
          </div>

          <Section title="Mouvements">
            <Card pad={0}>
              {compteB.filter(r => r.rowNum > 13 && typeof r.D === 'number').slice(0, 15).map((r,i,arr) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:12,
                  padding:'12px 20px',
                  borderTop: i===0?'none':'1px solid var(--line)',
                }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:500 }}>{r.C || '—'}</div>
                    <div style={{ fontSize:11, color:'var(--muted)' }}>{r.B || ''}</div>
                  </div>
                  <div style={{ fontSize:14, fontVariantNumeric:'tabular-nums', fontWeight:500,
                    color: r.rowNum < 30 ? 'var(--pos)' : 'var(--neg)' }}>
                    {r.rowNum < 30 ? '+' : '−'}{window.fmtEur(r.D).replace('−','')}
                  </div>
                </div>
              ))}
            </Card>
          </Section>
        </>
      )}

      {sub === 'vinted' && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
            <Card>
              <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:6 }}>Articles</div>
              <div style={{ fontSize:24, fontWeight:600 }}>{vinted.filter(r => r.F).length}</div>
            </Card>
            <Card>
              <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:6 }}>Vendus</div>
              <div style={{ fontSize:24, fontWeight:600 }}>{vintedSold.length}</div>
            </Card>
            <Card>
              <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:6 }}>Invest.</div>
              <div style={{ fontSize:18, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{window.fmtEur(vintedCost)}</div>
            </Card>
            <Card>
              <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:6 }}>Bénéfice</div>
              <div style={{ fontSize:18, fontWeight:600, color:'var(--pos)', fontVariantNumeric:'tabular-nums' }}>
                +{window.fmtEur(vintedProfit).replace('−','')}
              </div>
            </Card>
          </div>

          <Section title="Stock">
            <Card pad={0}>
              {vinted.filter(r => r.F).slice(0,10).map((r,i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:12,
                  padding:'12px 20px',
                  borderTop: i===0?'none':'1px solid var(--line)',
                }}>
                  <div style={{
                    width:40, height:40, borderRadius:8,
                    background:'var(--chip-bg)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:10, color:'var(--muted)', textAlign:'center',
                  }}>{r.G ? r.G.slice(0,6) : '—'}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:500 }}>{r.F} <span style={{ color:'var(--muted)', fontWeight:400 }}>T.{r.H}</span></div>
                    <div style={{ fontSize:11, color:'var(--muted)' }}>Achat {r.I}€{r.M?` · vendu ${r.M}€`:''}</div>
                  </div>
                  {typeof r.O==='number' && r.O>0 ? (
                    <div style={{ fontSize:13, color:'var(--pos)', fontWeight:600 }}>+{Math.round(r.O)}€</div>
                  ) : (
                    <div style={{ fontSize:10, padding:'2px 8px', borderRadius:4, background:'var(--chip-bg)', color:'var(--muted)' }}>STOCK</div>
                  )}
                </div>
              ))}
            </Card>
          </Section>
        </>
      )}

      {sub === 'vacances' && (
        <>
          <div style={{
            background:'var(--hero-bg)', color:'var(--hero-fg)',
            borderRadius:24, padding:24, marginBottom:20,
            border: '1px solid var(--line)',
          }}>
            <div style={{ fontSize:12, letterSpacing:1.2, textTransform:'uppercase', opacity:0.7 }}>Budget vacances été 2026</div>
            <div style={{ fontSize:44, fontWeight:600, letterSpacing:-1.5, marginTop:4 }}>
              {window.fmtEur(-25.46, {signed:true})}
            </div>
            <div style={{ fontSize:13, opacity:0.7, marginTop:6 }}>vs objectif 2 026 €</div>
            <div style={{ marginTop:20, height:8, borderRadius:4, background:'rgba(0,0,0,0.1)', overflow:'hidden' }}>
              <div style={{ width:'100%', height:'100%', background:'var(--accent)' }}/>
            </div>
          </div>

          <Section title="Postes prévus">
            <Card pad={0}>
              {vacances.filter(r => r.C && typeof r.D === 'number').slice(0,8).map((r,i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:12,
                  padding:'12px 20px',
                  borderTop: i===0?'none':'1px solid var(--line)',
                }}>
                  <div style={{ flex:1, fontSize:14 }}>{r.C}</div>
                  <div style={{ fontSize:14, fontWeight:500, fontVariantNumeric:'tabular-nums' }}>{window.fmtEur(r.D)}</div>
                </div>
              ))}
            </Card>
          </Section>
        </>
      )}

      <div style={{ height: 80 }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen: Objectifs d'épargne
// ─────────────────────────────────────────────────────────────

function ScreenGoals() {
  const goals = [
    { title: 'Vacances été 2026', target: 2000, current: 1585, color:'oklch(68% 0.12 180)', icon:'🏖️' },
    { title: 'Fonds d\'urgence', target: 5000, current: 7185, color:'oklch(68% 0.12 130)', icon:'🔒' },
    { title: 'Nouveau scooter', target: 3500, current: 850, color:'oklch(68% 0.12 30)', icon:'🛵' },
    { title: 'Mila rentrée scolaire', target: 600, current: 320, color:'oklch(68% 0.12 280)', icon:'🎒' },
  ];

  return (
    <div className="screen">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize:12, color:'var(--muted)', letterSpacing:1.2, textTransform:'uppercase' }}>Objectifs</div>
        <div style={{ fontSize:28, fontWeight:600, letterSpacing:-0.6, marginTop:4 }}>Épargne</div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {goals.map(g => {
          const pct = Math.min(100, g.current/g.target*100);
          const done = g.current >= g.target;
          return (
            <Card key={g.title}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                <div style={{
                  width:44, height:44, borderRadius:12,
                  background:g.color, opacity:0.22,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:22,
                }}>{g.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:500 }}>{g.title}</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>
                    {window.fmtEur(g.current)} / {window.fmtEur(g.target)}
                  </div>
                </div>
                {done && <div style={{ fontSize:11, padding:'3px 8px', borderRadius:4, background:'var(--pos)', color:'white', fontWeight:600, whiteSpace:'nowrap', flexShrink:0 }}>✓ ATTEINT</div>}
              </div>
              <div style={{ height:8, background:'var(--line)', borderRadius:4, overflow:'hidden' }}>
                <div style={{
                  height:'100%', width:`${pct}%`,
                  background:g.color,
                }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, fontSize:12, color:'var(--muted)' }}>
                <span>{pct.toFixed(0)}%</span>
                <span>Reste {window.fmtEur(Math.max(0, g.target-g.current))}</span>
              </div>
            </Card>
          );
        })}

        <button style={{
          padding:'16px', borderRadius:14, border:'1px dashed var(--line)',
          background:'transparent', color:'var(--muted)',
          fontFamily:'inherit', fontSize:14, cursor:'pointer',
        }}>+ Nouvel objectif</button>
      </div>

      <div style={{ height: 80 }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Screen: Calendrier des dépenses fixes
// ─────────────────────────────────────────────────────────────

function ScreenCalendar() {
  const curr = window.CURRENT_MONTH;
  const fixes = curr.depFixes
    .filter(d => typeof d.day === 'number')
    .sort((a,b) => a.day - b.day);
  const total = fixes.reduce((a,b) => a+b.amount, 0);

  // Group by day
  const today = new Date();
  const thisDay = today.getDate();

  return (
    <div className="screen">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize:12, color:'var(--muted)', letterSpacing:1.2, textTransform:'uppercase' }}>Calendrier fixe</div>
        <div style={{ fontSize:28, fontWeight:600, letterSpacing:-0.6, marginTop:4 }}>{curr.label}</div>
      </div>

      <Card style={{ marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
          <div>
            <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase' }}>Total fixe</div>
            <div style={{ fontSize:28, fontWeight:600, letterSpacing:-0.6, marginTop:2 }}>
              {window.fmtEur(total)}
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase' }}>Prélèvements</div>
            <div style={{ fontSize:28, fontWeight:600, letterSpacing:-0.6, marginTop:2 }}>{fixes.length}</div>
          </div>
        </div>
      </Card>

      <Section title="Échéancier">
        <Card pad={0}>
          {fixes.map((f,i) => {
            const past = f.day < thisDay;
            return (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:16,
                padding:'12px 20px',
                borderTop: i===0?'none':'1px solid var(--line)',
                opacity: past ? 0.55 : 1,
              }}>
                <div style={{
                  width:44, textAlign:'center',
                  padding:'6px 0', borderRadius:10,
                  background: past ? 'var(--chip-bg)' : 'var(--accent-soft)',
                  color: past ? 'var(--muted)' : 'var(--accent)',
                }}>
                  <div style={{ fontSize:18, fontWeight:600, letterSpacing:-0.3 }}>{String(f.day).padStart(2,'0')}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500 }}>{f.detail}</div>
                  <div style={{ fontSize:12, color:'var(--muted)', display:'flex', alignItems:'center', gap:6 }}>
                    <CatDot cat={f.category} size={7}/>
                    {f.category}
                    {past && <span>· effectué</span>}
                  </div>
                </div>
                <div style={{ fontSize:14, fontWeight:500, fontVariantNumeric:'tabular-nums' }}>
                  −{window.fmtEur(f.amount).replace('−','')}
                </div>
              </div>
            );
          })}
        </Card>
      </Section>

      <div style={{ height: 80 }}/>
    </div>
  );
}

Object.assign(window, {
  ScreenMonth, ScreenHistory, ScreenCharts, ScreenAdd,
  ScreenCategories, ScreenAccounts, ScreenGoals, ScreenCalendar,
  Card, Section, Chip, CatDot, Bars, Spark, Donut, Money, iconBtn, TxRow,
});
