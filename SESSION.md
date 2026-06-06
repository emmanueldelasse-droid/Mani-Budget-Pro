# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. À lire en début de session, à mettre à jour en fin de session.

---

## Projet

**Mani Budget Pro (mbp.)** — Application web de suivi budgetaire personnel, mobile-first.
- Frontend React (CDN + Babel standalone, sans build step)
- Backend : Cloudflare Worker + Cloudflare KV (persistance cloud)
- Auth : token secret + WebAuthn / Face ID (biométrie)
- URL worker : `https://manibudgetpro.emmanueldelasse.workers.dev`

---

## Architecture des fichiers

```
Mani-Budget-Pro/
├── index.html                  ← Entrée, charge React, Babel, puis les composants
├── SESSION.md                  ← Ce fichier
├── data/
│   └── budget.json             ← Données budgétaires historiques (multi-mois depuis 2023)
└── components/
    ├── data.jsx                ← Chargement budget.json, helpers fmtEur, CAT_COLORS, etc.
    ├── store.jsx               ← State management, sync Cloudflare KV ↔ localStorage
    ├── screens.jsx             ← Écrans : Home, Mois, Comptes, Historique + primitives UI
    ├── screens2.jsx            ← ScreenAdd (ajout manuel + OCR), ScreenMore
    └── app.jsx                 ← App root, LockScreen, navigation, thèmes, TweaksPanel
```

---

## Fonctionnalités implémentées

- **5 onglets** : Accueil, Mois, Comptes, Historique, Plus (+ sidebar desktop)
- **Lock screen** : token secret + Face ID / Touch ID (WebAuthn)
- **Thèmes** : editorial, minimal, fintech, terminal (+ 6 accents, 4 polices, 2 densités)
- **Sync cloud** : Cloudflare KV (cloud-first, fallback localStorage)
- **OCR** : import relevés Société Générale + Revolut (image → transactions)
- **Auto-catégorisation** : règles regex sur le libellé (15 catégories)
- **Ajout manuel** : dépense fixe ou variable avec déduplication
- **Virements** entre comptes (Compte A → Compte B)
- **Objectifs (Goals)**
- **Multi-mois** : navigation entre mois archivés (budget.json historique)
- **TweaksPanel** : édition thème/accent/police en live (mode édition iframe)

---

## État actuel — 2026-06-06

- Code complet poussé sur `main` via uploads GitHub directs
- Branche de travail active : `claude/youthful-davinci-hZvGM`
- Aucun bug connu documenté à ce jour
- SESSION.md créé pour la première fois (initialisation du système de continuité)

---

## Décisions techniques clés

| Décision | Raison |
|----------|--------|
| React via CDN + Babel standalone | Pas de build step, déployable comme fichiers statiques |
| Cloudflare KV comme backend | Simple, gratuit, serverless, zéro infrastructure |
| Auth token + WebAuthn | Accès sécurisé sans compte utilisateur |
| `data/budget.json` pour l'historique | Import one-shot des données passées, immutable |
| store.jsx isolé | Séparation claire persistance / UI |

---

## Prochaine étape prioritaire

> **À déterminer lors de la prochaine session** — demander à l'utilisateur ce qu'il veut développer ou corriger.

Pistes possibles identifiées dans le code :
- `ScreenCharts`, `ScreenCategories`, `ScreenGoals` sont référencés dans `app.jsx` mais leur implémentation complète est à vérifier dans `screens.jsx` / `screens2.jsx`
- Amélioration UX de l'OCR (retour visuel, gestion d'erreur)
- Tests sur mobile réel (Face ID, rendu des onglets)

---

## Contexte pour reprendre

- Tous les composants sont des fichiers `.jsx` chargés par Babel dans le browser — aucun bundler
- Le store est initialisé de façon asynchrone via `window.__storeReady` (Promise)
- `window.BUDGET` et `window.CURRENT_MONTH` sont exposés globalement par `data.jsx`
- Pour tester localement : serveur HTTP simple (ex: `npx serve .` ou Live Server VS Code)
- Le token de test est stocké dans `localStorage` sous la clé `mi:token`

---

*Dernière mise à jour : 2026-06-06 — Init par Claude (claude-sonnet-4-6)*
