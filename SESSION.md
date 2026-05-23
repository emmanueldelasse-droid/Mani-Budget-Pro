# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. Lis ce fichier en début de session, génère-le mis à jour en fin de session.

---

## Projet

**Mani Budget Pro** — Application web de gestion budgétaire personnelle (PWA).
Interface mobile-first avec mode desktop, thèmes, synchronisation cloud.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 (CDN UMD), Babel standalone — **pas de build** |
| Persistence | Cloudflare KV via Worker (`manibudgetpro.emmanueldelasse.workers.dev`) |
| Auth | Token secret + WebAuthn biométrique (Face ID / Touch ID) |
| Hébergement | GitHub Pages ou Cloudflare Pages (fichiers statiques) |
| Polices | Fraunces, Inter, JetBrains Mono, Space Grotesk (Google Fonts) |

**Worker URL :** `https://manibudgetpro.emmanueldelasse.workers.dev`

---

## Architecture des fichiers

```
Mani-Budget-Pro/
├── index.html              ← Entry point, charge les scripts Babel
├── data/
│   └── budget.json         ← Données statiques de base (mois pré-remplis)
└── components/
    ├── data.jsx            ← Charge budget.json, expose window.BUDGET + helpers (fmtEur, CAT_COLORS…)
    ├── store.jsx           ← State management : Cloudflare KV sync + localStorage (window.STORE)
    ├── screens.jsx         ← Écrans : Accueil, Mois, Comptes, Historique + primitives UI (Card, Chip, TxRow…)
    ├── screens2.jsx        ← Écrans : ScreenAdd (ajout dépense + OCR), ScreenMore, Charts, Categories, Goals
    └── app.jsx             ← App root : LockScreen, thèmes/accents/polices, tab bar, DesktopShell, TweaksPanel
```

**Ordre de chargement** (index.html) : `data.jsx` → `store.jsx` → `screens.jsx` → `screens2.jsx` → `app.jsx`

---

## Fonctionnalités implémentées

- **Lock screen** : saisie token + biométrie WebAuthn (Face ID / Touch ID auto au chargement si token enregistré)
- **5 onglets** : Accueil · Mois · Comptes · Historique · Plus
- **Écrans secondaires** : Charts, Categories, Goals (accessibles via ScreenMore)
- **Ajout de transactions** : dépenses fixes ou variables, gains, catégorisation automatique (règles texte)
- **OCR** : import relevé bancaire (Société Générale + Revolut) via photo, avec dédup
- **Mois suivant** : création avec copie des charges fixes + report du découvert
- **Synchronisation cloud** : lecture/écriture Cloudflare KV via token, sync au déverrouillage
- **Thèmes** : Editorial (défaut), Minimal, Fintech, Terminal
- **Accents** : Rouille (défaut), Indigo, Vert, Rose, Ambre, Cyan
- **Polices** : Serif, Sans, Mono, Grotesk
- **Densité** : Compact / Confortable
- **Mode desktop** : sidebar 220px + main centré 860px
- **TweaksPanel** : panel flottant pour modifier thème/accent/police/densité (activé via postMessage editMode)

---

## Décisions techniques clés

- **Pas de bundler** : React + Babel chargés depuis CDN avec intégrité SHA384. Permet déploiement statique sans Node.js.
- **window.__storeReady / window.__budgetReady** : promises pour synchroniser le chargement asynchrone des modules.
- **window.STORE** : store global accessible partout sans prop drilling.
- **Dédup transactions** : hash `detail.toLowerCase()|amount` par mois pour éviter les doublons à l'import OCR.
- **WebAuthn simplifié** : biométrie valide la présence de l'utilisateur mais le token reste le vrai secret (pas de credential enregistré côté serveur).
- **`TWEAK_DEFAULTS`** : bloc `/*EDITMODE-BEGIN*/.../*EDITMODE-END*/` pour injection de config par le parent iframe.

---

## État actuel

- **Branche de travail** : `claude/youthful-davinci-fSyi0`
- **Branche principale** : `main`
- **Derniers commits** : uploads des fichiers composants (data, store, screens, screens2, app)
- **Application** : fonctionnelle — toutes les fonctionnalités listées ci-dessus sont en place

---

## Prochaine étape prioritaire

> À remplir en fin de session avec la tâche la plus importante pour la prochaine fois.

---

## Historique des sessions

| Date | IA | Résumé |
|------|----|--------|
| 2026-05-23 | Claude (claude-sonnet-4-6) | Initialisation du SESSION.md · Audit complet de la codebase |

---

## Contexte pour reprendre rapidement

- Toujours vérifier que `window.__budgetReady` et `window.__storeReady` sont résolus avant d'accéder à `window.BUDGET` / `window.STORE`.
- Les screens reçoivent `monthKey` (string `"YYYY-MM"`) comme prop principal de navigation temporelle.
- `store.getMonths()` fusionne les mois statiques (`budget.json`) + mois créés par l'utilisateur (`state.newMonths`).
- Les modifications UI ne nécessitent pas de rebuild — éditer les `.jsx` et recharger le navigateur.
- Le Worker Cloudflare gère les routes `/budget` (GET/POST) avec header `X-Budget-Token`.
