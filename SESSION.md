# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. À lire en début de session pour reprendre immédiatement là où on s'est arrêtés.

---

## Projet

**Nom** : Mani Budget Pro (`mbp.`)
**Repo** : `emmanueldelasse-droid/Mani-Budget-Pro`
**URL raw** : `https://raw.githubusercontent.com/emmanueldelasse-droid/Mani-Budget-Pro/main/SESSION.md`
**Dernière mise à jour** : 2026-05-25 · Claude Code (claude-sonnet-4-6)

---

## Description

Application web de gestion budgétaire personnelle, entièrement en français, mobile-first. Pas de build step — JSX transpilé en live par Babel dans le navigateur. Backend : Cloudflare Workers + KV pour la persistance cloud.

**Stack** :
- React 18.3.1 (CDN) + Babel 7.29.0 (CDN)
- CSS variables / inline styles (pas de framework CSS)
- Cloudflare Workers (sync) + KV (stockage)
- WebAuthn (biométrie) + token localStorage (auth)
- Pas de package.json / node_modules

---

## Architecture

```
Mani-Budget-Pro/
├── index.html          # Point d'entrée SPA, charge React + Babel depuis CDN
├── data/
│   └── budget.json     # Données financières mensuelles (333KB+, depuis sept. 2023)
└── components/
    ├── app.jsx         # Orchestrateur principal — auth, navigation, thèmes
    ├── data.jsx        # Chargement budget.json, utils format, couleurs catégories
    ├── store.jsx       # State management — localStorage + Cloudflare KV sync
    ├── screens.jsx     # Composants UI + écrans (Home, Mois, Comptes, Historique)
    ├── screens2.jsx    # Écrans avancés (ajout transaction, paramètres, OCR)
    └── ios-frame.jsx   # iOS UI Kit — StatusBar, GlassPill, NavBar
```

**Flux d'initialisation** :
1. `data.jsx` charge `budget.json` → expose `window.__budgetReady`
2. `store.jsx` initialise le store → expose `window.__storeReady`
3. `app.jsx` attend les deux signaux → démarre l'app

---

## Fonctionnalités implémentées

- **Auth** : Lock screen WebAuthn (Face ID / Touch ID) + token localStorage
- **Navigation** : 5 onglets (Accueil, Mois, Comptes, Historique, Plus) — mobile tabbar / desktop sidebar
- **Thèmes** : 4 thèmes (Editorial, Minimal, Fintech, Terminal) × 6 accents (rouille, indigo, vert, rose, ambre, cyan) × 4 fonts × 2 densités
- **Suivi budget** : dépenses fixes, dépenses variables, gains — par catégorie, par mois
- **13 catégories** avec couleurs OKLCH harmoniques
- **OCR** : lecture de screenshots bancaires (Société Générale + Revolut)
- **Auto-catégorisation** : 20+ règles regex
- **Sync cloud** : pull depuis Cloudflare KV au déverrouillage
- **Carryover** : report du solde négatif sur le mois suivant
- **Edit mode** : tweaks live via postMessage depuis une fenêtre parente
- **Charts** : composants SVG (Bars, Spark, Donut)
- **Worker URL** : `manibudgetpro.emmanueldelasse.workers.dev`

---

## État actuel

- Branche de développement active : `claude/youthful-davinci-KWbbU`
- Arbre de travail propre (pas de changements non commités)
- Historique récent : fichiers supprimés puis ré-uploadés (réorganisation)
- Pas de README, pas de CLAUDE.md, pas de SESSION.md (créé maintenant)

---

## Prochaine étape prioritaire

> À définir avec l'utilisateur en début de session suivante.

Demander : "Sur quoi veux-tu travailler aujourd'hui ?" et orienter selon les pistes habituelles :
- Bugs UI / comportement inattendu
- Nouvelles fonctionnalités (export, graphiques, objectifs)
- Amélioration du sync Cloudflare
- Refactoring / performance
- OCR / auto-catégorisation

---

## Décisions techniques notables

| Décision | Raison |
|----------|--------|
| Pas de build step (Babel CDN) | Déploiement ultra-simple, pas de node_modules |
| Cloudflare Workers + KV | Edge storage gratuit, latence faible |
| WebAuthn plutôt que mot de passe | Sécurité biométrique native iOS/Android |
| Données dans budget.json | Fichier unique, facile à versionner et éditer |
| OKLCH pour les couleurs | Perceptuellement uniforme, bon pour les thèmes |

---

## Commandes de reprise rapide

```
# Voir l'app
open index.html (ou serveur local : npx serve .)

# Vérifier l'état git
git status
git log --oneline -10

# Accéder au worker Cloudflare
# URL : https://manibudgetpro.emmanueldelasse.workers.dev
```

---

*Généré par Claude Code · Format : copier-coller direct sur GitHub*
