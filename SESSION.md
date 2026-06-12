# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. Lis ce fichier au début de chaque session avant de toucher au code.

---

## Projet

**Mani Budget Pro (mbp.)** — Application web de gestion budgétaire personnelle, en français.
Interface mobile-first + desktop, thèmes multiples, sync cloud Cloudflare.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 via CDN + Babel standalone (pas de build) |
| Fichiers | JSX bruts servis directement par GitHub Pages |
| Backend | Cloudflare Worker (`manibudgetpro.emmanueldelasse.workers.dev`) |
| Stockage | Cloudflare KV (cloud) + localStorage (local fallback) |
| Auth | Token secret + WebAuthn (Face ID / Touch ID) |
| Fonts | Fraunces (défaut), Inter, JetBrains Mono, Space Grotesk (Google Fonts) |

---

## Architecture des fichiers

```
Mani-Budget-Pro/
├── index.html              ← entrée, charge React/Babel + JSX dans l'ordre
├── SESSION.md              ← ce fichier
├── data/
│   └── budget.json         ← données budget statiques (mois archivés)
└── components/
    ├── data.jsx            ← charge budget.json, helpers globaux (fmtEur, CAT_COLORS…)
    ├── store.jsx           ← persistance KV + localStorage, API du store
    ├── screens.jsx         ← ScreenHome, ScreenMois, ScreenAccounts, ScreenHistory + primitives UI
    ├── screens2.jsx        ← ScreenAdd, ScreenMore, OCR, auto-catégorisation
    └── app.jsx             ← App, LockScreen, DesktopShell, TweaksPanel, thèmes, routing par onglets
```

**Ordre de chargement obligatoire** : `data.jsx` → `store.jsx` → `screens.jsx` → `screens2.jsx` → `app.jsx`

---

## Fonctionnalités existantes

- **5 onglets** : Accueil · Mois · Comptes · Historique · Plus
- **Screens bonus** (accessibles via routing interne) : Charts · Catégories · Objectifs
- **Lock screen** : token manuel ou biométrie WebAuthn (Face ID / Touch ID)
- **ScreenAdd** : ajout dépense fixe ou variable + OCR screenshot (SG / Revolut)
- **Auto-catégorisation** par règles regex sur le libellé
- **Thèmes** : editorial (défaut) · minimal · fintech · terminal
- **Accents** : rouille · indigo · vert · rose · ambre · cyan
- **Densité** : confortable / compact
- **Mode desktop** : sidebar 220px + main content, responsive ≥ 900px
- **Sync cloud** : au déverrouillage, syncFromCloud() depuis le Worker
- **Edit mode** : TweaksPanel activé via `postMessage` depuis un iframe parent

---

## Globals exposés par data.jsx

| Global | Description |
|--------|-------------|
| `window.BUDGET` | objet JSON complet avec `months[]` |
| `window.CURRENT_MONTH` | dernier mois du tableau |
| `window.MONTH_FR` | noms des mois en français |
| `window.fmtEur(n)` | formatage montant en euros |
| `window.fmtEurCompact(n)` | version compacte (k€) |
| `window.CAT_COLORS` | mapping catégorie → couleur CSS |
| `window.__budgetReady` | Promise résolue quand data.jsx est prêt |
| `window.__storeReady` | Promise résolue quand store.jsx est prêt |
| `window.MI_WORKER_URL` | URL du Cloudflare Worker |

---

## Store API (window.__storeReady → store)

```js
store.get()                          // état complet
store.subscribe(fn)                  // écoute les changements
store.syncFromCloud()                // pull depuis KV
store.addTransaction(tx, monthKey)   // ajoute une dépense
store.addGain(gain, monthKey)        // ajoute un revenu
store.deleteTransaction(id)          // supprime
store.addTransfer(t)                 // virement entre comptes
store.addNewMonth(m)                 // nouveau mois
store.setGoals(goals)                // objectifs
// + compteBEntries, newMonths, transfers dans state
```

---

## État actuel (2026-06-12)

- **Branche de travail** : `claude/youthful-davinci-8ku6ln`
- **Branche principale** : `main`
- App fonctionnelle : lock screen, navigation, thèmes, sync cloud opérationnels
- `data/budget.json` présent et chargé
- Pas de tests automatisés (app statique, pas de build)

---

## Prochaine étape prioritaire

> À définir avec l'utilisateur au début de la prochaine session.

---

## Historique des sessions

| Date | IA | Travail effectué |
|------|----|-----------------|
| 2026-06-12 | Claude (Sonnet 4.6) | Création du fichier SESSION.md initial — cartographie complète de l'architecture |

---

## Notes importantes

- **Pas de bundler** : tout import/export ES module est interdit. Tout est global via `window.*`.
- **Babel standalone** : le JSX est transpilé dans le navigateur. Aucune étape de build locale.
- **Déploiement** : GitHub Pages (fichiers statiques). Pusher sur `main` suffit pour déployer.
- **Token d'accès** : stocké dans `localStorage['mi:token']`, transmis en header `X-Budget-Token`.
- **Dedup des transactions** : basé sur `detail (lowercase) + amount` par mois.
