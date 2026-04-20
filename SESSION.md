# SESSION.md — Mani Budget Pro

## Infos projet
- **Nom** : Mani Budget Pro
- **Repo** : emmanueldelasse-droid/Mani-Budget-Pro
- **Stack** : React 18 (via CDN + Babel browser), Cloudflare Workers (KV pour sync), localStorage (fallback offline)
- **URL Worker** : `https://manibudgetpro.emmanueldelasse.workers.dev`
- **Langue UI** : Français
- **Dernière mise à jour de ce fichier** : 2026-04-20

---

## Architecture des fichiers

```
Mani-Budget-Pro/
├── SESSION.md                  ← ce fichier
├── index.html                  ← point d'entrée, charge React + Babel + scripts
├── components/
│   ├── data.jsx                ← charge budget.json, expose window.BUDGET + helpers
│   ├── store.jsx               ← state management, sync KV Cloudflare + localStorage
│   ├── screens.jsx             ← écrans Accueil, Mois, Comptes, Historique + composants UI
│   ├── screens2.jsx            ← écrans supplémentaires (Objectifs, Paramètres, etc.)
│   ├── ios-frame.jsx           ← cadre iOS simulé
│   └── app.jsx                 ← root app : LockScreen (WebAuthn), thèmes, 5 onglets
└── data/
    └── budget.json             ← données budgétaires statiques (mois, dépenses, revenus)
```

---

## Fonctionnalités implémentées

- **Lock screen** : authentification par token + WebAuthn (Face ID / Touch ID)
- **Sync cloud** : lecture/écriture via Cloudflare Worker (`/budget` endpoint, header `X-Budget-Token`)
- **Fallback offline** : localStorage (`mi:store:v1`)
- **Thèmes** : Editorial, Minimal, Fintech, Terminal
- **Accents** : Rouille, Indigo, Vert, Rose, Ambre, Cyan
- **Polices** : Serif (Fraunces), Sans (Inter), Mono (JetBrains Mono), Grotesk (Space Grotesk)
- **Densité** : Confortable, Compact, Aéré
- **Données** : dépenses fixes (`depFixes`), dépenses variables (`depVar`), revenus (`gains`), transferts, objectifs (`goals`), compte B (`compteBEntries`)
- **Déduplication** : transactions dupliquées ignorées (même mois + détail + montant)
- **UI** : onglets (5), cards, chips, graphiques (Bars, Spark), navigation par mois

---

## État actuel

- Le projet est fonctionnel dans son état de base.
- La branche de développement active est `claude/youthful-davinci-lFF9j`.
- Aucune modification en cours connue — ce SESSION.md est le premier fichier créé sur cette branche.

---

## Prochaine étape prioritaire

> **À définir par l'utilisateur** — indiquer la fonctionnalité ou le bug à traiter en début de prochaine session.

---

## Contexte technique utile pour reprendre

- **Pas de build step** : tout tourne directement dans le navigateur via `<script type="text/babel">`. Modifier les `.jsx` suffit.
- **Ordre de chargement critique** : `data.jsx` → `store.jsx` → `screens.jsx` → (screens2.jsx si chargé) → app rendu dans `#root`
- **Token d'accès** : stocké dans `localStorage['mi:token']`, envoyé via header `X-Budget-Token`
- **State global** : `window.__store` (exposé par store.jsx), `window.BUDGET` (données statiques), `window.MI_WORKER_URL`
- **Thème actif** : appliqué via CSS variables sur `:root`
- **Branche de dev** : toujours committer sur `claude/youthful-davinci-lFF9j`, jamais sur `main` sans permission explicite

---

## Historique des sessions

| Date | IA | Résumé |
|------|----|--------|
| 2026-04-20 | Claude (claude-sonnet-4-6) | Création initiale du SESSION.md — aucune modification de code |
