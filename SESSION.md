# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. Lis ce fichier au début de chaque session avant de répondre.

---

## Identité du projet

**Nom** : Mani Budget Pro (`mbp.`)
**Type** : Application web budgétaire personnelle — interface mobile-first + desktop sidebar
**Langue UI** : Français
**URL Worker** : `https://manibudgetpro.emmanueldelasse.workers.dev`
**Repo** : `emmanueldelasse-droid/mani-budget-pro`

---

## Stack technique

| Couche | Technologie |
|--------|------------|
| UI | React 18 via CDN (UMD) + Babel Standalone (pas de bundler) |
| Styles | CSS-in-JS inline, variables CSS (`--bg`, `--card`, `--accent`…) |
| Données statiques | `data/budget.json` (mois archivés avec dépenses/gains) |
| Persistence cloud | Cloudflare Workers KV (`/budget` POST/GET avec `X-Budget-Token`) |
| Persistence locale | `localStorage` (`mi:store:v1`, `mi:token`, `mi:tab`, `mi:month`) |
| Auth | Token secret + WebAuthn optionnel (Face ID / Touch ID) |

---

## Architecture des fichiers

```
mani-budget-pro/
├── index.html          — Bootstrap HTML, chargement CDN React + Babel
├── SESSION.md          — Ce fichier (continuité IA)
├── data/
│   └── budget.json     — Données statiques des mois archivés
└── components/
    ├── data.jsx        — Chargement budget.json, helpers window.fmtEur, window.CAT_COLORS…
    ├── store.jsx       — Store global (window.STORE), sync KV ↔ localStorage
    ├── app.jsx         — App root : LockScreen, App, DesktopShell, TweaksPanel
    ├── screens.jsx     — Écrans : Home, Mois, Comptes, Historique + primitives UI
    └── screens2.jsx    — Écrans secondaires : Add, Charts, Categories, Goals, More
```

### Ordre de chargement (important — pas de bundler)
1. `data.jsx` → expose `window.__budgetReady`, `window.BUDGET`, `window.MONTH_FR`, helpers
2. `store.jsx` → attend `__budgetReady`, expose `window.__storeReady`, `window.STORE`
3. `screens.jsx` → composants React (Card, Section, TxRow, ScreenHome, ScreenMois…)
4. `screens2.jsx` → composants React (ScreenAdd, ScreenCharts, ScreenGoals, ScreenMore…)
5. `app.jsx` → attend `__storeReady`, monte `<App/>` dans `#root`

---

## Fonctionnalités implémentées

### Navigation (5 onglets + FAB)
- **Accueil** (`ScreenHome`) — résumé du mois courant, solde, mini-graphes
- **Mois** (`ScreenMois`) — détail dépenses fixes + variables + gains, navigation mois
- **Comptes** (`ScreenAccounts`) — vue comptes (Compte A, Compte B)
- **Historique** (`ScreenHistory`) — liste chronologique toutes transactions
- **Plus** (`ScreenMore`) — paramètres, déconnexion, reset

### Gestion des données
- Ajout de transactions : fixes (jour du mois) ou variables (date précise)
- Ajout de gains
- Transferts entre comptes
- Création de nouveaux mois (avec copie des charges fixes + report découvert)
- Suppression de transactions ajoutées (les données statiques de `budget.json` sont en lecture seule)
- Déduplication via `addTxSafe` / `addGainSafe`

### Thèmes et personnalisation (TweaksPanel)
- 4 thèmes : `editorial` (défaut), `minimal`, `fintech`, `terminal`
- 6 accents : rouille (défaut), indigo, vert, rose, ambre, cyan
- 4 polices : serif (Fraunces), sans (Inter), mono (JetBrains Mono), grotesk (Space Grotesk)
- 2 densités : compact, confortable

### Sécurité & Sync
- Lock screen avec token → vérification côté Worker (`GET /budget`)
- Face ID / Touch ID via WebAuthn (optionnel, si plateforme supportée)
- Sync cloud Cloudflare KV au démarrage (`syncFromCloud`)
- Toute écriture : localStorage + Cloudflare KV en parallèle

---

## Patterns et conventions clés

- **Pas de bundler** : tout est chargé via `<script type="text/babel">`, les composants sont globaux
- **Globals window** : `window.BUDGET`, `window.STORE`, `window.MONTH_FR`, `window.fmtEur`, `window.CAT_COLORS`, `window.CURRENT_MONTH`, `window.MI_WORKER_URL`
- **Promesses de boot** : `window.__budgetReady` puis `window.__storeReady` (chaîne async)
- **Édition mode** : communication `postMessage` avec la page parente pour activer le TweaksPanel
- Les données de `budget.json` sont **immuables** — les ajouts vont dans `state.addedTx` / `state.addedGains`

---

## État actuel du projet

**Date de la dernière session** : 2026-06-13
**IA utilisée** : Claude (claude-sonnet-4-6)

### Ce qui fonctionne
- Application complète et fonctionnelle
- Auth + lock screen + biométrie
- Sync Cloudflare KV
- 5 onglets + FAB ajout
- Thèmes, accents, polices
- Création/navigation de mois
- CRUD transactions (ajout + suppression)

### Prochaine étape prioritaire
**À définir avec l'utilisateur** — aucune tâche en cours au moment de la création de ce fichier.

---

## Commandes utiles

```bash
# Lancer localement (serveur statique simple)
python3 -m http.server 8080
# puis ouvrir http://localhost:8080

# Déployer le Worker Cloudflare (si dossier worker séparé)
wrangler deploy
```

---

## Notes importantes

- Le Worker Cloudflare doit valider le `X-Budget-Token` en header — sans token valide, `/budget` retourne 401
- `budget.json` contient les données historiques figées ; toute modification utilisateur va dans le store KV
- WebAuthn (`rpId`) dépend du `window.location.hostname` — ne fonctionne pas sur `localhost` sans configuration spéciale
- Le mode édition (`editMode`) est activé par `postMessage({ type: '__activate_edit_mode' })` depuis la page parente

---

*Généré automatiquement — mettre à jour en fin de chaque session.*
