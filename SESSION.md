# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. À lire en début de session, à mettre à jour en fin de session.

---

## Projet

**Mani Budget Pro (mbp.)** — Application de gestion budgétaire personnelle, mobile-first, hébergée sur GitHub Pages + backend Cloudflare Workers KV.

- **Repo** : `emmanueldelasse-droid/Mani-Budget-Pro`
- **URL worker** : `https://manibudgetpro.emmanueldelasse.workers.dev`
- **Stack** : React 18 (CDN UMD + Babel standalone — pas de build tool), Cloudflare Workers, localStorage

---

## Architecture des fichiers

```
Mani-Budget-Pro/
├── index.html                  ← point d'entrée, charge les scripts via <script type="text/babel">
├── SESSION.md                  ← ce fichier
├── components/
│   ├── data.jsx                ← charge budget.json, expose BUDGET, CURRENT_MONTH, fmtEur, CAT_COLORS
│   ├── store.jsx               ← store global (localStorage + sync Cloudflare KV), expose STORE
│   ├── screens.jsx             ← ScreenHome, ScreenMois, ScreenAccounts, ScreenHistory + primitives UI
│   ├── screens2.jsx            ← ScreenAdd (manuel + fixe + OCR Claude), ScreenMore
│   └── app.jsx                 ← App, LockScreen (WebAuthn/Face ID), DesktopShell, TweaksPanel
└── data/
    └── budget.json             ← données budgétaires statiques (mois archivés, dépenses fixes, gains)
```

### Ordre de chargement dans index.html
`data.jsx` → `store.jsx` → `screens.jsx` → `screens2.jsx` → `app.jsx`

---

## État actuel du projet

### Ce qui fonctionne
- **5 onglets** : Accueil, Mois, Comptes, Historique, Plus (mobile) / sidebar desktop
- **Lock screen** avec token secret + Face ID / Touch ID (WebAuthn)
- **Sync Cloudflare KV** : lecture au démarrage, écriture à chaque mutation
- **Ajout de transactions** : manuel (dépense variable, fixe, gain) + import OCR via Claude API
- **OCR** : screenshot Société Générale ou Revolut → Claude lit l'image → import en masse avec détection doublons
- **Thèmes** : Editorial, Minimal, Fintech, Terminal
- **Accents** : Rouille, Indigo, Vert, Rose, Ambre, Cyan
- **Polices** : Serif (Fraunces), Sans (Inter), Mono (JetBrains Mono), Grotesk (Space Grotesk)
- **Densité** : Compact / Confortable
- **Création de mois** : duplication des charges fixes + report du découvert
- **Suppression** : swipe-to-delete sur les transactions ajoutées
- **Auto-catégorisation** : règles regex sur le libellé (Logement, Courses, Resto, etc.)
- **Mode desktop** : sidebar 220px + colonne principale (min-width 900px)
- **EditMode** : panneau TweaksPanel activable via postMessage (intégration iframe)

### Store — état persisté (localStorage `mi:store:v1` + cloud KV)
| Clé | Contenu |
|-----|---------|
| `addedTx` | Transactions ajoutées manuellement (variables + fixes) |
| `addedGains` | Revenus ajoutés manuellement |
| `transfers` | Virements entre comptes |
| `newMonths` | Mois créés par l'utilisateur |
| `goals` | Objectifs d'épargne (null si non configuré) |
| `compteBEntries` | Entrées compte B (second compte) |

---

## Décisions techniques importantes

- **Pas de bundler** : tout en UMD + Babel standalone pour rester déployable sur GitHub Pages sans CI.
- **`window.__budgetReady` / `window.__storeReady`** : promises en cascade pour garantir l'ordre d'init asynchrone.
- **Dédup OCR** : clé composite `detail.toLowerCase()|amount` par `monthKey` pour éviter les doublons d'import.
- **WebAuthn simplifié** : on vérifie la présence biométrique locale (Face ID) mais le token secret reste la source de vérité — WebAuthn ne fait que débloquer l'accès au token stocké.
- **`TWEAK_DEFAULTS`** encadré par `/*EDITMODE-BEGIN*/…/*EDITMODE-END*/` pour que le système iframe puisse patcher les valeurs par défaut à la volée.

---

## Prochaine étape prioritaire

**Implémenter l'onglet Comptes (ScreenAccounts)** : afficher le solde calculé de chaque compte (Compte A principal + Compte B), historique des virements, et permettre la saisie du solde initial.

*(À affiner selon ce que tu veux faire aujourd'hui.)*

---

## Contexte pour reprendre

- Le fichier `budget.json` est la source de données statiques (ne pas modifier à la main).
- Les mutations passent toutes par `window.STORE` (disponible après `window.__storeReady`).
- Pour tester localement : servir les fichiers via un serveur HTTP (ex. `python -m http.server`), pas en `file://` (CORS).
- Le token d'accès est stocké dans `localStorage` sous la clé `mi:token`.
- Le worker Cloudflare attend le header `X-Budget-Token` pour l'auth.

---

*Dernière mise à jour : 2026-06-15 — IA : Claude (claude-sonnet-4-6) via Claude Code*
