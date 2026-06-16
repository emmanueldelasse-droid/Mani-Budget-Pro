# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. À lire en début de session avant toute réponse.

---

## Informations générales

| Champ | Valeur |
|-------|--------|
| **Projet** | Mani Budget Pro (mbp.) |
| **Repo GitHub** | `emmanueldelasse-droid/Mani-Budget-Pro` |
| **URL raw** | `https://raw.githubusercontent.com/emmanueldelasse-droid/Mani-Budget-Pro/main/SESSION.md` |
| **Dernière session** | 2026-06-16 |
| **IA utilisée** | Claude (claude-sonnet-4-6) |
| **Branche active** | `main` |

---

## Description du projet

Application web de **gestion budgétaire personnelle** en français. Interface mobile-first de type iOS 26, avec :

- Suivi des dépenses fixes et variables par mois
- Ajout manuel de transactions ou par OCR (captures bancaires SG, Revolut)
- Catégorisation automatique (13 catégories)
- Authentification biométrique (WebAuthn / Face ID / Touch ID)
- Synchronisation cloud via **Cloudflare Workers KV**
- 4 thèmes visuels × 6 couleurs d'accent × 4 polices × 2 densités
- Interface responsive : tab bar mobile / sidebar desktop

**Tech stack** : React 18 (CDN, sans build), JSX via Babel, CSS inline, Cloudflare Worker.  
**Worker URL** : `https://manibudgetpro.emmanueldelasse.workers.dev`  
**Aucun package.json** — l'app tourne directement dans le navigateur.

---

## Architecture des fichiers

```
Mani-Budget-Pro/
├── index.html            ← Point d'entrée, charge tous les composants JSX
├── components/
│   ├── app.jsx           ← Orchestrateur : lock screen, thème, routing, layout
│   ├── data.jsx          ← Chargement budget.json, helpers (formatEUR, CAT_COLORS)
│   ├── store.jsx         ← État global : CRUD transactions, sync localStorage + KV
│   ├── screens.jsx       ← Écrans principaux : Home, Mois, Comptes, Historique
│   ├── screens2.jsx      ← Ajout transaction, OCR bancaire, Paramètres
│   └── ios-frame.jsx     ← Composants UI iOS 26 (status bar, nav bar, pills)
└── data/
    └── budget.json       ← Base de données budgétaire (~333 KB)
```

**Globals window** : `BUDGET`, `STORE`, `CAT_COLORS`, `MONTH_FR`, `__budgetReady`, `__storeReady`

---

## État actuel du projet

- **Statut** : Fonctionnel, production-ready
- **Working tree** : Propre (aucune modification non committée)
- **Derniers commits** : Réorganisation des fichiers (suppression + re-upload de tous les composants)
- **SESSION.md** : Créé pour la première fois aujourd'hui

---

## Tâches accomplies (session du 2026-06-16)

- [x] Analyse complète de l'architecture du projet
- [x] Création du fichier `SESSION.md` initial à la racine du repo
- [x] Mise en place du système de continuité IA

---

## Bugs connus / Points d'attention

- Aucun bug documenté à ce jour
- L'OCR bancaire (screens2.jsx) est spécifique à Société Générale et Revolut — formats d'autres banques non supportés
- L'auth WebAuthn est optionnelle (fallback token)
- Pas de gestion d'erreur explicite si le Worker Cloudflare est indisponible

---

## Décisions techniques importantes

- **Pas de build** : React chargé via CDN, JSX transpilé par Babel en runtime. Simplifie le déploiement mais limite les optimisations.
- **État global via window** : Pas de Redux/Context — les composants communiquent via `window.STORE` et un système d'abonnement custom.
- **Persistance duale** : localStorage (offline) + Cloudflare KV (sync multi-device).
- **Styles inline** : Pas de fichier CSS externe — tout est géré en JS pour supporter le theming dynamique.

---

## Prochaine étape prioritaire

> **Définir la roadmap** : Identifier les fonctionnalités manquantes ou améliorations prioritaires (ex: export CSV, graphiques avancés, support d'autres banques pour l'OCR, gestion multi-comptes, etc.).

---

## Contexte pour reprendre

Pour reprendre le développement :
1. Lire ce fichier en premier
2. Le projet n'a **pas de serveur local** — ouvre `index.html` directement dans un navigateur ou via un serveur statique simple (`python -m http.server`)
3. Les données sont dans `data/budget.json` — structure : `{ months: [{ year, month, salaire, gains[], depFixes[], depVar[] }] }`
4. Pour tester la sync cloud, le Worker Cloudflare doit être accessible
5. L'authentification token est stockée dans `localStorage` sous la clé `mbp_token`

---

## Commande de fin de session

Quand tu dis **"on approche de la fin"**, **"tokens"**, **"sauvegarde la session"** ou similaire → génère IMMÉDIATEMENT le SESSION.md complet mis à jour avant toute autre réponse.
