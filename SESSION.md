# SESSION.md — Mani Budget Pro

## Projet
Application web de gestion de budget personnel (finance tracker), SPA React vanilla via CDN, avec authentification biométrique (WebAuthn), système de thèmes, et synchronisation via Cloudflare Workers.

## Stack technique
- **Frontend** : React 18 (UMD CDN), Babel standalone, CSS variables
- **Backend** : Cloudflare Workers (sync des données)
- **Auth** : WebAuthn / biométrie (écran de verrouillage)
- **Data** : `budget.json` (revenus/dépenses par catégorie et par mois)

## Architecture des fichiers
| Fichier | Rôle |
|---------|------|
| `index.html` | Point d'entrée, charge les CDN et scripts |
| `app.jsx` | Contrôleur principal, lock screen, gestion des thèmes (Editorial, Minimal, Fintech, Terminal) |
| `screens.jsx` | Dashboard — onglets Home, Month, Accounts, History, graphiques/sparklines |
| `screens2.jsx` | Écran Settings |
| `data.jsx` | Module données — charge `budget.json`, helpers de formatage (monnaie, dates) |
| `store.jsx` | State management, logique de sync Cloudflare Workers |
| `budget.json` | Données core : revenus/dépenses catégorisés par mois |

## État actuel
- Fonctionnalités core terminées : suivi budgétaire mensuel, historique des transactions, catégorisation des dépenses, analytics avec graphiques
- Système de thèmes (4 thèmes) fonctionnel
- Authentification biométrique en place
- Sync Cloudflare Workers intégrée

## Dernière session
- **Date** : 2026-06-01
- **IA** : Claude (claude-sonnet-4-6)
- **Tâches accomplies** :
  - Mise en place du fichier SESSION.md initial pour la continuité de session
  - Exploration complète de l'architecture du projet
- **Décisions** : Adoption du système SESSION.md pour continuité inter-sessions et inter-IA

## Prochaine étape prioritaire
> À définir — décrire ici la prochaine tâche avant de terminer la prochaine session.

## Contexte pour reprendre
- Le projet tourne en SPA pure, pas de bundler (Babel standalone dans le browser)
- La sync se fait via `store.jsx` → Cloudflare Workers
- Pour tester : ouvrir `index.html` directement ou via un serveur local
- Branch de dev active : `claude/youthful-davinci-3c7rp`

---
*Mis à jour le 2026-06-01 — Claude Code*
