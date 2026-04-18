// screens.jsx — Mani Budget Pro — Accueil, Mois, Comptes, Historique

const { useState, useEffect, useRef } = React;

// ── Primitives ────────────────────────────────────────────────
function Card({ children, pad=20, style={} }) {
  return <div style={{ background:'var(--card)', borderRadius:18, padding:pad, border:'1px solid var(--line)', ...style }}>{children}</div>;
}
function Section({ title, action, children }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10, padding:'0 2px' }}>
        <h3 style={{ margin:0, fontSize:11, fontWeight:600, letterSpacing:0.8, textTransform:'uppercase', color:'var(--muted)' }}>{title}</h3>
        {action && <span style={{ fontSize:12, color:'var(--accent)', cursor:'pointer' }}>{action}</span>}
      </div>
      {children}
    </div>
  );
}
function Chip({ children, color, onClick, active }) {
  return <button onClick={onClick} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 10px', borderRadius:999, fontSize:12, fontWeight:500, background:active?'var(--fg)':'var(--chip-bg)', color:active?'var(--bg)':'var(--fg)', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
    {color && <span style={{ width:8, height:8, borderRadius:999, background:color }}/>}
    {children}
  </button>;
}
function CatDot({ cat, size=10 }) {
  return <span style={{ width:size, height:size, borderRadius:999, background:window.CAT_COLORS[cat]||'var(--muted)', display:'inline-block', flexShrink:0 }}/>;
}
function Bars({ values, height=80 }) {
  const m = Math.max(...values.map(v=>Math.abs(v)),1);
  return <div style={{ display:'flex', alignItems:'flex-end', gap:3, height }}>
    {values.map((v,i) => <div key={i} style={{ flex:1, height:Math.max(2,(Math.abs(v)/m)*height), background:v<0?'var(--neg)':'var(--accent)', opacity:v<0?0.7:1, borderRadius:2 }}/>)}
  </div>;
}
function Spark({ values, width=160, height=36 }) {
  if (!values.length) return null;
  const min=Math.min(...values), max=Math.max(...values), r=max-min||1;
  const pts=values.map((v,i)=>`${((i/(values.length-1))*width).toFixed(1)},${(height-((v-min)/r)*height).toFixed(1)}`).join(' ');
  return <svg width={width} height={height} style={{ display:'block' }}><polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/></svg>;
}
function Donut({ data, size=180, thick=28 }) {
  const total=data.reduce((a,b)=>a+b.value,0)||1, r=(size-thick)/2, circ=2*Math.PI*r; let offset=0;
  return <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
    {data.map((d,i)=>{ const len=(d.value/total)*circ; const seg=<circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={d.color} strokeWidth={thick} strokeDasharray={`${len} ${circ-len}`} strokeDashoffset={-offset}/>; offset+=len; return seg; })}
  </svg>;
}
function TxRow({ tx, isLast, onDelete }) {
  const cat=tx.category||'Autre', day=tx.date?tx.date.slice(8,10):'—';
  return <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 18px', borderBottom:isLast?'none':'1px solid var(--line)' }}>
    <div style={{ width:36, height:36, borderRadius:10, background:window.CAT_COLORS[cat], opacity:0.18, position:'relative', flexShrink:0 }}>
      <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, color:'var(--fg)' }}>{day}</span>
    </div>
    <div style={{ flex:1, minWidth:0 }}>
      <div style={{ fontSize:14, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{tx.detail||'—'}</div>
      <div style={{ fontSize:11, color:'var(--muted)', display:'flex', alignItems:'center', gap:6 }}>
        <CatDot cat={cat} size={7}/>{cat}
        {tx.type==='fixe' && <span style={{ fontSize:9, padding:'1px 5px', background:'var(--chip-bg)', borderRadius:4 }}>FIXE</span>}
      </div>
    </div>
    <div style={{ fontVariantNumeric:'tabular-nums', fontWeight:500, fontSize:14 }}>−{window.fmtEur(tx.amount).replace('−','')}</div>
    {onDelete && <button onClick={onDelete} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)', fontSize:16, padding:'0 0 0 8px' }}>×</button>}
  </div>;
}
const iconBtn = { width:36, height:36, borderRadius:999, background:'var(--chip-bg)', color:'var(--fg)', border:'none', cursor:'pointer', fontSize:20, display:'inline-flex', alignItems:'center', justifyContent:'center', fontFamily:'inherit', fontWeight:500 };

// ── Screen : Accueil ─────────────────────────────────────────
function ScreenHome({ monthKey, setMonthKey, onOpenAdd, setTab }) {
  const [, bump] = useState(0);
  useEffect(() => window.STORE.subscribe(() => bump(x=>x+1)), []);

  const months  = window.STORE.getMonths();
  const m       = months.find(x=>x.monthKey===monthKey) || months[months.length-1];
  const summary = window.STORE.getSummary(m.monthKey);
  const reste   = summary.reste;
  const pct     = summary.totalGains > 0 ? Math.min(100, ((summary.totalFixes+summary.totalVar)/summary.totalGains)*100) : 0;
  const txs     = m.allTx.slice(0,6);

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase' }}>{m.label}</div>
          <div style={{ fontSize:18, fontWeight:600, letterSpacing:-0.3 }}>Mani Budget Pro</div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background:'var(--hero-bg)', color:'var(--hero-fg)', borderRadius:24, padding:22, marginBottom:16, border:'1px solid var(--line)' }}>
        <div style={{ fontSize:11, letterSpacing:1.2, textTransform:'uppercase', opacity:0.6, marginBottom:4 }}>Reste ce mois</div>
        <div style={{ fontSize:44, fontWeight:600, letterSpacing:-1.5, fontVariantNumeric:'tabular-nums', color:reste<0?'var(--neg)':'var(--hero-fg)', marginBottom:16 }}>
          {window.fmtEur(reste, {signed:true})}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, fontSize:12 }}>
          {[['Entrées', summary.totalGains],['Fixes', -summary.totalFixes],['Variables', -summary.totalVar]].map(([l,v])=>(
            <div key={l}><div style={{ opacity:0.55, marginBottom:2 }}>{l}</div><div style={{ fontWeight:500, fontVariantNumeric:'tabular-nums' }}>{window.fmtEur(v,{signed:l!=='Entrées'})}</div></div>
          ))}
        </div>
        <div style={{ marginTop:14, height:4, background:'rgba(255,255,255,0.15)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${pct}%`, background:'rgba(255,255,255,0.7)', borderRadius:2 }}/>
        </div>
        <div style={{ fontSize:10, opacity:0.4, marginTop:5 }}>{Math.round(pct)}% du budget utilisé</div>
      </div>

      {/* Bouton ajout */}
      <button onClick={onOpenAdd} style={{ width:'100%', padding:14, background:'var(--accent)', color:'var(--accent-fg)', border:'none', borderRadius:14, fontWeight:600, fontSize:15, fontFamily:'inherit', cursor:'pointer', marginBottom:20 }}>
        + Ajouter une dépense
      </button>

      {/* Transactions récentes */}
      <Section title="Transactions récentes" action={<span onClick={()=>setTab('month')}>Voir tout →</span>}>
        <Card pad={0}>
          {txs.length===0
            ? <div style={{ padding:24, textAlign:'center', color:'var(--muted)', fontSize:13 }}>Aucune transaction ce mois.</div>
            : txs.map((t,i)=><TxRow key={i} tx={t} isLast={i===txs.length-1}/>)}
        </Card>
      </Section>

      <div style={{ height:80 }}/>
    </div>
  );
}

// ── Screen : Mois en cours (slider) ──────────────────────────
function ScreenMois({ monthKey, setMonthKey, onOpenAdd, setTab }) {
  const [, bump] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  useEffect(() => window.STORE.subscribe(() => bump(x=>x+1)), []);

  const months  = window.STORE.getMonths();
  const m       = months.find(x=>x.monthKey===monthKey) || months[months.length-1];
  const summary = window.STORE.getSummary(m.monthKey);
  const idx     = months.findIndex(x=>x.monthKey===m.monthKey);
  const prev    = idx>0 ? months[idx-1] : null;
  const next    = idx<months.length-1 ? months[idx+1] : null;
  const isLast  = idx===months.length-1;

  const totalOut   = summary.totalFixes + summary.totalVar;
  const catEntries = Object.entries(summary.byCategory).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const txs        = m.allTx.slice(0,15);

  const today  = new Date();
  const isCurr = m.year===today.getFullYear() && m.month===today.getMonth()+1;
  const fixes  = (m.depFixes||[]).filter(d=>typeof d.day==='number').sort((a,b)=>a.day-b.day);
  const upcoming = isCurr ? fixes.filter(f=>f.day>=today.getDate()).slice(0,5) : fixes.slice(0,5);

  const handleCreateNext = () => {
    const key = window.STORE.createNextMonth(m.monthKey);
    if (key) { setMonthKey(key); setShowCreate(false); }
  };

  return (
    <div className="screen">
      {/* Nav slider */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <button onClick={()=>prev&&setMonthKey(prev.monthKey)} disabled={!prev} style={iconBtn}>‹</button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase' }}>Mois en cours</div>
          <div style={{ fontSize:22, fontWeight:600, letterSpacing:-0.3 }}>{m.label}</div>
          {m.userCreated && <span style={{ fontSize:9, padding:'2px 6px', background:'var(--accent-soft)', color:'var(--accent)', borderRadius:4 }}>CRÉÉ</span>}
        </div>
        <button onClick={()=>next&&setMonthKey(next.monthKey)} disabled={!next} style={iconBtn}>›</button>
      </div>

      {/* Hero */}
      <div style={{ background:'var(--hero-bg)', color:'var(--hero-fg)', borderRadius:22, padding:22, marginBottom:16, border:'1px solid var(--line)' }}>
        <div style={{ fontSize:11, opacity:0.6, letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>Reste</div>
        <div style={{ fontSize:42, fontWeight:600, letterSpacing:-1.5, fontVariantNumeric:'tabular-nums', color:summary.reste<0?'var(--neg)':'var(--hero-fg)' }}>
          {window.fmtEur(summary.reste,{signed:true})}
        </div>
        <div style={{ display:'flex', gap:24, marginTop:16, fontSize:13 }}>
          {[['Entrées',summary.totalGains],['Fixes',-summary.totalFixes],['Variables',-summary.totalVar]].map(([l,v])=>(
            <div key={l}><div style={{ opacity:0.6 }}>{l}</div><div style={{ fontWeight:500 }}>{window.fmtEur(v,{signed:l!=='Entrées'})}</div></div>
          ))}
        </div>
      </div>

      {/* Bouton créer mois suivant (uniquement sur le dernier mois) */}
      {isLast && (
        <button onClick={handleCreateNext}
          style={{ width:'100%', padding:12, background:'var(--card)', color:'var(--fg)', border:'1px solid var(--line)', borderRadius:14, fontWeight:500, fontSize:14, fontFamily:'inherit', cursor:'pointer', marginBottom:20 }}>
          + Créer {window.MONTH_FR[m.month%12]} {m.month===12?m.year+1:m.year}
          {summary.reste<0 && <span style={{ fontSize:11, color:'var(--neg)', marginLeft:8 }}>· découvert {window.fmtEur(summary.reste)} reporté</span>}
        </button>
      )}

      {/* Prochains prélèvements */}
      {upcoming.length>0 && (
        <Section title="Prochains prélèvements">
          <Card pad={0}>
            {upcoming.map((f,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'11px 16px', borderTop:i===0?'none':'1px solid var(--line)' }}>
                <div style={{ width:38, padding:'5px 0', textAlign:'center', borderRadius:10, background:'var(--accent-soft)', color:'var(--accent)', flexShrink:0 }}>
                  <div style={{ fontSize:15, fontWeight:600 }}>{String(f.day).padStart(2,'0')}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500 }}>{f.detail}</div>
                  <div style={{ fontSize:11, color:'var(--muted)', display:'flex', alignItems:'center', gap:5 }}><CatDot cat={f.category} size={7}/>{f.category}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:500, fontVariantNumeric:'tabular-nums' }}>−{window.fmtEur(f.amount).replace('−','')}</div>
              </div>
            ))}
          </Card>
        </Section>
      )}

      {/* Top catégories */}
      {catEntries.length>0 && (
        <Section title="Top catégories">
          <Card pad={0}>
            {catEntries.map(([cat,val],i)=>{
              const pct=totalOut?val/totalOut*100:0;
              return (
                <div key={cat} style={{ padding:'12px 16px', borderTop:i===0?'none':'1px solid var(--line)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}><CatDot cat={cat}/><span style={{ fontSize:14, fontWeight:500 }}>{cat}</span></div>
                    <span style={{ fontVariantNumeric:'tabular-nums', fontWeight:500, fontSize:14 }}>{window.fmtEur(val)}</span>
                  </div>
                  <div style={{ height:3, background:'var(--line)', borderRadius:2 }}><div style={{ height:'100%', width:`${pct}%`, background:window.CAT_COLORS[cat], borderRadius:2 }}/></div>
                </div>
              );
            })}
          </Card>
        </Section>
      )}

      {/* Transactions */}
      <Section title="Transactions">
        <Card pad={0}>
          {txs.length===0
            ? <div style={{ padding:24, textAlign:'center', color:'var(--muted)', fontSize:13 }}>Aucune transaction. Appuie sur + pour ajouter.</div>
            : txs.map((t,i)=>(
                <TxRow key={i} tx={t} isLast={i===txs.length-1}
                  onDelete={t.id ? ()=>window.STORE.deleteAdded(t.id) : null}/>
              ))}
        </Card>
      </Section>

      <div style={{ height:80 }}/>
    </div>
  );
}

// ── Screen : Historique (slider mois) ────────────────────────
function ScreenHistory({ monthKey, setMonthKey, setTab }) {
  const [, bump] = useState(0);
  useEffect(() => window.STORE.subscribe(() => bump(x=>x+1)), []);

  const allMonths = [...window.STORE.getMonths()].reverse();
  const latest    = allMonths[0];

  const summaries = allMonths.map(m => ({ m, s:window.STORE.getSummary(m.monthKey) }));
  const avgReste  = summaries.reduce((a,{s})=>a+(s?.reste||0),0) / summaries.length;
  const resteVals = [...allMonths].reverse().map(m=>window.STORE.getSummary(m.monthKey)?.reste||0);

  const handleCreateNext = () => {
    const key = window.STORE.createNextMonth(latest.monthKey);
    if (key) { setMonthKey(key); setTab('month'); }
  };

  return (
    <div className="screen">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:20 }}>
        <div>
          <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase' }}>Historique</div>
          <div style={{ fontSize:26, fontWeight:600, letterSpacing:-0.5 }}>{allMonths.length} mois</div>
        </div>
        <button onClick={handleCreateNext} style={{ padding:'10px 14px', border:'1px solid var(--line)', borderRadius:10, background:'var(--card)', color:'var(--fg)', fontFamily:'inherit', fontSize:13, fontWeight:500, cursor:'pointer' }}>
          + Nouveau mois
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
        <Card>
          <div style={{ fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:0.6, marginBottom:4 }}>Reste moyen</div>
          <div style={{ fontSize:22, fontWeight:600, fontVariantNumeric:'tabular-nums', letterSpacing:-0.4, color:avgReste<0?'var(--neg)':'var(--fg)' }}>{window.fmtEur(avgReste,{signed:true})}</div>
        </Card>
        <Card>
          <div style={{ fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:0.6, marginBottom:4 }}>Tendance</div>
          <Spark values={resteVals} width={100} height={36}/>
        </Card>
      </div>

      {/* Liste */}
      <Section title="Chronologie">
        <Card pad={0}>
          {summaries.map(({m,s},i)=>{
            const reste=s?.reste||0;
            return (
              <div key={m.monthKey}
                onClick={()=>{ setMonthKey(m.monthKey); setTab('month'); }}
                style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', cursor:'pointer', borderTop:i===0?'none':'1px solid var(--line)' }}>
                <div style={{ width:44, textAlign:'center' }}>
                  <div style={{ fontSize:19, fontWeight:600, letterSpacing:-0.3, fontVariantNumeric:'tabular-nums' }}>{String(m.month).padStart(2,'0')}</div>
                  <div style={{ fontSize:10, color:'var(--muted)' }}>{m.year}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500 }}>
                    {m.label}
                    {m.userCreated && <span style={{ fontSize:9, padding:'2px 5px', background:'var(--accent-soft)', color:'var(--accent)', borderRadius:4, marginLeft:6 }}>CRÉÉ</span>}
                  </div>
                  <div style={{ fontSize:11, color:'var(--muted)' }}>{window.fmtEur(s?.totalGains||0)} · −{window.fmtEur((s?.totalFixes||0)+(s?.totalVar||0)).replace('−','')}</div>
                </div>
                <div style={{ fontSize:14, fontWeight:600, fontVariantNumeric:'tabular-nums', color:reste<0?'var(--neg)':'var(--pos)' }}>
                  {window.fmtEur(reste,{signed:true})}
                </div>
                <span style={{ color:'var(--muted)', fontSize:14 }}>›</span>
              </div>
            );
          })}
        </Card>
      </Section>
      <div style={{ height:80 }}/>
    </div>
  );
}

// ── Screen : Comptes ─────────────────────────────────────────
function ScreenAccounts() {
  const B = window.BUDGET;
  const compteB  = B.extras?.['Compte B'] || [];
  const vinted   = B.extras?.['Vinted']   || [];
  const vacances = B.extras?.['Vacance']  || [];

  const entrees  = compteB.find(r=>r.rowNum===5)?.B || 0;
  const sorties  = compteB.find(r=>r.rowNum===8)?.B || 0;
  const reste    = compteB.find(r=>r.rowNum===11)?.B || 0;

  const vintedSold   = vinted.filter(r=>typeof r.O==='number'&&r.O>0);
  const vintedProfit = vintedSold.reduce((a,b)=>a+(b.O||0),0);
  const vintedCost   = vinted.filter(r=>typeof r.I==='number').reduce((a,b)=>a+b.I,0);

  const [sub, setSub] = useState('compteB');
  const tabs = [['compteB','Compte B'],['vinted','Vinted'],['vacances','Vacances']];

  return (
    <div className="screen">
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase' }}>Comptes</div>
        <div style={{ fontSize:26, fontWeight:600, letterSpacing:-0.5 }}>Secondaires</div>
      </div>

      <div style={{ display:'flex', gap:6, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {tabs.map(([k,l])=><Chip key={k} active={sub===k} onClick={()=>setSub(k)}>{l}</Chip>)}
      </div>

      {sub==='compteB' && (
        <>
          <div style={{ background:'var(--hero-bg)', color:'var(--hero-fg)', borderRadius:22, padding:22, marginBottom:20, border:'1px solid var(--line)' }}>
            <div style={{ fontSize:11, opacity:0.6, letterSpacing:1, textTransform:'uppercase' }}>Compte B · Épargne</div>
            <div style={{ fontSize:42, fontWeight:600, letterSpacing:-1.5, marginTop:4, fontVariantNumeric:'tabular-nums' }}>{window.fmtEur(reste)}</div>
            <div style={{ display:'flex', gap:24, marginTop:16, fontSize:13 }}>
              <div><div style={{ opacity:0.6 }}>Entrées</div><div style={{ fontWeight:500 }}>{window.fmtEur(entrees)}</div></div>
              <div><div style={{ opacity:0.6 }}>Sorties</div><div style={{ fontWeight:500 }}>{window.fmtEur(sorties)}</div></div>
            </div>
          </div>
          <Section title="Mouvements">
            <Card pad={0}>
              {compteB.filter(r=>r.rowNum>13&&typeof r.D==='number').slice(0,15).map((r,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderTop:i===0?'none':'1px solid var(--line)' }}>
                  <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:500 }}>{r.C||'—'}</div><div style={{ fontSize:11, color:'var(--muted)' }}>{r.B||''}</div></div>
                  <div style={{ fontSize:14, fontVariantNumeric:'tabular-nums', fontWeight:500, color:r.rowNum<30?'var(--pos)':'var(--neg)' }}>
                    {r.rowNum<30?'+':'−'}{window.fmtEur(r.D).replace('−','')}
                  </div>
                </div>
              ))}
            </Card>
          </Section>
        </>
      )}

      {sub==='vinted' && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
            {[['Articles',vinted.filter(r=>r.F).length,''],['Vendus',vintedSold.length,''],['Investi',window.fmtEur(vintedCost),''],['Bénéfice',window.fmtEur(vintedProfit),'var(--pos)']].map(([l,v,c])=>(
              <Card key={l}><div style={{ fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:0.6, marginBottom:4 }}>{l}</div><div style={{ fontSize:20, fontWeight:600, color:c||'var(--fg)' }}>{v}</div></Card>
            ))}
          </div>
          <Section title="Stock">
            <Card pad={0}>
              {vinted.filter(r=>r.F).slice(0,10).map((r,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderTop:i===0?'none':'1px solid var(--line)' }}>
                  <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:500 }}>{r.F} <span style={{ color:'var(--muted)', fontWeight:400 }}>T.{r.H}</span></div><div style={{ fontSize:11, color:'var(--muted)' }}>Achat {r.I}€{r.M?` · vendu ${r.M}€`:''}</div></div>
                  {typeof r.O==='number'&&r.O>0 ? <div style={{ fontSize:13, color:'var(--pos)', fontWeight:600 }}>+{Math.round(r.O)}€</div> : <div style={{ fontSize:10, padding:'2px 8px', borderRadius:4, background:'var(--chip-bg)', color:'var(--muted)' }}>STOCK</div>}
                </div>
              ))}
            </Card>
          </Section>
        </>
      )}

      {sub==='vacances' && (
        <>
          <div style={{ background:'var(--hero-bg)', color:'var(--hero-fg)', borderRadius:22, padding:22, marginBottom:20, border:'1px solid var(--line)' }}>
            <div style={{ fontSize:11, opacity:0.6, letterSpacing:1, textTransform:'uppercase' }}>Budget vacances été 2026</div>
            <div style={{ fontSize:42, fontWeight:600, letterSpacing:-1.5, marginTop:4 }}>{window.fmtEur(-25.46,{signed:true})}</div>
            <div style={{ fontSize:13, opacity:0.7, marginTop:6 }}>vs objectif 2 026 €</div>
          </div>
          <Section title="Postes prévus">
            <Card pad={0}>
              {vacances.filter(r=>r.C&&typeof r.D==='number').slice(0,8).map((r,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderTop:i===0?'none':'1px solid var(--line)' }}>
                  <div style={{ flex:1, fontSize:14 }}>{r.C}</div>
                  <div style={{ fontSize:14, fontWeight:500, fontVariantNumeric:'tabular-nums' }}>{window.fmtEur(r.D)}</div>
                </div>
              ))}
            </Card>
          </Section>
        </>
      )}
      <div style={{ height:80 }}/>
    </div>
  );
}

// ── Screen : Graphiques ──────────────────────────────────────
function ScreenCharts() {
  const B = window.BUDGET;
  const months = B.months;
  const [mode, setMode] = useState('flux');
  const sal   = months.map(m=>m.salaire||0);
  const fix   = months.map(m=>m.fixes||0);
  const vari  = months.map(m=>m.variables||0);
  const reste = months.map(m=>m.reste||0);
  const catTotals={};
  B.summary.forEach(s=>Object.entries(s.byCategory).forEach(([c,v])=>catTotals[c]=(catTotals[c]||0)+v));
  const catSorted = Object.entries(catTotals).sort((a,b)=>b[1]-a[1]);
  const donutData = catSorted.map(([c,v])=>({value:v,color:window.CAT_COLORS[c]}));

  return (
    <div className="screen">
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase' }}>Tendances</div>
        <div style={{ fontSize:26, fontWeight:600, letterSpacing:-0.5 }}>Analyse</div>
      </div>
      <div style={{ display:'flex', gap:6, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {[['flux','Flux'],['categories','Catégories'],['salaires','Salaires']].map(([k,l])=><Chip key={k} active={mode===k} onClick={()=>setMode(k)}>{l}</Chip>)}
      </div>
      {mode==='flux' && (
        <Section title="Reste en fin de mois">
          <Card><Bars values={reste} height={90}/></Card>
        </Section>
      )}
      {mode==='categories' && (
        <Section title="Répartition totale">
          <Card>
            <div style={{ display:'flex', gap:20, alignItems:'center' }}>
              <div style={{ position:'relative', width:140, height:140, flexShrink:0 }}>
                <Donut data={donutData} size={140} thick={22}/>
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ fontSize:10, color:'var(--muted)', textTransform:'uppercase' }}>Total</div>
                  <div style={{ fontSize:16, fontWeight:600 }}>{Math.round(catSorted.reduce((a,b)=>a+b[1],0)/1000)}k€</div>
                </div>
              </div>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:7 }}>
                {catSorted.slice(0,5).map(([c,v])=>(
                  <div key={c} style={{ display:'flex', alignItems:'center', gap:7, fontSize:12 }}>
                    <CatDot cat={c} size={8}/><span style={{ flex:1 }}>{c}</span><span style={{ fontVariantNumeric:'tabular-nums', fontWeight:500 }}>{Math.round(v/1000)}k€</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Section>
      )}
      {mode==='salaires' && (
        <Section title="Salaire mensuel">
          <Card><Bars values={sal} height={100}/></Card>
        </Section>
      )}
      <div style={{ height:80 }}/>
    </div>
  );
}

// ── Screen : Catégories ──────────────────────────────────────
function ScreenCategories() {
  const curr    = window.CURRENT_MONTH;
  const summary = window.BUDGET.summary.find(s=>s.year===curr.year&&s.month===curr.month);
  const entries = Object.entries(summary.byCategory).sort((a,b)=>b[1]-a[1]);
  const total   = entries.reduce((a,b)=>a+b[1],0);
  return (
    <div className="screen">
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase' }}>Catégories</div>
        <div style={{ fontSize:26, fontWeight:600, letterSpacing:-0.5 }}>{curr.label}</div>
      </div>
      <Section title={`Total ${window.fmtEur(total)}`}>
        <Card pad={0}>
          {entries.map(([c,v],i)=>{
            const pct=v/total*100;
            const txs=[...curr.depFixes,...curr.depVar].filter(t=>t.category===c);
            return (
              <div key={c} style={{ padding:'14px 16px', borderTop:i===0?'none':'1px solid var(--line)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:7 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:window.CAT_COLORS[c], opacity:0.22, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <div style={{ width:10, height:10, borderRadius:3, background:window.CAT_COLORS[c] }}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:500 }}>{c}</div>
                    <div style={{ fontSize:11, color:'var(--muted)' }}>{txs.length} transactions · {pct.toFixed(1)}%</div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>{window.fmtEur(v)}</div>
                </div>
                <div style={{ height:4, background:'var(--line)', borderRadius:2, overflow:'hidden' }}><div style={{ height:'100%', width:`${pct}%`, background:window.CAT_COLORS[c] }}/></div>
              </div>
            );
          })}
        </Card>
      </Section>
      <div style={{ height:80 }}/>
    </div>
  );
}

// ── Screen : Objectifs ───────────────────────────────────────
function ScreenGoals() {
  const goals=[
    {title:'Vacances été 2026',target:2000,current:1585,color:'oklch(68% 0.12 180)',icon:'🏖️'},
    {title:"Fonds d'urgence",target:5000,current:7185,color:'oklch(68% 0.12 130)',icon:'🔒'},
    {title:'Nouveau scooter',target:3500,current:850,color:'oklch(68% 0.12 30)',icon:'🛵'},
    {title:'Mila rentrée scolaire',target:600,current:320,color:'oklch(68% 0.12 280)',icon:'🎒'},
  ];
  return (
    <div className="screen">
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase' }}>Objectifs</div>
        <div style={{ fontSize:26, fontWeight:600, letterSpacing:-0.5 }}>Épargne</div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {goals.map(g=>{
          const pct=Math.min(100,g.current/g.target*100), done=g.current>=g.target;
          return (
            <Card key={g.title}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:g.color, opacity:0.22, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{g.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500 }}>{g.title}</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>{window.fmtEur(g.current)} / {window.fmtEur(g.target)}</div>
                </div>
                {done && <div style={{ fontSize:10, padding:'3px 7px', borderRadius:4, background:'var(--pos)', color:'white', fontWeight:600 }}>✓</div>}
              </div>
              <div style={{ height:7, background:'var(--line)', borderRadius:4, overflow:'hidden' }}><div style={{ height:'100%', width:`${pct}%`, background:g.color }}/></div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:11, color:'var(--muted)' }}>
                <span>{pct.toFixed(0)}%</span><span>Reste {window.fmtEur(Math.max(0,g.target-g.current))}</span>
              </div>
            </Card>
          );
        })}
        <button style={{ padding:14, borderRadius:14, border:'1px dashed var(--line)', background:'transparent', color:'var(--muted)', fontFamily:'inherit', fontSize:14, cursor:'pointer' }}>+ Nouvel objectif</button>
      </div>
      <div style={{ height:80 }}/>
    </div>
  );
}

// Exports
Object.assign(window, {
  Card, Section, Chip, CatDot, Bars, Spark, Donut, TxRow, iconBtn,
  ScreenHome, ScreenMois, ScreenAccounts, ScreenHistory,
  ScreenCharts, ScreenCategories, ScreenGoals,
});
