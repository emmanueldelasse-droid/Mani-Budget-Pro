# SESSION.md — Mani Budget Pro

---

## Identité du projet

- **Nom** : Mani Budget Pro (mbp.)
- **Repo** : `emmanueldelasse-droid/Mani-Budget-Pro`
- **URL raw** : `https://raw.githubusercontent.com/emmanueldelasse-droid/Mani-Budget-Pro/main/SESSION.md`
- **Dernière session** : 2026-05-29 · Claude Code (claude-sonnet-4-6)

---

## État actuel

Application web de gestion budgétaire personnelle, **fonctionnelle** côté frontend. Elle tourne en production via Cloudflare Workers.

**Stack** :
- React 18 via CDN (pas de build, Babel standalone in-browser)
- Pas de `package.json`, pas de bundler — fichiers `.jsx` statiques chargés directement
- Backend : Cloudflare Worker à `https://manibudgetpro.emmanueldelasse.workers.dev`
- Stockage : Cloudflare KV (cloud) + `localStorage` (cache local)
- Auth : token secret (header `X-Budget-Token`) + biométrie WebAuthn (Face ID / Touch ID)

---

## Architecture des fichiers

```
Mani-Budget-Pro/
├── index.html              ← point d'entrée, charge les scripts JSX via Babel
├── components/
│   ├── data.jsx            ← charge budget.json, expose helpers (allTx, labels, dates)
│   ├── store.jsx           ← state global : localStorage + sync Cloudflare KV
│   ├── screens.jsx         ← écrans principaux (Accueil, Mois, Comptes, Historique)
│   ├── screens2.jsx        ← ScreenAdd (dépense manuelle / fixe / OCR) + ScreenMore
│   └── app.jsx             ← App root, LockScreen, thèmes, navigation onglets
├── data/
│   └── budget.json         ← données budget (~333 KB) : mois, dépenses fixes, variables, gains
└── SESSION.md
```

---

## Fonctionnalités implémentées

### Navigation
- **5 onglets** : Accueil, Mois, Comptes, Historique, Plus
- **Onglets cachés** accessibles via "Plus" : Charts, Catégories, Objectifs
- Layout **mobile** (tab bar bas + FAB +) et **desktop** (sidebar 220px)

### Écran verrouillage (`app.jsx`)
- Saisie de token secret (mot de passe)
- Authentification biométrique WebAuthn (Face ID / Touch ID) si token déjà enregistré
- Fallback manuel si biométrie non enregistrée

### Thèmes (`app.jsx`)
- 4 thèmes : `editorial` (défaut), `minimal`, `fintech`, `terminal`
- 6 accents : `rouille`, `indigo`, `vert`, `rose`, `ambre`, `cyan`
- 4 polices : `serif` (Fraunces), `sans` (Inter), `mono` (JetBrains Mono), `grotesk` (Space Grotesk)
- 2 densités : `compact`, `confortable`
- Panneau de tweaks activable via message `postMessage` (mode édition)

### Données (`data.jsx`)
- Charge `data/budget.json` de façon asynchrone (promesse `window.__budgetReady`)
- Normalise les dates, crée `allTx`, `allGains`, labels mois en français
- Expose `window.BUDGET`, `window.CURRENT_MONTH`, `window.CAT_COLORS`

### Store (`store.jsx`)
- Promesse `window.__storeReady`
- État : `addedTx`, `addedGains`, `transfers`, `newMonths`, `goals`, `compteBEntries`
- Sync : cloud d'abord, fallback local ; save = localStorage + Cloudflare KV simultanés
- Déduplication des transactions (même mois + détail + montant)
- Méthodes : `addTx`, `addGain`, `addTransfer`, `deleteAddedTx`, `deleteAddedGain`, `setGoals`, etc.

### Ajout de dépenses (`screens2.jsx`)
- Saisie manuelle (montant, détail, catégorie, date, compte)
- Import de dépenses fixes
- **OCR** : parsing d'extraits bancaires Société Générale et Revolut via image

### Auto-catégorisation (`screens2.jsx`)
- Règles basées sur nom du marchand (Leclerc → Courses, Netflix → Abonnements, etc.)
- ~11 catégories + "Autre"

---

## Données budget.json

- Fichier volumineux (~333 KB) — **ne pas lire en entier**
- Structure : `{ months: [...], categories: [...] }`
- Chaque mois : `depFixes[]`, `depVar[]`, `gains[]`, `comptes`
- Utilisé comme source de données statique enrichie par le store dynamique

---

## Worker Cloudflare

- URL : `https://manibudgetpro.emmanueldelasse.workers.dev`
- Endpoints : `GET /budget` et `POST /budget` (authentifié par header `X-Budget-Token`)
- Stockage KV côté Cloudflare
- Worker non présent dans ce repo (déployé séparément)

---

## État Git

- **Branche de dev active** : `claude/youthful-davinci-7H99L`
- **Branche principale** : `main`
- Derniers commits : uploads de fichiers (pas de message fonctionnel descriptif)
- Aucun test, aucun linter configuré

---

## Problèmes connus / Points d'attention

- `budget.json` est statique (333KB) — les données historiques viennent de ce fichier, les nouvelles entrées passent par le store
- Le Worker Cloudflare est externe au repo — toute modification backend nécessite un déploiement séparé
- Pas de build system : les erreurs JSX ne sont détectées qu'au runtime dans le navigateur
- L'OCR est client-side (parsing regex) — limité aux formats Société Générale et Revolut

---

## Prochaine étape prioritaire

**Définir et implémenter la prochaine fonctionnalité** — plusieurs pistes possibles :
1. Améliorer les écrans existants (Charts, Catégories, Objectifs dans `screens2.jsx`)
2. Enrichir le budget.json avec de nouveaux mois
3. Améliorer l'OCR (ajouter d'autres banques)
4. Ajouter des alertes ou notifications de dépassement de budget

→ **Demander à l'utilisateur ce qu'il veut faire aujourd'hui.**

---

## Commandes utiles (dans ce repo)

```bash
# Voir la structure
ls components/ data/

# Lancer localement (serveur HTTP simple)
python3 -m http.server 8080
# ou
npx serve .

# Git : pousser les modifications
git add -A && git commit -m "..." && git push -u origin claude/youthful-davinci-7H99L
```
