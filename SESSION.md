# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. À lire en début de session, à mettre à jour en fin de session.
> Mot-clé de fin de session : **"on approche de la fin"** → l'IA génère immédiatement ce fichier mis à jour.

---

## Projet

**Nom :** Mani Budget Pro  
**Repo :** `emmanueldelasse-droid/mani-budget-pro`  
**Branche de dev :** `claude/youthful-davinci-bLKpV`  
**Type :** Application budget personnelle — React (vanilla, Babel standalone), frontend-only, déployable statique  
**Langue UI :** Français  

---

## Architecture technique

```
Mani-Budget-Pro/
├── index.html              ← Point d'entrée, charge React + Babel + les modules
├── SESSION.md              ← Ce fichier
├── components/
│   ├── data.jsx            ← Charge budget.json, expose BUDGET, fmtEur, CAT_COLORS
│   ├── store.jsx           ← State manager (localStorage + Cloudflare KV via worker)
│   ├── app.jsx             ← Composant racine / routeur
│   ├── screens.jsx         ← Écrans principaux (~690 lignes)
│   ├── screens2.jsx        ← Écrans secondaires (~411 lignes)
│   └── ios-frame.jsx       ← Wrapper frame iOS (~338 lignes)
└── data/
    └── budget.json         ← Données budget statiques (mois, dépenses, gains)
```

**Stack :**
- React 18.3.1 (UMD), ReactDOM, Babel Standalone 7.29 — pas de bundler
- Persistence : `localStorage` (clé `mi:store:v1`) + Cloudflare KV via `window.MI_WORKER_URL`
- Authentification : token simple via `localStorage` (`mi:token`)
- Fonts : Fraunces, Inter, JetBrains Mono, Space Grotesk (Google Fonts)

**Globals exposés par data.jsx :**
- `window.BUDGET` — données brutes du JSON
- `window.MONTH_FR` — noms des mois en français
- `window.fmtEur(n)` — formateur monétaire (ex: `−1 234,56 €`)
- `window.fmtEurCompact(n)` — format compact (ex: `1.2k€`)
- `window.CAT_COLORS` — palette OKLCH par catégorie
- `window.CAT_ORDER` — ordre d'affichage des catégories
- `window.CURRENT_MONTH` — dernier mois du JSON

**Catégories disponibles :**
Logement, Virements, Courses, Resto & Café, Transport, Abonnements, Loisirs, Santé & Beauté, Vêtements, Assurances, Frais, Enfants, Autre

---

## État actuel du projet

- **Date de dernière mise à jour :** 2026-04-30
- **IA utilisée :** Claude (claude-sonnet-4-6)
- **Statut :** Base fonctionnelle en place — architecture store + screens opérationnelle

### Ce qui est implémenté
- Chargement et affichage des données budget depuis `budget.json`
- Store avec persistence localStorage + sync Cloudflare KV
- Déduplication des transactions (`addTxSafe`, `addGainSafe`)
- Création de mois suivant avec copie des charges fixes + report du découvert
- Navigation multi-écrans (app.jsx + screens.jsx + screens2.jsx)
- Frame iOS (ios-frame.jsx) pour un rendu mobile-first
- Formatage monétaire cohérent (fmtEur, fmtEurCompact)

### Fichiers critiques à ne pas casser
- `store.jsx` : toute la logique métier — ne pas toucher sans comprendre les dépendances `__budgetReady` / `__storeReady`
- `data.jsx` : ordre de chargement important — doit s'exécuter avant store.jsx et les composants
- `index.html` : ordre des `<script>` est impératif (data → store → screens → screens2 → app)

---

## Prochaine étape prioritaire

> **À définir avec l'utilisateur en début de session.**

Demander : "Qu'est-ce qu'on fait aujourd'hui sur Mani Budget Pro ?"

---

## Décisions techniques prises

- **Pas de bundler** : choix délibéré pour déploiement simple (GitHub Pages, Cloudflare Pages, etc.)
- **Babel Standalone** : permet JSX sans compilation locale, acceptable pour ce type d'app
- **Cloudflare KV** comme backend : persistence cross-device légère sans base de données
- **Token simple** (pas JWT) : suffisant pour usage personnel/familial

---

## Bugs connus / Points d'attention

- Le worker Cloudflare (`window.MI_WORKER_URL`) doit être défini quelque part (probablement dans index.html ou via une variable d'environnement au déploiement) — à vérifier si non défini en local
- L'ordre de chargement des scripts dans index.html est fragile — tout ajout de module doit respecter la chaîne de promesses `__budgetReady` → `__storeReady`

---

## Historique des sessions

| Date | IA | Résumé |
|------|----|--------|
| 2026-04-30 | Claude sonnet-4-6 | Mise en place du système SESSION.md — initialisation du fichier de continuité |
