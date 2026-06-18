# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. À coller en début de session pour reprendre le contexte immédiatement.

---

## Informations projet

| Champ | Valeur |
|-------|--------|
| **Projet** | Mani Budget Pro |
| **Type** | Application web SPA — Gestion budgétaire personnelle |
| **Stack** | React 18 (CDN + Babel standalone), CSS variables, Cloudflare Workers + KV |
| **Langue UI** | Français |
| **Repo** | `emmanueldelasse-droid/mani-budget-pro` |
| **Branche active** | `claude/youthful-davinci-dqjsh3` |
| **Dernière session** | 2026-06-18 — Claude (claude-sonnet-4-6) |

---

## Architecture en un coup d'œil

```
Mani-Budget-Pro/
├── index.html          # Point d'entrée, chargement CDN React + Babel
├── components/
│   ├── app.jsx         # Composant racine, routing, thèmes (321 lignes)
│   ├── data.jsx        # Chargeur de données + helpers (78 lignes)
│   ├── store.jsx       # Couche persistance : Cloudflare KV + localStorage (225 lignes)
│   ├── screens.jsx     # Écrans principaux : Accueil, Mois, Comptes, Historique (690 lignes)
│   ├── screens2.jsx    # Écrans secondaires : Tendances, Catégories, Objectifs, Ajout, Plus (411 lignes)
│   └── ios-frame.jsx   # Composants UI style iOS (338 lignes)
└── data/
    └── budget.json     # Données budget (~330 Ko) — mois depuis sept. 2023
```

**Aucun package.json** — zéro dépendance npm, tout est chargé via CDN.

---

## Fonctionnalités principales

- **Dashboard Accueil** : solde mensuel, résumé revenus/dépenses, barre progression budget, dernières transactions
- **Vue Mois** : détail revenus/dépenses, ajout rapide inline, suppression par swipe
- **Comptes secondaires** : Compte B, ventes Vinted, cagnotte vacances
- **Historique** : vue chronologique, moyenne solde, sparkline tendance, création de mois
- **Tendances** : graphiques solde, camembert catégories, analyse salaire
- **Catégories** : répartition mensuelle avec pourcentages
- **Objectifs** : suivi épargne (vacances, urgence, scooter, école) avec barres de progression
- **Ajout de transaction** : dépense / revenu / virement + scan OCR (Claude API)
- **Paramètres** : export/import JSON, reset, 4 thèmes (Editorial, Minimal, Fintech, Terminal)
- **Auth biométrique** : WebAuthn (Face ID / Touch ID) + tokens
- **Sync cloud** : Cloudflare KV via worker `manibudgetpro.emmanueldelasse.workers.dev`
- **OCR** : Analyse de captures Société Générale / Revolut via Claude API sur Cloudflare Worker
- **Responsive** : mobile (tabbar) + desktop (sidebar)

---

## État actuel du projet

### Ce qui fonctionne
- Structure de fichiers complète : `app.jsx`, `data.jsx`, `store.jsx`, `screens.jsx`, `screens2.jsx`, `ios-frame.jsx`
- Données budget dans `data/budget.json` (historique depuis sept. 2023)
- Système de thèmes CSS (4 thèmes, variables CSS dynamiques)
- Architecture store réactive (`window.STORE`)

### Historique git récent
Les commits récents sont des uploads manuels (`Add files via upload`) — pas de développement structuré visible. Le projet semble avoir été uploadé en blocs depuis une machine locale.

### Fichiers modifiés lors de cette session
- `SESSION.md` — créé (ce fichier)

---

## Décisions techniques

| Décision | Raison |
|----------|--------|
| React via CDN + Babel standalone | Pas de build tool, déploiement direct |
| Cloudflare KV pour persistence | Sync multi-device sans backend custom |
| CSS variables pour les thèmes | Changement de thème sans rechargement |
| OCR via Claude API (Cloudflare Worker) | Scan de relevés bancaires automatisé |
| WebAuthn pour l'auth | Pas de mot de passe, biométrie native |

---

## Prochaine étape prioritaire

> **Définir et implémenter la prochaine fonctionnalité ou correction** — aucune tâche en cours identifiée lors de cette session. À préciser en début de prochaine session.

---

## Contexte pour reprendre

- L'app tourne entièrement dans le navigateur (ouvre `index.html` directement ou via un serveur HTTP simple)
- Le worker Cloudflare est séparé du repo — son code n'est pas versionné ici
- Les données réelles sont dans `data/budget.json` — fichier volumineux (~330 Ko)
- Toute modification de `screens.jsx` / `screens2.jsx` impacte l'UI directement
- Les thèmes sont définis dans `app.jsx` (objet `THEMES`)
- L'OCR est dans `screens2.jsx` (ScreenAdd) — appelle le worker via fetch

---

## Template prompt de début de session

```
Lis ce SESSION.md avant de commencer :
[colle ici le contenu de ce fichier]

Résume en 3 lignes : projet, état actuel, prochaine étape prioritaire.
Puis demande-moi ce que je veux faire aujourd'hui.
```

---

*Généré le 2026-06-18 par Claude (claude-sonnet-4-6) — branch `claude/youthful-davinci-dqjsh3`*
