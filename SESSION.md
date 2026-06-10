# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. Lis ce fichier en début de session avant de répondre.

---

## Projet

**Nom** : Mani Budget Pro (`mbp.`)
**Type** : Application web de suivi budgétaire personnel
**Langue** : Français
**URL Worker** : `https://manibudgetpro.emmanueldelasse.workers.dev`

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 (CDN UMD) + Babel Standalone — **aucun build step** |
| Styles | CSS-in-JS inline (variables CSS custom, OKLCH) |
| Backend | Cloudflare Worker + KV (token `X-Budget-Token`) |
| Auth | Token secret + WebAuthn (Face ID / Touch ID) |
| Données statiques | `data/budget.json` (mois depuis Sept 2023) |
| Hébergement | Fichiers statiques (GitHub Pages ou équivalent) |

### Fichiers principaux

```
index.html                  → Point d'entrée, charge les JSX via Babel
components/
  data.jsx                  → Charge budget.json, expose fmtEur, CAT_COLORS, CURRENT_MONTH
  store.jsx                 → Couche persistence : Cloudflare KV + localStorage (window.STORE)
  screens.jsx               → Écrans : Accueil, Mois, Comptes, Historique + composants primitifs
  screens2.jsx              → Écrans : Graphiques, Catégories, Objectifs, Ajout, Plus
  ios-frame.jsx             → Frame de prévisualisation iOS
  app.jsx                   → App principale : LockScreen, thèmes, navigation, DesktopShell
data/
  budget.json               → Données budgétaires statiques (historique des mois)
```

---

## Fonctionnalités implémentées

- **Lock screen** : token + biométrie WebAuthn (Face ID / Touch ID)
- **5 onglets** : Accueil, Mois, Comptes, Historique, Plus (+ FAB mobile)
- **Sync cloud** : Cloudflare KV (`/budget`) avec fallback localStorage
- **4 thèmes** : Éditorial, Minimal, Fintech, Terminal
- **6 accents** : rouille, indigo, vert, rose, ambre, cyan
- **4 polices** : serif (Fraunces), sans (Inter), mono (JetBrains), grotesk (Space Grotesk)
- **2 densités** : compact / confortable
- **Layout dual** : sidebar desktop (≥900px) + tab bar mobile
- **Gestion des transactions** : ajout, suppression, déduplication
- **Gestion des mois** : création, report découvert, copie charges fixes
- **TweaksPanel** : mode édition via `postMessage`
- **Couleurs catégories** : palette OKLCH harmonique (13 catégories)

---

## Architecture store (window.STORE)

L'état est stocké dans `localStorage` (`mi:store:v1`) et synchronisé avec Cloudflare KV.

```js
state = {
  addedTx: [],        // transactions ajoutées manuellement
  addedGains: [],     // revenus ajoutés manuellement
  transfers: [],      // virements entre comptes
  newMonths: [],      // mois créés manuellement
  goals: null,        // objectifs d'épargne
  compteBEntries: [], // entrées compte secondaire
}
```

**Ordre de chargement** : `data.jsx` → `store.jsx` → `screens.jsx` → `screens2.jsx` → `app.jsx`
Les promesses `window.__budgetReady` et `window.__storeReady` garantissent l'ordre.

---

## État actuel du projet

- **Dernière mise à jour SESSION.md** : 2026-06-10 (créé automatiquement par Claude Code)
- **Branche de dev active** : `claude/youthful-davinci-drxa9u`
- **Branche principale** : `main`
- **Working tree** : propre, rien en attente

### Ce qui fonctionne
- Toute l'architecture de base est en place et fonctionnelle
- Le système de thèmes/accents/polices est complet
- La sync Cloudflare KV est opérationnelle
- L'authentification biométrique est implémentée

### Points d'attention / dette technique
- Aucun build step → performances limitées en prod (Babel runtime en navigateur)
- `budget.json` statique → les données historiques doivent être mises à jour manuellement
- Pas de tests automatisés

---

## Prochaine étape prioritaire

> **À définir avec toi en début de session.**
> Indique ce que tu veux travailler (nouvelle fonctionnalité, bug, amélioration UI, etc.)

---

## Règle fin de session

Dès que tu dis **"on approche de la fin"**, **"tokens"**, **"sauvegarde la session"** ou formulation similaire → générer IMMÉDIATEMENT ce fichier SESSION.md mis à jour avant toute autre réponse.

---

## Historique des sessions

| Date | IA | Résumé |
|------|----|--------|
| 2026-06-10 | Claude (claude-sonnet-4-6) | Création initiale du SESSION.md — scan complet du projet, documentation de l'architecture |
