# SESSION.md — Mani Budget Pro

## Projet
Application de suivi budgétaire personnel, mobile-first, déployée en tant que page HTML statique avec React 18 (Babel standalone, pas de bundler). Données persistées via Cloudflare KV (worker `manibudgetpro.emmanueldelasse.workers.dev`).

---

## État actuel — 2026-06-07
**IA utilisée :** Claude (claude-sonnet-4-6)  
**Branche active :** `claude/youthful-davinci-UwKag`

### Architecture des fichiers
```
Mani-Budget-Pro/
├── index.html              ← Point d'entrée, charge les scripts Babel
├── data/
│   └── budget.json         ← Données statiques des mois archivés
└── components/
    ├── data.jsx            ← Chargement budget.json + helpers (fmtEur, CAT_COLORS…)
    ├── store.jsx           ← Store global : Cloudflare KV + localStorage, CRUD transactions
    ├── screens.jsx         ← Primitives UI + écrans : Accueil, Mois, Comptes, Historique
    ├── screens2.jsx        ← ScreenAdd (saisie manuelle, charges fixes, OCR), ScreenMore
    └── app.jsx             ← App root : lock screen, tabs, themes, TweaksPanel, DesktopShell
```

### Fonctionnalités en place
- **Lock screen** avec WebAuthn (Face ID / Touch ID) + fallback token texte
- **5 onglets** : Accueil, Mois, Comptes, Historique, Plus
- **Synchro Cloudflare KV** : `syncFromCloud()` au déverrouillage, `cloudSave()` à chaque mutation
- **Création de mois** : `createNextMonth()` copie les charges fixes et reporte le découvert éventuel
- **Déduplication** : `addTxSafe()` / `addGainSafe()` évitent les doublons par (detail, montant, mois)
- **OCR import** : analyse de screenshots Société Générale / Revolut (plusieurs photos simultanées)
- **Auto-catégorisation** : règles regex pour 12 catégories
- **Thèmes** : Éditorial, Minimal, Fintech, Terminal — 6 accents, 4 polices, 2 densités
- **TweaksPanel** : édition en direct des tweaks depuis un iframe parent (mode éditeur)
- **DesktopShell** : layout sidebar fixe au-dessus de 900 px

### Variables / constantes clés
- `window.MI_WORKER_URL` = `'https://manibudgetpro.emmanueldelasse.workers.dev'`
- `window.BUDGET` — données budget.json brutes
- `window.CURRENT_MONTH` — dernier mois chronologique
- `window.STORE` — instance du store exposé globalement
- `window.__storeReady` / `window.__budgetReady` — Promises d'initialisation
- Token d'accès stocké dans `localStorage('mi:token')`
- État UI persisté : `localStorage('mi:tab')`, `localStorage('mi:month')`
- Store KV local : `localStorage('mi:store:v1')`

---

## Tâches accomplies dans cette session
- Création du fichier SESSION.md initial documentant l'architecture complète du projet

---

## Bugs connus / points d'attention
- L'OCR est câblé dans screens2.jsx mais la fonction `runOcrMultiple` doit être définie dans le scope de `ScreenAdd` (vérifier la portée si OCR ne fonctionne pas)
- `window.CURRENT_MONTH` vient de `budget.json` et ne reflète pas les mois créés dynamiquement par `createNextMonth` — utiliser `store.getCurrentMonth()` à la place
- La biométrie WebAuthn nécessite un rpId valide (`window.location.hostname`) — ne fonctionne pas en `file://` ni en `localhost` sans HTTPS

---

## Prochaine étape prioritaire
Vérifier et compléter l'écran **ScreenGoals** (objectifs d'épargne) référencé dans `app.jsx` (`case 'goals': return <ScreenGoals/>`) — s'assurer qu'il est bien défini dans screens2.jsx ou screens.jsx et qu'il utilise `state.goals` du store.

---

## Contexte pour reprendre
- Pas de `npm install` nécessaire : tout tourne en HTML+Babel standalone
- Pour tester : ouvrir `index.html` via un serveur local (ex. `python3 -m http.server 8080`) car `fetch()` sur `data/budget.json` requiert HTTP
- Le worker Cloudflare attend l'en-tête `X-Budget-Token` sur chaque requête `/budget` (GET et POST)
- Le repo GitHub : `emmanueldelasse-droid/Mani-Budget-Pro`
