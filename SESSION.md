# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. Colle ce contenu en début de session pour reprendre le contexte.

---

## Projet

**Nom :** Mani Budget Pro  
**Type :** PWA (Progressive Web App) de gestion budgétaire personnelle  
**Langue UI :** Français  
**Propriétaire :** Emmanuel Delasse

---

## Stack technique

- **Frontend :** React 18.3.1 + Babel Standalone (transpilation in-browser, pas de build)
- **Entrée :** `index.html` → charge les composants via `<script type="text/babel">`
- **Backend :** Cloudflare Workers (`https://manibudgetpro.emmanueldelasse.workers.dev`)
  - `GET/POST /budget` — lecture et écriture des données
  - `POST /ocr` — scan de reçus
- **Persistance :** Cloudflare KV (cloud) + localStorage (fallback local)
- **Style :** CSS-in-JS inline, système OKLCH, Google Fonts (Fraunces, Inter, JetBrains Mono, Space Grotesk)
- **Sécurité :** Token HTTP (X-Budget-Token) + WebAuthn biométrique (Face ID / Touch ID)

---

## Structure des fichiers

```
Mani-Budget-Pro/
├── index.html          # Point d'entrée unique, charge tout
├── components/
│   ├── app.jsx         # App principale, lock screen, theming (4 thèmes, 6 accents, 4 fonts)
│   ├── data.jsx        # Chargement des données budget, helpers
│   ├── store.jsx       # State management + persistance hybride KV/localStorage
│   ├── screens.jsx     # Dashboard, Home, Mois, Accounts, History, More
│   ├── screens2.jsx    # Écran Add (saisie manuelle + OCR), catégorisation auto
│   └── ios-frame.jsx   # Composants UI style iOS (non intégré dans le build actuel)
└── data/
    └── budget.json     # Base de données budget (~336 KB, 2+ ans de données)
```

---

## État actuel

### Fonctionnel et complet
- Navigation 5 onglets mobile + sidebar desktop
- **ScreenHome** — résumé mensuel, métriques clés
- **ScreenMois** — vue mois avec transactions
- **ScreenAccounts** — gestion des comptes
- **ScreenHistory** — navigation historique
- **ScreenMore** — paramètres, export, déconnexion
- **ScreenAdd** — saisie manuelle + OCR (scan de reçus)
- Système de thèmes complet (Editorial/Minimal/Fintech/Terminal × densité compact/confortable)
- Sécurité biométrique WebAuthn
- Sync cloud Cloudflare KV
- Carry-over automatique des dépenses fixes au mois suivant

### Partiellement implémenté (ébauches en place, à compléter)
| Écran | Fichier | État |
|-------|---------|------|
| `ScreenCharts` | screens.jsx ~l.545 | Basique, analytics à enrichir |
| `ScreenCategories` | screens.jsx ~l.605 | Basique, breakdown par catégorie |
| `ScreenGoals` | screens.jsx ~l.645 | Barres de progression présentes, pas de persistance |
| `ios-frame.jsx` | ios-frame.jsx | Bibliothèque UI iOS complète, non intégrée |

---

## Données

- Format mensuel : `{ year, month, salaire, gains[], depFixes[], depVar[] }`
- Transaction : `{ date|day, detail, amount, category, type: 'fixe'|'var' }`
- 13 catégories prédéfinies avec code couleur OKLCH
- Données depuis septembre 2023 jusqu'à présent
- Dernier mois en date : juin 2024 (dernier entrée dans `budget.json`)

---

## Dernières modifications (18 avril 2026)

- `app.jsx` : +127 lignes (+49%) — raffinements UI, stabilité
- `screens.jsx` : +115 lignes (+33%) — améliorations écrans principaux
- Commits en masse via upload (pas de messages sémantiques)

---

## Prochaine étape prioritaire

**Compléter `ScreenGoals`** : ajouter la persistance des objectifs d'épargne dans le store Cloudflare KV, en suivant le même pattern que les autres données dans `store.jsx`.

---

## Contexte pour reprendre

- Pas de build step — on édite directement les `.jsx` et `index.html`
- Pour tester : ouvrir `index.html` dans un navigateur (ou serveur local)
- Le worker Cloudflare est déjà déployé et fonctionnel
- `ios-frame.jsx` est une ressource disponible si on veut améliorer l'UI mobile
- Pas de README ni de documentation — ce fichier est la seule doc de continuité

---

## Historique des sessions

| Date | IA | Travail effectué |
|------|----|-----------------|
| 2026-06-20 | Claude (claude-sonnet-4-6) | Création initiale du SESSION.md — audit complet du projet, documentation de l'état et de la structure |
