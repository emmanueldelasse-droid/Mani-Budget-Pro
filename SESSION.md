# SESSION.md — Mani Budget Pro
> Fichier de continuité IA. À lire au début de chaque session avant de répondre.

---

## Identité du projet

- **Nom** : Mani Budget Pro
- **Repo** : `emmanueldelasse-droid/mani-budget-pro`
- **URL raw SESSION.md** : `https://raw.githubusercontent.com/emmanueldelasse-droid/Mani-Budget-Pro/main/SESSION.md`
- **Type** : Application web de gestion budgetaire personnelle (mobile-first)
- **Stack** : React 18 (CDN + Babel standalone) · Cloudflare Workers · Cloudflare KV · WebAuthn

---

## Architecture

```
Mani-Budget-Pro/
├── index.html              # Point d'entrée unique, charge tous les composants via <script>
├── data/
│   └── budget.json         # Données historiques (~15 000 lignes)
└── components/
    ├── data.jsx            # Helpers de formatage, couleurs, chargement données
    ├── store.jsx           # État global, persistance KV + localStorage, sync
    ├── app.jsx             # App principale, lock screen, thèmes, routage onglets
    ├── screens.jsx         # Accueil, Mois, Comptes, Historique
    ├── screens2.jsx        # AjouterTransaction, OCR, Plus
    └── ios-frame.jsx       # (Présent mais non importé — non utilisé)
```

**Worker Cloudflare** : `https://manibudgetpro.emmanueldelasse.workers.dev`

---

## Fonctionnalités implémentées ✅

| Domaine | Ce qui fonctionne |
|---------|------------------|
| Navigation | 5 onglets : Accueil, Mois, Comptes, Historique, Plus |
| Transactions | Ajout dépenses var/fixes, gains, catégorisation (12 catégories) |
| Comptes | Compte principal, Compte B, Vinted, Vacances |
| Mois | Création mois suivant avec copie des fixes + report des déficits |
| Sync | Cloud via KV avec fallback localStorage, indicateur de statut |
| Sécurité | Lock screen + WebAuthn (Face ID / Touch ID) + token manuel |
| OCR | Import screenshots banque (Société Générale, Revolut) via Claude Vision API |
| Thèmes | 5 thèmes (Editorial, Minimal, Fintech, Terminal) · 6 couleurs d'accent · 4 polices |
| Layout | Responsive mobile (tab bar + FAB) et desktop (sidebar) |
| Données | Export/import JSON · Détection doublons · Sparklines · Donuts catégories |

---

## Fonctionnalités incomplètes / stubs ⚠️

| Écran / Feature | Statut | Détail |
|----------------|--------|--------|
| `ScreenCharts` | Stub — non implémenté | Référencé dans `app.jsx:214` |
| `ScreenCategories` | Stub — non implémenté | Référencé dans `app.jsx:215` |
| `ScreenGoals` | Stub — non implémenté | Référencé dans `app.jsx:216` |
| `ScreenAccounts` | Partiellement implémenté | Tronqué en milieu de composant (`screens.jsx` ~ligne 500) |
| OCR multi-photos | `runOcrMultiple` appelé mais non défini | `screens2.jsx:34` |
| UI d'édition de transaction | Infrastructure présente (`app.jsx:170-177`) | Pas de panneau d'édition |
| Système de transferts | `addTransfer` existe dans store | Pas d'UI pour afficher les transferts |
| `goals` | Champ alloué dans store | Jamais utilisé |
| `compteBEntries` | Alloué dans store | Jamais peuplé |

---

## Décisions techniques clés

- **Pas de build step** : JSX transpilé directement dans le navigateur via `@babel/standalone`. Simple à déployer, moins performant en prod.
- **Données dans KV** : Une clé par utilisateur (token → données JSON sérialisées). Limite : tout le budget en une seule valeur.
- **Couleurs OKLCH** : Palette harmonieuse générée en OKLCH pour les catégories.
- **Déduplication OCR** : Comparaison insensible à la casse sur montant + marchand + date.
- **Déficits reportés** : `Math.abs(solde)` au changement de mois — à vérifier si logique correcte.

---

## Problèmes connus / bugs

1. **Quota localStorage** : Aucune vérification en cas de dépassement avec `budget.json` volumineux.
2. **Dates invalides** : Pas de validation pour des dates comme 30 fév.
3. **Retry OCR** : Pas de mécanisme de retry sans re-upload après un échec.
4. **`window.Card` / `window.iconBtn`** : Globaux attendus dans `screens2.jsx` — leur exposition dépend de l'ordre de chargement des scripts.
5. **Token non validé** : Aucune vérification de format/force du token.

---

## Dernière session

- **Date** : 2026-04-26
- **IA utilisée** : Claude (claude-sonnet-4-6) via Claude Code
- **Branche active** : `claude/youthful-davinci-HetZ2`
- **Tâches accomplies** :
  - Création de ce fichier `SESSION.md` pour le système de continuité IA
  - Analyse complète du codebase (architecture, features, gaps)
- **Fichiers modifiés** :
  - `SESSION.md` (créé)
- **Décisions** : Aucune décision de code prise — session d'analyse et mise en place continuité

---

## Prochaine étape prioritaire

**Implémenter `ScreenAccounts` complètement** — l'écran Comptes est tronqué et est probablement le plus utilisé après l'écran principal. Compléter l'affichage de Compte B, Vinted, Vacances avec leurs entrées et soldes.

---

## Contexte pour reprendre

Pour reprendre rapidement :
1. Le fichier `index.html` charge les composants dans cet ordre : `data.jsx` → `store.jsx` → `app.jsx` → `screens.jsx` → `screens2.jsx`
2. L'état global est dans `store.jsx` via `window.useBudgetStore` (pattern Zustand-like maison)
3. Les thèmes sont gérés par des variables CSS injectées dans `<style>` par `app.jsx`
4. Le Worker Cloudflare gère : `/api/data` (GET/POST budget), `/api/ocr` (POST screenshot → Claude Vision)
5. Le token d'accès est stocké dans `localStorage` sous la clé `mi_token`
