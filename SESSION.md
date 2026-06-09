# SESSION.md — Mani Budget Pro

## Informations de session
- **Date de création** : 2026-06-09
- **IA utilisée** : Claude (claude-sonnet-4-6)
- **Branche active** : `claude/youthful-davinci-1751e2`
- **Repo GitHub** : `emmanueldelasse-droid/mani-budget-pro`

---

## Description du projet

**Mani Budget Pro (mbp.)** est une application web de gestion budgétaire personnelle, conçue pour un suivi financier hors ligne sécurisé avec synchronisation cloud.

- **Type** : Single Page Application (React + Cloudflare Workers)
- **Langue** : Interface entièrement en français
- **Utilisateur cible** : Usage personnel, utilisateurs francophones
- **URL Worker** : `https://manibudgetpro.emmanueldelasse.workers.dev`

---

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | React 18.3.1 (UMD), Babel standalone, CSS-in-JS |
| Auth | WebAuthn (Face ID / Touch ID) + token localStorage |
| Backend | Cloudflare Workers + Cloudflare KV |
| Design | Thèmes multiples (Editorial, Minimal, Fintech, Terminal) |
| Polices | Fraunces, Inter, JetBrains Mono, Space Grotesk |

---

## Structure du projet

```
Mani-Budget-Pro/
├── SESSION.md                 ← fichier de continuité IA
├── index.html                 # Point d'entrée HTML
├── components/
│   ├── app.jsx               # App principale + LockScreen + TweaksPanel
│   ├── data.jsx              # Chargement données + helpers
│   ├── screens.jsx           # Écrans Home/Month/Accounts/History
│   ├── screens2.jsx          # Ajout transaction + panneau OCR
│   ├── store.jsx             # State management + sync Cloudflare
│   └── ios-frame.jsx         # Composants UI iOS + device frame
└── data/
    └── budget.json           # Données budget 2023-2024 (~340KB)
```

---

## Fonctionnalités implémentées

### ✅ Authentification
- Biométrique via WebAuthn (Face ID / Touch ID)
- Fallback token avec persistance localStorage
- Déverrouillage automatique si token déjà sauvegardé

### ✅ Gestion des données
- Stockage hybride : localStorage (hors ligne) + Cloudflare KV (cloud)
- Synchronisation cloud automatique au déverrouillage
- Déduplication des transactions

### ✅ Suivi budgétaire
- Écran d'accueil (dashboard mensuel)
- Vue détaillée par mois (dépenses fixes + variables)
- Gestion des comptes
- Historique des transactions avec filtres
- Analyse par catégories
- Objectifs financiers

### ✅ Saisie de transactions
- Saisie manuelle (fixe / variable)
- OCR pour captures d'écran bancaires (Société Générale, Revolut)
- Catégorisation automatique via règles regex
- Swipe-to-delete (mobile)

### ✅ Visualisation
- Graphiques en barres
- Donut charts par catégorie
- Graphiques sparkline (tendances)
- Affichage couleur par catégorie (13 catégories)

### ✅ Personnalisation
- 4 thèmes visuels
- 6 couleurs d'accent (rouille, indigo, vert, rose, ambre, cyan)
- 4 familles de polices
- Mode compact / confortable
- Mode édition live

---

## Modèle de données

### Budget JSON
```json
{
  "months": [
    {
      "year": 2024, "month": 6,
      "label": "Juin 2024",
      "monthKey": "2024-06",
      "salaire": 3500,
      "depFixes": [...],
      "depVar": [...],
      "gains": [...]
    }
  ]
}
```

### Transaction
```json
{
  "id": "1717200000000",
  "monthKey": "2024-06",
  "detail": "Loyer",
  "amount": 850,
  "category": "Logement",
  "type": "fixe",
  "date": "2024-06-01",
  "day": 1
}
```

---

## État actuel du code

- **Arbre git propre** : aucun changement non commité
- **Dernier commit** : `32bdc6c` — "Add files via upload" (il y a ~7 semaines)
- **Lignes de code** : ~2 097 lignes JSX/HTML
- **Taille totale** : ~500 KB (hors .git)

---

## Catégories de dépenses

| Catégorie | Usage |
|-----------|-------|
| Logement | Loyer, charges |
| Courses | Alimentation quotidienne |
| Resto & Café | Sorties restaurant |
| Transport | Déplacements |
| Abonnements | Netflix, Spotify, etc. |
| Loisirs | Sorties, activités |
| Santé & Beauté | Pharmacie, coiffeur |
| Vêtements | Habillement |
| Assurances | Contrats d'assurance |
| Frais | Frais bancaires, admin |
| Enfants | Dépenses enfants |
| Virements | Transferts internes |
| Autre | Non catégorisé |

---

## Tâches accomplies (cette session)

- [x] Exploration complète de la base de code
- [x] Création du fichier SESSION.md avec contexte projet complet
- [x] Documentation de l'architecture, du stack et des fonctionnalités

---

## Bugs connus / Points d'attention

- Aucun bug connu documenté pour le moment
- L'OCR référence l'API Claude — à vérifier si la clé est configurée côté Worker
- Le fichier `budget.json` contient des données de test 2023-2024 (pas de données réelles)

---

## Prochaine étape prioritaire

> **À définir avec le développeur** — aucune tâche en cours identifiée dans l'historique git récent.
>
> Pistes possibles selon l'état du projet :
> - Ajouter de nouvelles fonctionnalités (exports PDF/CSV, rappels, statistiques annuelles)
> - Améliorer l'OCR ou l'intégration Claude API
> - Optimiser les performances (bundle size, lazy loading)
> - Ajouter des tests unitaires

---

## Commandes utiles

```bash
# Ouvrir en local (pas de build nécessaire — vanilla React)
open index.html

# Ou servir localement
npx serve .

# Git — branche de développement active
git checkout claude/youthful-davinci-1751e2
```

---

## Contexte pour reprendre

Pour reprendre le travail sur ce projet :
1. Lire ce SESSION.md pour le contexte
2. Vérifier `git status` et `git log --oneline -5`
3. Le token d'accès Cloudflare Worker est stocké dans le localStorage de l'utilisateur (côté navigateur)
4. Les modifications frontend ne nécessitent pas de build — modifier les `.jsx` et recharger la page
5. Toute modification du Worker Cloudflare nécessite un accès au dashboard Cloudflare

---

*Fichier généré automatiquement le 2026-06-09 par Claude (claude-sonnet-4-6)*
