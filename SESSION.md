# SESSION.md — Mani Budget Pro

## Identité du projet

- **Nom** : Mani Budget Pro
- **Repo** : `emmanueldelasse-droid/mani-budget-pro`
- **URL raw SESSION.md** : `https://raw.githubusercontent.com/emmanueldelasse-droid/mani-budget-pro/main/SESSION.md`
- **Type** : Application web budget personnel (français), React sans build, fichiers JSX chargés via Babel CDN

---

## Stack technique

| Couche | Détail |
|--------|--------|
| Frontend | React 18 (CDN) + Babel Standalone (pas de bundler) |
| Entry point | `index.html` charge les JSX dans l'ordre : `data.jsx` → `store.jsx` → `screens.jsx` → *(app.jsx chargé via screens.jsx ou index.html)* |
| Backend | Cloudflare Worker : `https://manibudgetpro.emmanueldelasse.workers.dev` |
| Persistence | Cloudflare KV (cloud-first) + `localStorage` (fallback offline) |
| Auth | Token `X-Budget-Token` header + lock screen WebAuthn/biométrie |
| Data | `data/budget.json` — données budget statiques par mois |

---

## Architecture des fichiers

```
Mani-Budget-Pro/
├── SESSION.md              ← ce fichier
├── index.html              ← entry point HTML, charge CDN React + Babel + JSX
├── data/
│   └── budget.json         ← données mensuelles (dépenses fixes, variables, gains)
└── components/
    ├── data.jsx            ← charge budget.json, normalise les mois, expose window.BUDGET + helpers (fmtEur…)
    ├── store.jsx           ← state global : KV cloud + localStorage, subscribe/notify, dedup
    ├── screens.jsx         ← écrans UI : Accueil, Mois, Comptes, Historique + primitives (Card, Section, Chip…)
    ├── screens2.jsx        ← écrans secondaires (Objectifs, Paramètres, etc.)
    └── app.jsx             ← root : thèmes, accents, polices, densités, lock screen, navigation 5 onglets
```

---

## Fonctionnalités implémentées

- [x] Lock screen avec token manuel + biométrie WebAuthn (Face ID / Touch ID)
- [x] Navigation 5 onglets
- [x] Thèmes : Éditorial, Minimal, Fintech, Terminal
- [x] Accents : rouille, indigo, vert, rose, ambre, cyan
- [x] Polices : Fraunces (serif), Inter (sans), JetBrains Mono, Space Grotesk
- [x] Densités : confortable / compact
- [x] Sync Cloudflare KV (cloud-first, fallback localStorage)
- [x] Données multi-mois avec dépenses fixes, dépenses variables, gains, transferts
- [x] Dedup des transactions (même mois + libellé + montant)
- [x] Composants : Card, Section, Chip, CatDot, Bars, Spark

---

## Variables globales clés

| Variable | Source | Rôle |
|----------|--------|------|
| `window.MI_WORKER_URL` | `app.jsx:5` | URL du Worker Cloudflare |
| `window.__budgetReady` | `data.jsx` | Promise resolue quand budget.json est chargé |
| `window.__storeReady` | `store.jsx` | Promise resolue quand le store est initialisé |
| `window.BUDGET` | `data.jsx` | Données budget complètes |
| `window.MONTH_FR` | `data.jsx` | Tableau des noms de mois en français |
| `window.fmtEur` | `data.jsx` | Formateur monétaire (ex: `−1 234,56 €`) |
| `window.CAT_COLORS` | `data.jsx` ou `screens.jsx` | Couleurs par catégorie de dépense |

---

## Points d'attention / contraintes connues

- **Pas de bundler** : tout doit être compatible avec Babel Standalone (pas d'import ES modules natifs dans les JSX)
- **Ordre de chargement critique** : `data.jsx` doit être chargé avant `store.jsx`, qui doit l'être avant les screens
- **Token auth** : stocké dans `localStorage` clé `mi:token`
- **Store** : clé localStorage `mi:store:v1`
- **Cloudflare Worker** : le worker gère les routes `/budget` (GET/POST) avec auth par token

---

## État de la session

- **Dernière mise à jour** : 2026-05-24
- **IA utilisée** : Claude (claude-sonnet-4-6) via Claude Code on the web
- **Tâches accomplies cette session** :
  - Création du fichier SESSION.md initial documentant l'état du projet

- **Bugs résolus** : aucun cette session

- **Décisions techniques** : aucune nouvelle cette session

---

## Prochaine étape prioritaire

> **À définir** — indique à l'IA ce que tu veux construire ou corriger au début de la prochaine session.

---

## Comment reprendre

1. Ouvre ce fichier sur GitHub (bouton Raw) et copie son contenu
2. Colle-le au début de ta conversation avec l'IA :
   ```
   Lis ce SESSION.md avant de commencer :
   [contenu collé ici]

   Résume en 3 lignes : projet, état actuel, prochaine étape.
   Puis demande-moi ce que je veux faire aujourd'hui.
   ```
3. En fin de session, dis : **"on approche de la fin"** → l'IA génère le SESSION.md mis à jour immédiatement
