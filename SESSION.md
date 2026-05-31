# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. Lis ce fichier en début de session avant toute autre action.

---

## État du projet

**Date de dernière mise à jour :** 2026-05-31
**IA utilisée :** Claude (claude-sonnet-4-6)

**Projet :** Mani Budget Pro (`mbp.`)
**Description :** Application web de suivi budgetaire personnel. Interface mobile-first avec onglets, thèmes, sync Cloudflare KV, verrouillage par token + WebAuthn (Face ID / Touch ID), et import OCR (screenshots bancaires).

---

## Stack technique

| Élément | Détail |
|---------|--------|
| Frontend | React 18 (CDN unpkg), Babel Standalone (transpilation in-browser, pas de build step) |
| Backend | Cloudflare Workers — `https://manibudgetpro.emmanueldelasse.workers.dev` |
| Storage | Cloudflare KV (données cloud) + localStorage (cache local) |
| Auth | Token `X-Budget-Token` + WebAuthn (Face ID / Touch ID) via `PublicKeyCredential` |
| Fonts | Fraunces, Inter, JetBrains Mono, Space Grotesk (Google Fonts) |

---

## Architecture des fichiers

```
Mani-Budget-Pro/
├── SESSION.md              ← ce fichier
├── index.html              ← entry point, charge tous les scripts Babel
├── components/
│   ├── app.jsx             ← App root, LockScreen, thèmes/accents/polices, TweaksPanel, DesktopShell
│   ├── store.jsx           ← state management, sync Cloudflare KV, addedTx/addedGains/transfers
│   ├── screens.jsx         ← ScreenHome, ScreenMois, ScreenAccounts, ScreenHistory + primitives UI
│   ├── screens2.jsx        ← ScreenAdd (saisie manuelle + OCR), ScreenMore, auto-catégorisation
│   ├── ios-frame.jsx       ← wrapper frame iOS pour prévisualisation
│   └── data.jsx            ← données statiques : CAT_COLORS, CURRENT_MONTH, MONTH_FR, etc.
└── data/
    └── budget.json         ← historique mensuel (depuis Sept. 2023)
```

---

## Fonctionnalités implémentées

- **Lock screen** : token secret + biométrie WebAuthn (Face ID / Touch ID)
- **5 onglets** : Accueil, Mois, Comptes, Historique, Plus
- **Navigation mois** : sélecteur de mois, navigation ←→
- **Ajout de transactions** : manuel (fixe/variable), OCR (Société Générale & Revolut)
- **Auto-catégorisation** : 11 catégories reconnues par règles regex sur le libellé
- **Déduplication** : `addTxSafe` / `addGainSafe` (clé : detail + amount + monthKey)
- **Création de mois** : `createNextMonth` — copie les charges fixes, reporte le découvert
- **Thèmes** : Editorial (défaut), Minimal, Fintech, Terminal
- **Accents** : Rouille (défaut), Indigo, Vert, Rose, Ambre, Cyan
- **Polices** : Serif (Fraunces), Sans (Inter), Mono (JetBrains Mono), Grotesk (Space Grotesk)
- **Densité** : Compact / Confortable
- **TweaksPanel** : panneau flottant de personnalisation (activé via `postMessage`)
- **DesktopShell** : sidebar sur grands écrans (≥ 900px), tabbar sur mobile
- **Sync Cloudflare** : chargement cloud au déverrouillage, sauvegarde à chaque mutation
- **Swipe to delete** : glisser une transaction à gauche pour la supprimer
- **Sparklines & Donut** : composants graphiques SVG inline

---

## Données budget

- Mois archivés disponibles depuis **Septembre 2023**
- Données réelles dans `data/budget.json` (salaires, charges fixes, dépenses variables)
- Les nouvelles transactions sont stockées dans `state.addedTx` / `state.addedGains`
- Les nouveaux mois (créés par l'user) sont dans `state.newMonths`

---

## Tâches accomplies (cette session)

- Analyse complète de l'architecture du projet
- Création du fichier `SESSION.md` de continuité IA

---

## Bugs connus / Points d'attention

- `data/budget.json` : le mois de Septembre 2023 a `salaire: null` et `fixes: null` — mois incomplet
- Certains mois anciens ont un `reste` négatif (ex. Janvier 2024 : −3987.69€)
- WebAuthn : si aucune credential enregistrée → `InvalidStateError` → fallback saisie manuelle
- Pas de build step → toute modification de `.jsx` est directement live en ouvrant `index.html`

---

## Prochaine étape prioritaire

> **À définir avec l'utilisateur** — demander quelle fonctionnalité ou correction est souhaitée aujourd'hui.

Pistes potentielles (non confirmées) :
- Ajouter l'écran `ScreenCharts` (graphiques mensuels)
- Ajouter l'écran `ScreenGoals` (objectifs d'épargne)
- Améliorer l'OCR (autres banques)
- Ajouter la gestion multi-comptes dans `ScreenAccounts`

---

## Contexte pour reprendre

- **Pas de `npm install` ni build** : ouvrir directement `index.html` dans un navigateur
- **Token de test** : à récupérer depuis Cloudflare Dashboard → Worker → KV
- **Worker URL** : `https://manibudgetpro.emmanueldelasse.workers.dev`
- **Branche active** : `claude/youthful-davinci-dAflF`
- **Repo GitHub** : `https://github.com/emmanueldelasse-droid/Mani-Budget-Pro`

---

## Commande fin de session

Quand tu veux sauvegarder : dis **"on approche de la fin"** ou **"génère le SESSION.md"** → l'IA génère ce fichier mis à jour avant tout autre chose.
