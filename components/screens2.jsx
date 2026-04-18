// Additions: new screens that override/extend the originals
// Loaded AFTER screens.jsx so these Object.assign wins.

const { useState: useStateX, useEffect: useEffectX, useRef: useRefX } = React;

// ─── New Month screen with integrated calendar ──────────────
function ScreenMonth2({ monthKey, setMonthKey, onOpenAdd }) {
  const [, bump] = useStateX(0);
  useEffectX(() => window.STORE.subscribe(() => bump(x => x+1)), []);

  const months = window.STORE.getMonths();
  const m = months.find(x => x.monthKey === monthKey) || months[months.length-1];
  const summary = window.STORE.getSummary(m.monthKey);
  const totalOut = summary.totalFixes + summary.totalVar;
  const reste = summary.reste;

  const idx = months.findIndex(x => x.monthKey === m.monthKey);
  const prev = idx > 0 ? months[idx-1] : null;
  const next = idx < months.length-1 ? months[idx+1] : null;

  // Échéancier: next 6 upcoming fixed payments (sorted by day)
  const today = new Date();
  const isCurrentMonth = m.year === today.getFullYear() && m.month === today.getMonth()+1;
  const fixes = (m.depFixes||[])
    .filter(d => typeof d.day === 'number')
    .sort((a,b) => a.day - b.day);
  const upcoming = isCurrentMonth
    ? fixes.filter(f => f.day >= today.getDate()).slice(0, 5)
    : fixes.slice(0, 5);

  // Top cats
  const catEntries = Object.entries(summary.byCategory).sort((a,b) => b[1]-a[1]).slice(0,5);
  const txs = m.allTx.slice(0, 10);

  return (
    <div className="screen">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <button onClick={() => prev && setMonthKey(prev.monthKey)} disabled={!prev} style={window.iconBtn}>‹</button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:12, color:'var(--muted)', letterSpacing:1.2, textTransform:'uppercase' }}>Budget du mois</div>
          <div style={{ fontSize:22, fontWeight:600, letterSpacing:-0.3 }}>{m.label}</div>
        </div>
        <button onClick={() => next && setMonthKey(next.monthKey)} disabled={!next} style={window.iconBtn}>›</button>
      </div>

      {/* Hero */}
      <div style={{
        background:'var(--hero-bg)', color:'var(--hero-fg)',
        borderRadius:24, padding:24, marginBottom:20,
        border:'1px solid var(--line)',
      }}>
        <div style={{ fontSize:12, letterSpacing:1.2, textTransform:'uppercase', opacity:0.7 }}>Reste</div>
        <div style={{
          fontSize:44, fontWeight:600, letterSpacing:-1.5, marginTop:4,
          fontVariantNumeric:'tabular-nums',
          color: reste<0?'var(--neg)':'var(--hero-fg)',
        }}>{window.fmtEur(reste, {signed:true})}</div>
        <div style={{ display:'flex', gap:24, marginTop:20, fontSize:13 }}>
          <div><div style={{ opacity:0.6 }}>Entrées</div><div style={{ fontWeight:500 }}>{window.fmtEur(summary.totalGains)}</div></div>
          <div><div style={{ opacity:0.6 }}>Fixes</div><div style={{ fontWeight:500 }}>{window.fmtEur(-summary.totalFixes)}</div></div>
          <div><div style={{ opacity:0.6 }}>Variables</div><div style={{ fontWeight:500 }}>{window.fmtEur(-summary.totalVar)}</div></div>
        </div>
      </div>

      {/* Échéancier à venir */}
      {upcoming.length > 0 && (
        <window.Section title="Prochains prélèvements fixes">
          <window.Card pad={0}>
            {upcoming.map((f,i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap:14, padding:'12px 18px',
                borderTop: i===0?'none':'1px solid var(--line)',
              }}>
                <div style={{
                  width:40, padding:'6px 0', textAlign:'center', borderRadius:10,
                  background:'var(--accent-soft)', color:'var(--accent)',
                }}>
                  <div style={{ fontSize:16, fontWeight:600 }}>{String(f.day).padStart(2,'0')}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500 }}>{f.detail}</div>
                  <div style={{ fontSize:11, color:'var(--muted)', display:'flex', alignItems:'center', gap:6 }}>
                    <window.CatDot cat={f.category} size={7}/>{f.category}
                  </div>
                </div>
                <div style={{ fontSize:14, fontWeight:500, fontVariantNumeric:'tabular-nums' }}>
                  −{window.fmtEur(f.amount).replace('−','')}
                </div>
              </div>
            ))}
          </window.Card>
        </window.Section>
      )}

      {/* Top cats */}
      {catEntries.length > 0 && (
        <window.Section title="Top catégories">
          <window.Card pad={0}>
            {catEntries.map(([cat,val],i) => {
              const pct = totalOut ? val/totalOut*100 : 0;
              return (
                <div key={cat} style={{ padding:'12px 18px', borderTop: i===0?'none':'1px solid var(--line)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <window.CatDot cat={cat}/>
                      <span style={{ fontSize:14, fontWeight:500 }}>{cat}</span>
                    </div>
                    <span style={{ fontVariantNumeric:'tabular-nums', fontWeight:500, fontSize:14 }}>{window.fmtEur(val)}</span>
                  </div>
                  <div style={{ height:3, background:'var(--line)', borderRadius:2 }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:window.CAT_COLORS[cat], borderRadius:2 }}/>
                  </div>
                </div>
              );
            })}
          </window.Card>
        </window.Section>
      )}

      {/* Transactions */}
      <window.Section title="Transactions">
        <window.Card pad={0}>
          {txs.length === 0 ? (
            <div style={{ padding:24, textAlign:'center', color:'var(--muted)', fontSize:13 }}>
              Aucune transaction. Appuie sur + pour ajouter.
            </div>
          ) : txs.map((t,i) => <window.TxRow key={i} tx={t} isLast={i===txs.length-1}/>)}
        </window.Card>
      </window.Section>

      <div style={{ height:80 }}/>
    </div>
  );
}

// ─── Screen "Plus" (Tendances, Catégories, Objectifs, Sauvegarde) ──────
function ScreenMore({ setTab }) {
  const fileRef = useRefX();
  const [msg, setMsg] = useStateX('');

  const exportData = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      store: window.STORE.get(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mi-budget-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Sauvegarde téléchargée. Place-la dans ton OneDrive.');
    setTimeout(() => setMsg(''), 4000);
  };

  const importData = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const text = await f.text();
      const parsed = JSON.parse(text);
      if (!parsed.store) throw new Error('Format invalide');
      if (!confirm('Remplacer toutes les données actuelles par la sauvegarde ?')) return;
      localStorage.setItem('mi:store:v1', JSON.stringify(parsed.store));
      setMsg('Import réussi. Rechargement…');
      setTimeout(() => location.reload(), 800);
    } catch (err) {
      setMsg('Erreur : ' + err.message);
    }
  };

  const reset = () => {
    if (!confirm('Effacer TOUTES les données ajoutées (transactions, gains, transferts) ? Les données initiales restent.')) return;
    window.STORE.reset();
    setMsg('Réinitialisé.');
    setTimeout(() => setMsg(''), 2000);
  };

  const items = [
    { key:'charts', icon:'▲', label:'Tendances', sub:'Graphiques sur 26 mois' },
    { key:'categories', icon:'◐', label:'Catégories', sub:'Répartition détaillée' },
    { key:'goals', icon:'★', label:'Objectifs', sub:'Épargne & projets' },
    { key:'calendar', icon:'▣', label:'Calendrier complet', sub:'Tous les prélèvements' },
  ];

  return (
    <div className="screen">
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:12, color:'var(--muted)', letterSpacing:1.2, textTransform:'uppercase' }}>Plus</div>
        <div style={{ fontSize:28, fontWeight:600, letterSpacing:-0.6, marginTop:4 }}>Outils</div>
      </div>

      <window.Section title="Vues détaillées">
        <window.Card pad={0}>
          {items.map((it,i) => (
            <div key={it.key} onClick={() => setTab(it.key)} style={{
              display:'flex', alignItems:'center', gap:16, padding:'16px 20px', cursor:'pointer',
              borderTop: i===0?'none':'1px solid var(--line)',
            }}>
              <div style={{
                width:40, height:40, borderRadius:10, background:'var(--accent-soft)',
                color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
              }}>{it.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:500 }}>{it.label}</div>
                <div style={{ fontSize:12, color:'var(--muted)' }}>{it.sub}</div>
              </div>
              <span style={{ color:'var(--muted)' }}>›</span>
            </div>
          ))}
        </window.Card>
      </window.Section>

      <window.Section title="Sauvegarde & restauration">
        <window.Card>
          <div style={{ fontSize:13, color:'var(--muted)', marginBottom:14, lineHeight:1.5 }}>
            Tes données sont stockées dans ce navigateur. Pour les sauvegarder ou les transférer,
            exporte un fichier <code style={{background:'var(--chip-bg)', padding:'1px 5px', borderRadius:4, fontSize:11}}>.json</code> et place-le dans ton OneDrive ou Drive.
          </div>
          <div style={{ display:'grid', gap:8 }}>
            <button onClick={exportData} style={{
              padding:'12px 14px', borderRadius:10, border:'none',
              background:'var(--accent)', color:'var(--accent-fg)',
              fontFamily:'inherit', fontSize:14, fontWeight:600, cursor:'pointer',
            }}>↓ Exporter mes données</button>
            <button onClick={() => fileRef.current.click()} style={{
              padding:'12px 14px', borderRadius:10, border:'1px solid var(--line)',
              background:'var(--card)', color:'var(--fg)',
              fontFamily:'inherit', fontSize:14, fontWeight:500, cursor:'pointer',
            }}>↑ Importer depuis un fichier</button>
            <input ref={fileRef} type="file" accept=".json,application/json" style={{display:'none'}} onChange={importData}/>
            <button onClick={reset} style={{
              padding:'12px 14px', borderRadius:10, border:'1px solid var(--line)',
              background:'transparent', color:'var(--neg)',
              fontFamily:'inherit', fontSize:13, cursor:'pointer',
            }}>Réinitialiser les ajouts</button>
          </div>
          {msg && <div style={{
            marginTop:12, padding:'10px 12px', background:'var(--accent-soft)',
            color:'var(--accent)', borderRadius:8, fontSize:12,
          }}>{msg}</div>}
        </window.Card>
      </window.Section>

      <div style={{ height:80 }}/>
    </div>
  );
}

// ─── Unified Add: Dépense / Gain / Transfert / OCR ─────────
function ScreenAdd2({ onClose, monthKey }) {
  const [mode, setMode] = useStateX('depense'); // depense | gain | transfert | ocr
  const [amount, setAmount] = useStateX('');
  const [detail, setDetail] = useStateX('');
  const [cat, setCat] = useStateX('Courses');
  const [txType, setTxType] = useStateX('var'); // var | fixe
  const [fromAcc, setFromAcc] = useStateX('Principal');
  const [toAcc, setToAcc] = useStateX('Compte B');
  const [ocrFile, setOcrFile] = useStateX(null);
  const [ocrResult, setOcrResult] = useStateX(null);
  const [ocrLoading, setOcrLoading] = useStateX(false);
  const [ocrSelected, setOcrSelected] = useStateX({});
  const [todayDay, setTodayDay] = useStateX(new Date().getDate());
  const fileRef = useRefX();

  const save = () => {
    const amt = parseFloat(amount);
    if (!amt || isNaN(amt)) return;
    const mk = monthKey || window.STORE.getCurrentMonth().monthKey;
    const [y, mo] = mk.split('-').map(Number);
    const date = `${mk}-${String(todayDay).padStart(2,'0')}`;

    if (mode === 'depense') {
      window.STORE.addTx({ monthKey: mk, date, day: txType==='fixe'?todayDay:null, detail, amount: amt, category: cat, type: txType });
    } else if (mode === 'gain') {
      window.STORE.addGain({ monthKey: mk, date, detail, amount: amt });
    } else if (mode === 'transfert') {
      window.STORE.addTransfer({ date, from: fromAcc, to: toAcc, amount: amt, note: detail });
    }
    onClose();
  };

  // OCR via Claude
  const runOcr = async (file) => {
    setOcrLoading(true);
    try {
      const b64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(',')[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const resp = await window.claude.complete({
        messages: [{
          role:'user',
          content: [
            { type:'image', source:{ type:'base64', media_type: file.type || 'image/png', data: b64 } },
            { type:'text', text: `Extrais toutes les transactions bancaires visibles dans cette image. Réponds UNIQUEMENT avec un JSON valide de cette forme exacte (pas de markdown, pas d'explication) :
{"transactions":[{"date":"YYYY-MM-DD","detail":"libellé","amount":montant_négatif_pour_débit_ou_positif_pour_crédit}]}
Si aucune date complète visible, utilise null. Les débits doivent être en négatif (ex: -45.20), les crédits en positif.` }
          ]
        }]
      });
      // Parse JSON out of response
      const jsonMatch = resp.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Aucun JSON trouvé dans la réponse');
      const data = JSON.parse(jsonMatch[0]);
      setOcrResult(data);
      const sel = {};
      (data.transactions||[]).forEach((_,i) => sel[i] = true);
      setOcrSelected(sel);
    } catch (e) {
      setOcrResult({ error: e.message });
    } finally {
      setOcrLoading(false);
    }
  };

  const importOcr = () => {
    if (!ocrResult?.transactions) return;
    const mk = monthKey || window.STORE.getCurrentMonth().monthKey;
    ocrResult.transactions.forEach((t,i) => {
      if (!ocrSelected[i]) return;
      if (t.amount < 0) {
        // Dépense
        const cat = autoCategorize(t.detail);
        window.STORE.addTx({
          monthKey: mk,
          date: t.date || `${mk}-01`,
          detail: t.detail,
          amount: Math.abs(t.amount),
          category: cat,
          type: 'var',
        });
      } else if (t.amount > 0) {
        window.STORE.addGain({
          monthKey: mk,
          date: t.date || `${mk}-01`,
          detail: t.detail,
          amount: t.amount,
        });
      }
    });
    onClose();
  };

  const cats = window.CAT_ORDER;
  const accounts = ['Principal', 'Compte B', 'Vacances'];
  const modes = [['depense','Dépense'],['gain','Gain'],['transfert','Transfert'],['ocr','Scan']];

  return (
    <div className="screen">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <button onClick={onClose} style={{...window.iconBtn, width:'auto', padding:'0 14px'}}>Annuler</button>
        <div style={{ fontSize:15, fontWeight:600 }}>Ajouter</div>
        {mode !== 'ocr' ? (
          <button onClick={save} style={{...window.iconBtn, width:'auto', padding:'0 14px', background:'var(--accent)', color:'var(--accent-fg)' }}>Enregistrer</button>
        ) : <div style={{ width:90 }}/>}
      </div>

      {/* Mode switcher */}
      <div style={{
        display:'flex', padding:4, background:'var(--chip-bg)', borderRadius:12, marginBottom:24,
      }}>
        {modes.map(([k,l]) => (
          <button key={k} onClick={() => setMode(k)} style={{
            flex:1, padding:'10px 8px', border:'none', borderRadius:10,
            background: mode===k ? 'var(--card)' : 'transparent',
            color: mode===k ? 'var(--fg)' : 'var(--muted)',
            fontSize:13, fontWeight:500, fontFamily:'inherit', cursor:'pointer',
            boxShadow: mode===k ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}>{l}</button>
        ))}
      </div>

      {mode !== 'ocr' && (
        <>
          <div style={{ textAlign:'center', padding:'16px 0 24px' }}>
            <div style={{
              fontSize:52, fontWeight:600, letterSpacing:-1.8, fontVariantNumeric:'tabular-nums',
              color: amount ? (mode==='gain'?'var(--pos)':'var(--fg)') : 'var(--muted)',
            }}>
              {mode==='gain'?'+':mode==='depense'?'−':''}{amount||'0'} €
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:20 }}>
            {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(k => (
              <button key={k} onClick={() => {
                if (k==='⌫') setAmount(s => s.slice(0,-1));
                else setAmount(s => (s+k).replace(/^0+(\d)/,'$1').replace(/\.\./,'.'));
              }} style={{
                height:48, border:'none', borderRadius:12, background:'var(--card)',
                fontSize:20, fontWeight:500, fontFamily:'inherit', color:'var(--fg)', cursor:'pointer',
              }}>{k}</button>
            ))}
          </div>

          {mode === 'transfert' ? (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:6 }}>De</div>
                  <select value={fromAcc} onChange={e=>setFromAcc(e.target.value)} style={selectStyle}>
                    {accounts.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:6 }}>Vers</div>
                  <select value={toAcc} onChange={e=>setToAcc(e.target.value)} style={selectStyle}>
                    {accounts.filter(a=>a!==fromAcc).map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <input value={detail} onChange={e=>setDetail(e.target.value)} placeholder="Note (facultatif)" style={inputStyle}/>
            </>
          ) : (
            <>
              <input value={detail} onChange={e=>setDetail(e.target.value)}
                placeholder={mode==='gain' ? 'Ex: Salaire, Prime, Remboursement…' : 'Ex: Leclerc, Pakpak, Essence…'}
                style={{...inputStyle, marginBottom:14}}/>

              {mode === 'depense' && (
                <>
                  <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:8 }}>Type</div>
                  <div style={{ display:'flex', gap:6, marginBottom:14 }}>
                    <window.Chip active={txType==='var'} onClick={()=>setTxType('var')}>Variable</window.Chip>
                    <window.Chip active={txType==='fixe'} onClick={()=>setTxType('fixe')}>Prélèvement fixe</window.Chip>
                  </div>

                  <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:8 }}>Catégorie</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {cats.map(c => (
                      <window.Chip key={c} color={window.CAT_COLORS[c]} active={cat===c} onClick={()=>setCat(c)}>{c}</window.Chip>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}

      {mode === 'ocr' && (
        <OcrPanel
          ocrFile={ocrFile} setOcrFile={setOcrFile}
          ocrResult={ocrResult} setOcrResult={setOcrResult}
          ocrLoading={ocrLoading}
          ocrSelected={ocrSelected} setOcrSelected={setOcrSelected}
          fileRef={fileRef}
          runOcr={runOcr}
          importOcr={importOcr}
        />
      )}

      <div style={{ height:80 }}/>
    </div>
  );
}

const selectStyle = {
  width:'100%', padding:'14px 14px', border:'1px solid var(--line)',
  borderRadius:12, background:'var(--card)', color:'var(--fg)',
  fontSize:15, fontFamily:'inherit', outline:'none', boxSizing:'border-box',
};
const inputStyle = {
  width:'100%', padding:'14px 16px', border:'1px solid var(--line)',
  borderRadius:12, background:'var(--card)', color:'var(--fg)',
  fontSize:15, fontFamily:'inherit', outline:'none', boxSizing:'border-box',
};

function OcrPanel({ ocrFile, setOcrFile, ocrResult, setOcrResult, ocrLoading, ocrSelected, setOcrSelected, fileRef, runOcr, importOcr }) {
  return (
    <>
      <input type="file" ref={fileRef} accept="image/*" style={{ display:'none' }}
        onChange={async (e) => {
          const f = e.target.files[0];
          if (!f) return;
          setOcrFile(f);
          setOcrResult(null);
          await runOcr(f);
        }}/>

      {!ocrFile && (
        <button onClick={() => fileRef.current.click()} style={{
          width:'100%', padding:'40px 20px', border:'2px dashed var(--line)',
          borderRadius:16, background:'transparent', color:'var(--muted)',
          fontFamily:'inherit', cursor:'pointer', display:'flex', flexDirection:'column',
          alignItems:'center', gap:10,
        }}>
          <div style={{ fontSize:32 }}>📷</div>
          <div style={{ fontSize:15, fontWeight:500, color:'var(--fg)' }}>Capture d'écran de ton app bancaire</div>
          <div style={{ fontSize:12 }}>Claude extraira les transactions automatiquement</div>
        </button>
      )}

      {ocrFile && (
        <div style={{ marginBottom:16 }}>
          <img src={URL.createObjectURL(ocrFile)} style={{
            width:'100%', maxHeight:220, objectFit:'contain', borderRadius:12,
            background:'var(--card)', border:'1px solid var(--line)',
          }}/>
          <button onClick={() => fileRef.current.click()} style={{
            marginTop:8, width:'100%', padding:'10px', border:'1px solid var(--line)',
            borderRadius:10, background:'transparent', color:'var(--fg)',
            fontFamily:'inherit', fontSize:13, cursor:'pointer',
          }}>Changer d'image</button>
        </div>
      )}

      {ocrLoading && (
        <div style={{ padding:24, textAlign:'center', color:'var(--muted)' }}>
          <div style={{ fontSize:14, marginBottom:4 }}>Extraction en cours…</div>
          <div style={{ fontSize:12 }}>Claude analyse l'image</div>
        </div>
      )}

      {ocrResult?.error && (
        <div style={{
          padding:14, background:'rgba(220,38,38,0.08)', borderRadius:10,
          color:'var(--neg)', fontSize:13, marginBottom:12,
        }}>Erreur: {ocrResult.error}</div>
      )}

      {ocrResult?.transactions && (
        <>
          <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:8 }}>
            {ocrResult.transactions.length} transactions détectées
          </div>
          <window.Card pad={0} style={{ marginBottom:16 }}>
            {ocrResult.transactions.map((t,i) => (
              <label key={i} style={{
                display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
                borderTop: i===0?'none':'1px solid var(--line)', cursor:'pointer',
              }}>
                <input type="checkbox" checked={!!ocrSelected[i]}
                  onChange={e => setOcrSelected(s => ({...s, [i]: e.target.checked}))}
                  style={{ width:18, height:18 }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.detail}</div>
                  <div style={{ fontSize:11, color:'var(--muted)' }}>{t.date || 'date manquante'}</div>
                </div>
                <div style={{
                  fontSize:14, fontWeight:600, fontVariantNumeric:'tabular-nums',
                  color: t.amount < 0 ? 'var(--neg)' : 'var(--pos)',
                }}>{t.amount > 0 ? '+' : ''}{t.amount?.toFixed(2)} €</div>
              </label>
            ))}
          </window.Card>
          <button onClick={importOcr} style={{
            width:'100%', padding:14, border:'none', borderRadius:12,
            background:'var(--accent)', color:'var(--accent-fg)',
            fontWeight:600, fontSize:15, cursor:'pointer', fontFamily:'inherit',
          }}>Importer la sélection</button>
        </>
      )}
    </>
  );
}

function autoCategorize(detail) {
  const s = (detail||'').toLowerCase();
  const rules = [
    ['Courses', /leclerc|franprix|monoprix|carrefour|lidl|aldi|bio c|marche|march\u00e9|jst|arina|amazon|poissonnerie/],
    ['Resto & Café', /macdo|mcdo|quick|kfc|burger|resto|restau|cafe|caf\u00e9|boulangerie|miams|pakpak|cacaw|uber eat|ubereat/],
    ['Transport', /essence|uber|sncf|ratp|parking|peage|p\u00e9age|scooter|auto|retrait/],
    ['Abonnements', /netflix|spotify|apple|orange|free|prime|chatgpt|claude|anthropic|fitness/],
    ['Loisirs', /cin\u00e9ma|cinema|concert|bar|parc|vinted|trade/],
    ['Santé & Beauté', /coiffeur|pharmacie|m\u00e9decin|dentiste/],
    ['Vêtements', /zara|levis|habits|chaussures|ugg|hermes/],
    ['Virements', /virement|maman|mila|compte/],
    ['Logement', /loyer|assurance maison|shurgard|emprunt|frais banque/],
  ];
  for (const [c,r] of rules) if (r.test(s)) return c;
  return 'Autre';
}

// ─── History with "Nouveau mois" button ────────────────────
function ScreenHistory2({ setMonthKey, setTab }) {
  const [, bump] = useStateX(0);
  useEffectX(() => window.STORE.subscribe(() => bump(x => x+1)), []);

  const months = [...window.STORE.getMonths()].reverse();
  const latest = months[0];

  const createNext = () => {
    let ny = latest.year, nm = latest.month + 1;
    if (nm > 12) { nm = 1; ny++; }
    const key = window.STORE.createMonth(ny, nm, latest.monthKey);
    setMonthKey(key);
    setTab('month');
  };

  const avgReste = months.reduce((a,m) => a + (window.STORE.getSummary(m.monthKey)?.reste||0), 0) / months.length;

  return (
    <div className="screen">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:20 }}>
        <div>
          <div style={{ fontSize:12, color:'var(--muted)', letterSpacing:1.2, textTransform:'uppercase' }}>Historique</div>
          <div style={{ fontSize:28, fontWeight:600, letterSpacing:-0.6, marginTop:4 }}>{months.length} mois</div>
        </div>
        <button onClick={createNext} style={{
          padding:'10px 14px', border:'1px solid var(--line)', borderRadius:10,
          background:'var(--card)', color:'var(--fg)', fontFamily:'inherit',
          fontSize:13, fontWeight:500, cursor:'pointer',
        }}>+ Nouveau mois</button>
      </div>

      <window.Card style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:6 }}>Reste moyen</div>
        <div style={{ fontSize:24, fontWeight:600, fontVariantNumeric:'tabular-nums', letterSpacing:-0.4, color: avgReste<0?'var(--neg)':'var(--fg)' }}>
          {window.fmtEur(avgReste, {signed:true})}
        </div>
      </window.Card>

      <window.Section title="Chronologie">
        <window.Card pad={0}>
          {months.map((m, i) => {
            const s = window.STORE.getSummary(m.monthKey);
            const reste = s?.reste || 0;
            return (
              <div key={m.monthKey}
                onClick={() => { setMonthKey(m.monthKey); setTab('month'); }}
                style={{
                  display:'flex', alignItems:'center', gap:14, padding:'14px 18px', cursor:'pointer',
                  borderTop: i===0?'none':'1px solid var(--line)',
                }}>
                <div style={{ width:46, textAlign:'center' }}>
                  <div style={{ fontSize:20, fontWeight:600, letterSpacing:-0.3 }}>{String(m.month).padStart(2,'0')}</div>
                  <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:0.4 }}>{m.year}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:500 }}>
                    {m.label} {m.userCreated && <span style={{ fontSize:9, padding:'2px 6px', background:'var(--accent-soft)', color:'var(--accent)', borderRadius:4, marginLeft:4 }}>NOUVEAU</span>}
                  </div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>
                    {window.fmtEur(s?.totalGains||0)} · −{window.fmtEur(s?.totalFixes + s?.totalVar).replace('−','')}
                  </div>
                </div>
                <div style={{ fontSize:15, fontWeight:600, fontVariantNumeric:'tabular-nums', color: reste<0?'var(--neg)':'var(--pos)' }}>
                  {window.fmtEur(reste, {signed:true})}
                </div>
              </div>
            );
          })}
        </window.Card>
      </window.Section>
      <div style={{ height:80 }}/>
    </div>
  );
}

// Override
Object.assign(window, {
  ScreenMonth: ScreenMonth2,
  ScreenAdd: ScreenAdd2,
  ScreenHistory: ScreenHistory2,
  ScreenMore,
});
