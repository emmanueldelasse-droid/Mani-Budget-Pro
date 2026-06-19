# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. Charge ce fichier au début de chaque session pour retrouver le contexte exact du projet.

---

## Informations projet

| Champ | Valeur |
|-------|--------|
| **Projet** | Mani Budget Pro (mbp.) |
| **Repo GitHub** | emmanueldelasse-droid/Mani-Budget-Pro |
| **Branche principale** | main |
| **Dernière session** | 2026-06-19 |
| **IA utilisée** | Claude Sonnet 4.6 (Claude Code) |
| **Worker Cloudflare** | `https://manibudgetpro.emmanueldelasse.workers.dev` |

---

## Description du projet

Application de gestion de budget personnel en français. Interface mobile-first avec vue desktop (sidebar). Pas de build step — React 18 + Babel Standalone chargés via CDN, servie comme site statique.

---

## Architecture technique

### Stack
- **Frontend** : React 18 (UMD/CDN), Babel Standalone, HTML pur — pas de Node, pas de bundler
- **Backend** : Cloudflare Workers + KV (stockage cloud chiffré par token)
- **Auth** : Token secret `X-Budget-Token` + WebAuthn biométrique (Face ID / Touch ID)
- **Hébergement** : Cloudflare Pages ou équivalent (fichiers statiques)

### Structure des fichiers
```
Mani-Budget-Pro/
├── SESSION.md                  ← ce fichier
├── index.html                  ← point d'entrée, charge React + Babel + tous les JSX
├── components/
│   ├── data.jsx                ← charge budget.json, expose BUDGET, fmtEur, CAT_COLORS
│   ├── store.jsx               ← state management + sync Cloudflare KV + localStorage
│   ├── screens.jsx             ← ScreenHome, ScreenMois, ScreenAccounts, ScreenHistory + primitives UI
│   ├── screens2.jsx            ← ScreenAdd (saisie manuelle + OCR), ScreenMore, ScreenCharts, ScreenCategories, ScreenGoals
│   └── app.jsx                 ← App shell, LockScreen, TweaksPanel, DesktopShell, tab nav, thèmes
└── data/
    └── budget.json             ← données historiques (sept 2023 → présent)
```

### Ordre de chargement (index.html)
1. `data.jsx` → expose `window.__budgetReady` (Promise)
2. `store.jsx` → expose `window.__storeReady` (Promise), attend `__budgetReady`
3. `screens.jsx` → composants UI principaux
4. `screens2.jsx` → composants UI secondaires
5. `app.jsx` → `App`, attend `__storeReady` pour `ReactDOM.createRoot`

---

## Fonctionnalités implémentées

### Authentification
- [x] Lock screen avec token secret
- [x] Face ID / Touch ID via WebAuthn (`PublicKeyCredential`)
- [x] Auto-déverrouillage biométrique si token déjà enregistré
- [x] Fallback manuel (saisie du token)

### Navigation
- [x] 5 onglets : Accueil, Mois, Comptes, Historique, Plus
- [x] FAB (+) pour ajouter une transaction
- [x] Layout mobile (tab bar fixe en bas)
- [x] Layout desktop (sidebar 220px)
- [x] Sync status indicator (⟳ / ✓ / !)

### Thèmes & personnalisation (TweaksPanel)
- [x] 4 thèmes : Editorial, Minimal, Fintech, Terminal
- [x] 6 accents : rouille, indigo, vert, rose, ambre, cyan
- [x] 4 polices : serif (Fraunces), sans (Inter), mono (JetBrains Mono), grotesk (Space Grotesk)
- [x] 2 densités : compact, confortable
- [x] Mode édition activable via `postMessage` (éditeur externe)

### Données & état (store.jsx)
- [x] Chargement cloud first, fallback localStorage
- [x] Sync bidirectionnelle Cloudflare KV
- [x] Ajout de transactions (fixe ou variable)
- [x] Ajout de gains
- [x] Virements entre comptes
- [x] Création de nouveaux mois (avec copie des charges fixes)
- [x] Report automatique du découvert du mois précédent
- [x] Protection anti-doublon (`addTxSafe`, `addGainSafe`)
- [x] Suppression de transactions ajoutées
- [x] Reset complet

### Import OCR (screens2.jsx)
- [x] Import depuis screenshot bancaire (Société Générale + Revolut)
- [x] Sélection multiple de photos
- [x] Auto-catégorisation par règles regex
- [x] Dédup à l'import

### Écrans
- [x] ScreenHome — vue mensuelle résumée
- [x] ScreenMois — détail du mois (gains, charges fixes, dépenses variables)
- [x] ScreenAccounts — vue comptes
- [x] ScreenHistory — historique multi-mois
- [x] ScreenAdd — saisie manuelle + OCR
- [x] ScreenMore — paramètres, déconnexion, navigation avancée
- [x] ScreenCharts — graphiques
- [x] ScreenCategories — par catégorie
- [x] ScreenGoals — objectifs

### Catégories auto-détectées
Logement, Courses, Resto & Café, Transport, Abonnements, Loisirs, Santé & Beauté, Vêtements, Assurances, Virements, Frais, Autre

---

## Données historiques (budget.json)

- Historique depuis **septembre 2023**
- Dernier mois archivé : dépend du budget.json (vérifier `window.CURRENT_MONTH`)
- Structure par mois : `year`, `month`, `salaire`, `gains[]`, `depFixes[]`, `depVar[]`
- `depFixes` : charges fixes avec `day`, `detail`, `amount`, `category`
- `depVar` : dépenses variables avec `date`, `detail`, `amount`, `category`

---

## Variables globales exposées

| Variable | Type | Description |
|----------|------|-------------|
| `window.BUDGET` | Object | Données brutes de budget.json |
| `window.CURRENT_MONTH` | Object | Mois courant (dernier du tableau) |
| `window.MONTH_FR` | Array | Noms des mois en français |
| `window.STORE` | Object | Store principal (get, subscribe, addTx, etc.) |
| `window.__budgetReady` | Promise | Résolu quand budget.json est chargé |
| `window.__storeReady` | Promise | Résolu quand le store est initialisé |
| `window.fmtEur` | Function | Formateur monétaire `(n, {signed}) → string` |
| `window.fmtEurCompact` | Function | Format compact `(n) → "1.2k€"` |
| `window.CAT_COLORS` | Object | Couleurs OKLCH par catégorie |
| `window.MI_WORKER_URL` | String | URL du Worker Cloudflare |

---

## Points d'attention / connus

1. **Pas de build** — tout change dans les fichiers JSX directement, rechargement navigateur.
2. **WebAuthn en localhost** — Face ID ne fonctionne qu'en HTTPS ou localhost strict (rpId doit matcher hostname).
3. **budget.json en dur** — les données initiales viennent du fichier statique ; les ajouts utilisateur sont dans Cloudflare KV + localStorage.
4. **Ordre des scripts dans index.html** — critique : data.jsx → store.jsx → screens.jsx → screens2.jsx → app.jsx.
5. **Dédup par (detail + amount)** — le dédup ne tient pas compte de la date, seulement du detail (insensible à la casse) et du montant absolu.

---

## Prochaine étape prioritaire

**À définir lors de la prochaine session** — demande à l'utilisateur ce qu'il veut améliorer ou ajouter.

Pistes possibles identifiées lors de l'analyse du code :
- Améliorer le dédup (ajouter la date dans la clé)
- Ajouter un écran de saisie du salaire mensuel pour les nouveaux mois
- Améliorer l'OCR (ajouter d'autres banques)
- Ajouter des notifications / rappels
- Tests de non-régression sur le store

---

## Commandes utiles pour reprendre

```bash
# Voir l'état du repo
git status
git log --oneline -10

# Branche de développement active
git checkout claude/youthful-davinci-gnraq4

# Ouvrir l'app (ouvrir index.html dans un navigateur avec un serveur HTTP)
# Exemple : python3 -m http.server 8080
```

---

*Généré automatiquement le 2026-06-19 par Claude Code (session autonome).*
