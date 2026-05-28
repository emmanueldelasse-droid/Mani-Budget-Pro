# SESSION.md — Mani Budget Pro

> Fichier de continuité IA — à lire au début de chaque session.

---

## Projet

**Mani Budget Pro (mbp.)** — Application web de suivi budgétaire personnel, interface mobile-first style iOS, en français.

---

## Stack technique

| Couche | Techno |
|--------|--------|
| Frontend | React 18 (UMD via unpkg), Babel standalone (pas de bundler) |
| Fichiers | HTML + JSX bruts, chargés comme `<script type="text/babel">` |
| Backend | Cloudflare Worker — `https://manibudgetpro.emmanueldelasse.workers.dev` |
| Stockage | Cloudflare KV (cloud) + localStorage (local fallback) |
| Auth | Token secret + WebAuthn biométrique (Face ID / Touch ID) |
| Fonts | Fraunces, Inter, JetBrains Mono, Space Grotesk (Google Fonts) |

---

## Architecture des fichiers

```
Mani-Budget-Pro/
├── index.html                  ← Point d'entrée, charge React, Babel, scripts dans l'ordre
├── data/
│   └── budget.json             ← Données budgétaires statiques (historique des mois)
└── components/
    ├── data.jsx                ← Initialise window.BUDGET et window.CURRENT_MONTH depuis budget.json
    ├── store.jsx               ← État global, sync Cloudflare KV, dédup transactions
    ├── screens.jsx             ← Écrans principaux : Home, Mois, Comptes, Historique, Charts, Categories, Goals
    ├── screens2.jsx            ← ScreenAdd (manuel + OCR Société Générale / Revolut) + ScreenMore
    └── app.jsx                 ← Racine app, LockScreen, thèmes, tabs, DesktopShell, TweaksPanel
```

**Ordre de chargement critique** : `data.jsx` → `store.jsx` → `screens.jsx` → `screens2.jsx` → `app.jsx`

---

## Fonctionnalités implémentées

### Navigation
- 5 onglets : Accueil · Mois · Comptes · Historique · Plus
- Layout mobile (tab bar fixe + FAB "+") et desktop (sidebar 220px)
- Écrans additionnels accessibles via `setTab` : Charts, Catégories, Objectifs

### Authentification
- Lock screen avec saisie token (password)
- WebAuthn biométrique : Face ID / Touch ID si plateforme compatible
- Token persisté en localStorage (`mi:token`)

### Données & Sync
- Budget statique (`budget.json`) + transactions ajoutées dynamiquement
- Sync cloud bidirectionnelle via Cloudflare KV (au déverrouillage)
- Déduplication : même mois + même libellé (insensible à la casse) + même montant
- Création de nouveaux mois manuellement

### Saisie de transactions
- Saisie manuelle : dépense variable ou fixe, avec date, libellé, montant, catégorie
- **OCR** : import depuis screenshot app bancaire (Société Générale, Revolut) — multi-images
- Auto-catégorisation par règles regex (Logement, Courses, Transport, Abonnements, etc.)
- Saisie de gains (revenus) séparée des dépenses

### Thèmes & personnalisation (TweaksPanel)
- Thèmes : `editorial` (défaut) · `minimal` · `fintech` · `terminal`
- Accents : `rouille` · `indigo` · `vert` · `rose` · `ambre` · `cyan`
- Polices : `serif` · `sans` · `mono` · `grotesk`
- Densité : `compact` · `confortable`
- Tweaks persistés, modifiables en live via postMessage (mode édition iframe)

### Composants UI réutilisables (screens.jsx)
- `Card`, `Section`, `Chip`, `CatDot`, `Bars`, `Spark`, `Donut`, `TxRow`

---

## Variables globales (window)

| Variable | Rôle |
|----------|------|
| `window.BUDGET` | Données budget complètes (mois historiques) |
| `window.CURRENT_MONTH` | Mois courant (`monthKey`, `label`, données) |
| `window.CAT_COLORS` | Map catégorie → couleur hex |
| `window.__budgetReady` | Promise résolue quand `data.jsx` a fini |
| `window.__storeReady` | Promise résolue quand `store.jsx` a fini (expose le store) |
| `window.MI_WORKER_URL` | URL du Cloudflare Worker |

---

## État actuel

- **Application fonctionnelle** : lock screen, navigation, ajout de transactions, sync cloud, thèmes
- **Branche de développement active** : `claude/youthful-davinci-xcjLZ`
- Aucun système de build (pas de npm, pas de webpack) — tout tourne directement dans le navigateur

---

## Catégories de dépenses

`Logement` · `Courses` · `Resto & Café` · `Transport` · `Abonnements` · `Loisirs` · `Santé & Beauté` · `Vêtements` · `Assurances` · `Virements` · `Frais` · `Autre`

---

## Prochaine étape prioritaire

*(À mettre à jour en fin de session)*

---

## Historique des sessions

| Date | IA | Résumé |
|------|----|--------|
| 2026-05-28 | Claude (claude-sonnet-4-6) | Création du fichier SESSION.md — état initial documenté |
