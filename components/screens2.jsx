// screens2.jsx — ScreenAdd (dépense manuelle + fixe + OCR) + ScreenMore

const { useState: u2, useEffect: ue2, useRef: ur2 } = React;

// ── Auto-catégorisation ──────────────────────────────────────
function autoCategorize(detail) {
  const s = (detail||'').toLowerCase();
  const rules = [
    ['Logement',       /loyer|assurance maison|shurgard|emprunt|frais banque|samu social/],
    ['Courses',        /leclerc|franprix|monoprix|carrefour|lidl|aldi|bio c|march|jst|arina|amazon|poissonnerie|intermarche|casino/],
    ['Resto & Café',   /macdo|mcdo|quick|kfc|burger|resto|restau|cafe|caf|boulangerie|miams|pakpak|cacaw|uber eat|ubereat|deliveroo|just eat/],
    ['Transport',      /essence|uber|sncf|ratp|parking|peage|scooter|auto|retrait|navigo/],
    ['Abonnements',    /netflix|spotify|apple|orange|free|prime|chatgpt|claude|anthropic|fitness|sfr|bouygues|deezer|disney/],
    ['Loisirs',        /cinema|concert|bar|parc|vinted|trade|fnac|steam|jeux/],
    ['Santé & Beauté', /coiffeur|pharmacie|medecin|dentiste|docteur|sephora/],
    ['Vêtements',      /zara|levis|habits|chaussures|ugg|hermes|primark|h&m|uniqlo/],
    ['Assurances',     /assurance|mutuelle/],
    ['Virements',      /virement|maman|mila|compte/],
    ['Frais',          /frais|commission|cotis/],
  ];
  for (const [c,r] of rules) if (r.test(s)) return c;
  return 'Autre';
}

// ── OCR Panel (Société Générale + Revolut) ───────────────────
function OcrPanel({ ocrFile, setOcrFile, ocrResult, setOcrResult, ocrLoading, ocrSelected, setOcrSelected, fileRef, runOcr, importOcr, dupCount }) {
  return (
    <>
      <input type="file" ref={fileRef} accept="image/*" style={{ display:'none' }}
        onChange={async e => {
          const f = e.target.files[0];
          if (!f) return;
          setOcrFile(f); setOcrResult(null);
          await runOcr(f);
        }}/>

      {!ocrFile && (
        <button onClick={()=>fileRef.current.click()} style={{
          width:'100%', padding:'40px 20px', border:'2px dashed var(--line)',
          borderRadius:16, background:'transparent', color:'var(--muted)',
          fontFamily:'inherit', cursor:'pointer', display:'flex', flexDirection:'column',
          alignItems:'center', gap:10,
        }}>
          <div style={{ fontSize:32 }}>📷</div>
          <div style={{ fontSize:15, fontWeight:500, color:'var(--fg)' }}>Screenshot de ton app bancaire</div>
          <div style={{ fontSize:12 }}>Société Générale · Revolut</div>
          <div style={{ fontSize:11 }}>Claude extrait les transactions automatiquement</div>
        </button>
      )}

      {ocrFile && (
        <div style={{ marginBottom:14 }}>
          <img src={URL.createObjectURL(ocrFile)} style={{ width:'100%', maxHeight:200, objectFit:'contain', borderRadius:12, background:'var(--card)', border:'1px solid var(--line)' }}/>
          <button onClick={()=>fileRef.current.click()} style={{ marginTop:8, width:'100%', padding:10, border:'1px solid var(--line)', borderRadius:10, background:'transparent', color:'var(--fg)', fontFamily:'inherit', fontSize:13, cursor:'pointer' }}>
            Changer d'image
          </button>
        </div>
      )}

      {ocrLoading && (
        <div style={{ padding:24, textAlign:'center', color:'var(--muted)' }}>
          <div style={{ fontSize:14, marginBottom:4 }}>Analyse en cours…</div>
          <div style={{ fontSize:12 }}>Claude lit l'image</div>
        </div>
      )}

      {ocrResult?.error && (
        <div style={{ padding:14, background:'rgba(220,38,38,0.08)', borderRadius:10, color:'var(--neg)', fontSize:13, marginBottom:12 }}>
          Erreur : {ocrResult.error}
        </div>
      )}

      {ocrResult?.transactions && (
        <>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase' }}>
              {ocrResult.transactions.length} transaction{ocrResult.transactions.length>1?'s':''} détectée{ocrResult.transactions.length>1?'s':''}
            </div>
            {dupCount>0 && <div style={{ fontSize:11, color:'var(--neg)' }}>{dupCount} doublon{dupCount>1?'s':''} détecté{dupCount>1?'s':''}</div>}
          </div>
          <window.Card pad={0} style={{ marginBottom:14 }}>
            {ocrResult.transactions.map((t,i)=>{
              const isDup = ocrResult.duplicates?.[i];
              return (
                <label key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderTop:i===0?'none':'1px solid var(--line)', cursor:'pointer', opacity:isDup?0.45:1 }}>
                  <input type="checkbox" checked={!!ocrSelected[i]} disabled={isDup}
                    onChange={e=>setOcrSelected(s=>({...s,[i]:e.target.checked}))}
                    style={{ width:18, height:18 }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.detail}</div>
                    <div style={{ fontSize:11, color:'var(--muted)', display:'flex', gap:6 }}>
                      <span>{t.date||'date ?'}</span>
                      <span>·</span>
                      <span style={{ color:window.CAT_COLORS[autoCategorize(t.detail)]||'var(--muted)' }}>{autoCategorize(t.detail)}</span>
                      {isDup && <span style={{ color:'var(--neg)' }}>· doublon</span>}
                    </div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:600, fontVariantNumeric:'tabular-nums', color:t.amount<0?'var(--neg)':'var(--pos)', flexShrink:0 }}>
                    {t.amount>0?'+':''}{t.amount?.toFixed(2)} €
                  </div>
                </label>
              );
            })}
          </window.Card>
          <button onClick={importOcr} style={{ width:'100%', padding:14, border:'none', borderRadius:12, background:'var(--accent)', color:'var(--accent-fg)', fontWeight:600, fontSize:15, cursor:'pointer', fontFamily:'inherit' }}>
            Importer la sélection ({Object.values(ocrSelected).filter(Boolean).length})
          </button>
        </>
      )}
    </>
  );
}

// ── Screen : Ajout ──────────────────────────────────────────
function ScreenAdd({ onClose, monthKey }) {
  const [mode, setMode]   = u2('depense'); // depense | gain | transfert | ocr
  const [amount, setAmount] = u2('');
  const [detail, setDetail] = u2('');
  const [cat, setCat]     = u2('Courses');
  const [txType, setTxType] = u2('var'); // var | fixe
  const [fixDay, setFixDay] = u2(new Date().getDate());
  const [fromAcc, setFromAcc] = u2('Principal');
  const [toAcc, setToAcc]   = u2('Compte B');
  const [ocrFile, setOcrFile] = u2(null);
  const [ocrResult, setOcrResult] = u2(null);
  const [ocrLoading, setOcrLoading] = u2(false);
  const [ocrSelected, setOcrSelected] = u2({});
  const fileRef = ur2();

  const mk = monthKey || window.STORE.getCurrentMonth().monthKey;

  const save = () => {
    const amt = parseFloat(amount);
    if (!amt || isNaN(amt)) return;
    const today = new Date();
    const date  = `${mk}-${String(today.getDate()).padStart(2,'0')}`;

    if (mode==='depense') {
      window.STORE.addTx({ monthKey:mk, date, day:txType==='fixe'?fixDay:null, detail, amount:amt, category:cat, type:txType });
    } else if (mode==='gain') {
      window.STORE.addGain({ monthKey:mk, date, detail, amount:amt });
    } else if (mode==='transfert') {
      window.STORE.addTransfer({ date, from:fromAcc, to:toAcc, amount:amt, note:detail });
    }
    onClose();
  };

  // OCR via Claude API
  const runOcr = async file => {
    setOcrLoading(true);
    try {
      const b64 = await new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result.split(',')[1]); r.onerror=rej; r.readAsDataURL(file); });
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'anthropic-version':'2023-06-01', 'anthropic-dangerous-direct-browser-access':'true' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: [
              { type:'image', source:{ type:'base64', media_type:file.type||'image/png', data:b64 } },
              { type:'text', text:`Tu es un assistant qui extrait des transactions bancaires depuis des screenshots d'apps bancaires françaises (Société Générale, Revolut, etc.).

Extrais TOUTES les transactions visibles. Réponds UNIQUEMENT avec du JSON valide sans markdown :
{"transactions":[{"date":"YYYY-MM-DD","detail":"libellé exact","amount":-45.20}]}

Règles :
- Les débits (paiements) = montant NÉGATIF
- Les crédits (virements reçus, remboursements) = montant POSITIF  
- Si la date n'est pas complète, utilise le mois courant ${mk}
- Garde le libellé exact tel qu'il apparaît dans l'app
- Ignore les soldes, les totaux, les en-têtes — uniquement les lignes de transaction` }
            ]
          }]
        })
      });
      const data = await resp.json();
      const text = data.content?.map(c=>c.text||'').join('') || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Aucun JSON dans la réponse');
      const parsed = JSON.parse(jsonMatch[0]);

      // Détection doublons
      const duplicates = {};
      (parsed.transactions||[]).forEach((t,i)=>{
        if (t.amount<0) {
          const exists = window.STORE.get().addedTx.some(x =>
            x.monthKey===mk &&
            x.detail?.toLowerCase().trim()===t.detail?.toLowerCase().trim() &&
            Math.abs(x.amount)===Math.abs(t.amount)
          );
          if (exists) duplicates[i]=true;
        }
      });
      parsed.duplicates = duplicates;

      setOcrResult(parsed);
      const sel={};
      (parsed.transactions||[]).forEach((_,i)=>{ if(!duplicates[i]) sel[i]=true; });
      setOcrSelected(sel);
    } catch(e) {
      setOcrResult({ error:e.message });
    } finally {
      setOcrLoading(false);
    }
  };

  const importOcr = () => {
    if (!ocrResult?.transactions) return;
    let added=0, skipped=0;
    ocrResult.transactions.forEach((t,i)=>{
      if (!ocrSelected[i]) return;
      if (t.amount<0) {
        const ok = window.STORE.addTxSafe({ monthKey:mk, date:t.date||`${mk}-01`, detail:t.detail, amount:Math.abs(t.amount), category:autoCategorize(t.detail), type:'var' }, mk);
        ok ? added++ : skipped++;
      } else if (t.amount>0) {
        const ok = window.STORE.addGainSafe({ monthKey:mk, date:t.date||`${mk}-01`, detail:t.detail, amount:t.amount }, mk);
        ok ? added++ : skipped++;
      }
    });
    onClose();
  };

  const cats     = window.CAT_ORDER;
  const accounts = ['Principal','Compte B','Vacances'];
  const modes    = [['depense','Dépense'],['gain','Entrée'],['transfert','Virement'],['ocr','Scan 📷']];
  const dupCount = Object.values(ocrResult?.duplicates||{}).filter(Boolean).length;

  const inputStyle = { width:'100%', padding:'13px 14px', border:'1px solid var(--line)', borderRadius:12, background:'var(--card)', color:'var(--fg)', fontSize:15, fontFamily:'inherit', outline:'none', boxSizing:'border-box' };
  const selectStyle = { ...inputStyle };

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <button onClick={onClose} style={{...window.iconBtn, width:'auto', padding:'0 14px'}}>Annuler</button>
        <div style={{ fontSize:15, fontWeight:600 }}>Ajouter</div>
        {mode!=='ocr'
          ? <button onClick={save} style={{...window.iconBtn, width:'auto', padding:'0 14px', background:'var(--accent)', color:'var(--accent-fg)'}}>Enregistrer</button>
          : <div style={{ width:80 }}/>}
      </div>

      {/* Mode tabs */}
      <div style={{ display:'flex', padding:4, background:'var(--chip-bg)', borderRadius:12, marginBottom:22 }}>
        {modes.map(([k,l])=>(
          <button key={k} onClick={()=>setMode(k)} style={{ flex:1, padding:'9px 4px', border:'none', borderRadius:10, background:mode===k?'var(--card)':'transparent', color:mode===k?'var(--fg)':'var(--muted)', fontSize:12, fontWeight:500, fontFamily:'inherit', cursor:'pointer', boxShadow:mode===k?'0 1px 3px rgba(0,0,0,0.08)':'none' }}>{l}</button>
        ))}
      </div>

      {mode==='ocr' && (
        <OcrPanel
          ocrFile={ocrFile} setOcrFile={setOcrFile}
          ocrResult={ocrResult} setOcrResult={setOcrResult}
          ocrLoading={ocrLoading}
          ocrSelected={ocrSelected} setOcrSelected={setOcrSelected}
          fileRef={fileRef} runOcr={runOcr} importOcr={importOcr}
          dupCount={dupCount}
        />
      )}

      {mode!=='ocr' && (
        <>
          {/* Montant */}
          <div style={{ textAlign:'center', padding:'14px 0 20px' }}>
            <div style={{ fontSize:50, fontWeight:600, letterSpacing:-2, fontVariantNumeric:'tabular-nums', color:amount?(mode==='gain'?'var(--pos)':'var(--fg)'):'var(--muted)' }}>
              {mode==='gain'?'+':mode==='depense'?'−':''}{amount||'0'} €
            </div>
          </div>

          {/* Pavé numérique */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:7, marginBottom:18 }}>
            {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map(k=>(
              <button key={k} onClick={()=>{ if(k==='⌫') setAmount(s=>s.slice(0,-1)); else setAmount(s=>(s+k).replace(/^0+(\d)/,'$1').replace(/\.\./,'.')); }}
                style={{ height:48, border:'none', borderRadius:12, background:'var(--card)', fontSize:20, fontWeight:500, fontFamily:'inherit', color:'var(--fg)', cursor:'pointer' }}>{k}</button>
            ))}
          </div>

          {/* Détail */}
          <input value={detail} onChange={e=>setDetail(e.target.value)}
            placeholder={mode==='gain'?'Ex: Salaire, Prime…':'Ex: Leclerc, Pakpak…'}
            style={{...inputStyle, marginBottom:14}}/>

          {mode==='depense' && (
            <>
              {/* Variable / Fixe */}
              <div style={{ display:'flex', gap:6, marginBottom:14 }}>
                <window.Chip active={txType==='var'} onClick={()=>setTxType('var')}>Variable</window.Chip>
                <window.Chip active={txType==='fixe'} onClick={()=>setTxType('fixe')}>Prélèvement fixe</window.Chip>
              </div>

              {/* Jour du prélèvement (fixe seulement) */}
              {txType==='fixe' && (
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:6 }}>Jour du prélèvement</div>
                  <input type="number" min={1} max={31} value={fixDay} onChange={e=>setFixDay(parseInt(e.target.value))}
                    style={{...inputStyle, width:100}}/>
                </div>
              )}

              {/* Catégories */}
              <div style={{ fontSize:11, color:'var(--muted)', letterSpacing:0.5, textTransform:'uppercase', marginBottom:8 }}>Catégorie</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:4 }}>
                {cats.map(c=><window.Chip key={c} color={window.CAT_COLORS[c]} active={cat===c} onClick={()=>setCat(c)}>{c}</window.Chip>)}
              </div>
            </>
          )}

          {mode==='transfert' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div>
                <div style={{ fontSize:11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:0.5, marginBottom:6 }}>De</div>
                <select value={fromAcc} onChange={e=>setFromAcc(e.target.value)} style={selectStyle}>
                  {accounts.map(a=><option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize:11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:0.5, marginBottom:6 }}>Vers</div>
                <select value={toAcc} onChange={e=>setToAcc(e.target.value)} style={selectStyle}>
                  {accounts.filter(a=>a!==fromAcc).map(a=><option key={a}>{a}</option>)}
                </select>
              </div>
            </div>
          )}
        </>
      )}

      <div style={{ height:80 }}/>
    </div>
  );
}

// ── Screen : Plus ────────────────────────────────────────────
function ScreenMore({ setTab, onLogout }) {
  const fileRef = ur2();
  const [msg, setMsg] = u2('');

  const exportData = () => {
    const data = { version:1, exportedAt:new Date().toISOString(), store:window.STORE.get() };
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href=url; a.download=`mani-budget-${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
    setMsg('Export téléchargé.'); setTimeout(()=>setMsg(''),3000);
  };

  const importData = async e => {
    const f = e.target.files[0]; if(!f) return;
    try {
      const text = await f.text();
      const parsed = JSON.parse(text);
      if (!parsed.store) throw new Error('Format invalide');
      if (!confirm('Remplacer toutes les données actuelles ?')) return;
      localStorage.setItem('mi:store:v1', JSON.stringify(parsed.store));
      setMsg('Import réussi. Rechargement…');
      setTimeout(()=>location.reload(),800);
    } catch(err) { setMsg('Erreur : '+err.message); }
  };

  const reset = () => {
    if (!confirm('Effacer toutes les transactions ajoutées ?')) return;
    window.STORE.reset(); setMsg('Réinitialisé.'); setTimeout(()=>setMsg(''),2000);
  };

  const items=[
    {key:'charts',icon:'▲',label:'Tendances',sub:'Graphiques sur tous les mois'},
    {key:'categories',icon:'◐',label:'Catégories',sub:'Répartition détaillée'},
    {key:'goals',icon:'★',label:'Objectifs',sub:'Épargne & projets'},
  ];

  return (
    <div className="screen">
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:10, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase' }}>Plus</div>
        <div style={{ fontSize:26, fontWeight:600, letterSpacing:-0.5 }}>Outils</div>
      </div>

      <window.Section title="Vues">
        <window.Card pad={0}>
          {items.map((it,i)=>(
            <div key={it.key} onClick={()=>setTab(it.key)} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', cursor:'pointer', borderTop:i===0?'none':'1px solid var(--line)' }}>
              <div style={{ width:38, height:38, borderRadius:10, background:'var(--accent-soft)', color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{it.icon}</div>
              <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:500 }}>{it.label}</div><div style={{ fontSize:11, color:'var(--muted)' }}>{it.sub}</div></div>
              <span style={{ color:'var(--muted)' }}>›</span>
            </div>
          ))}
        </window.Card>
      </window.Section>

      <window.Section title="Données">
        <window.Card>
          <div style={{ display:'grid', gap:8 }}>
            <button onClick={exportData} style={{ padding:'12px 14px', borderRadius:10, border:'none', background:'var(--accent)', color:'var(--accent-fg)', fontFamily:'inherit', fontSize:14, fontWeight:600, cursor:'pointer' }}>↓ Exporter</button>
            <button onClick={()=>fileRef.current.click()} style={{ padding:'12px 14px', borderRadius:10, border:'1px solid var(--line)', background:'var(--card)', color:'var(--fg)', fontFamily:'inherit', fontSize:14, cursor:'pointer' }}>↑ Importer</button>
            <input ref={fileRef} type="file" accept=".json" style={{display:'none'}} onChange={importData}/>
            <button onClick={reset} style={{ padding:'12px 14px', borderRadius:10, border:'1px solid var(--line)', background:'transparent', color:'var(--neg)', fontFamily:'inherit', fontSize:13, cursor:'pointer' }}>Réinitialiser les ajouts</button>
          </div>
          {msg && <div style={{ marginTop:10, padding:'10px 12px', background:'var(--accent-soft)', color:'var(--accent)', borderRadius:8, fontSize:12 }}>{msg}</div>}
        </window.Card>
      </window.Section>

      <window.Section title="Compte">
        <window.Card>
          <button onClick={onLogout} style={{ width:'100%', padding:'12px 14px', borderRadius:10, border:'1px solid var(--line)', background:'transparent', color:'var(--muted)', fontFamily:'inherit', fontSize:14, cursor:'pointer' }}>
            Déverrouiller / Changer de token
          </button>
        </window.Card>
      </window.Section>

      <div style={{ height:80 }}/>
    </div>
  );
}

Object.assign(window, { ScreenAdd, ScreenMore });
