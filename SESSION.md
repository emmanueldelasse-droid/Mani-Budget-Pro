# SESSION.md — Mani Budget Pro

## Méta-session

| Champ | Valeur |
|-------|--------|
| **Date** | 2026-06-11 |
| **IA utilisée** | Claude (claude-sonnet-4-6) |
| **Branche** | `claude/youthful-davinci-8dzz2d` |
| **Statut du repo** | Propre — aucune modification non commitée |

---

## Description du projet

**Mani Budget Pro** est une application web de gestion budgétaire personnelle (SPA) construite en React 18 + JSX avec transpilation Babel dans le navigateur (pas de build pipeline). Le backend repose sur Cloudflare Workers + Cloudflare KV pour la synchronisation cloud.

**URL Worker** : `manibudgetpro.emmanueldelasse.workers.dev`

---

## Architecture

```
Mani-Budget-Pro/
├── index.html           # Shell HTML, imports CDN (React 18.3.1, Babel 7.29.0)
├── SESSION.md           # Ce fichier — continuité IA
├── components/
│   ├── app.jsx          # App principale : 5 onglets, écran de verrouillage WebAuthn, thèmes
│   ├── screens.jsx      # Écrans UI principaux (690 lignes)
│   ├── screens2.jsx     # Écrans UI secondaires (411 lignes)
│   ├── store.jsx        # State management : localStorage + Cloudflare KV sync
│   ├── data.jsx         # Chargement budget.json, helpers de formatage (fmtEur, etc.)
│   └── ios-frame.jsx    # Présentation style iOS (frame mobile)
└── data/
    └── budget.json      # Base de données budgétaire (~340 KB, historique complet)
```

---

## État actuel du projet

### Fonctionnalités implémentées ✅
- Interface à 5 onglets
- Écran de verrouillage avec authentification biométrique (WebAuthn / Face ID / Touch ID)
- Double persistance : localStorage (local) + Cloudflare KV (cloud)
- Système de thèmes : 4 thèmes (Editorial, Minimal, Fintech, Terminal) × 6 couleurs d'accent
- Suivi budgétaire : dépenses fixes/variables, gains, virements, breakdown par catégorie
- Support multi-mois : création de mois, copie des charges fixes, gestion des découverts
- Déduplication des transactions (matching par détail + montant)
- Localisation française : noms de mois, formatage EUR, UI en français

### Technologies
- React 18.3.1 via CDN
- Babel 7.29.0 (transpilation navigateur)
- Cloudflare Workers (API backend)
- Cloudflare KV (persistance cloud)
- WebAuthn (authentification biométrique)
- localStorage (persistance locale)
- Données au format JSON

---

## Historique des commits récents

```
32bdc6c - Add files via upload
4a1801c - Add files via upload
40c775a - Add files via upload
b3ff546 - Add files via upload
523179b - Add files via upload
b70500e - Delete store.jsx
cd73aa1 - Delete screens2.jsx
0db94f8 - Delete screens.jsx
c30c0de - Delete ios-frame.jsx
2813ed9 - Delete data.jsx
```

*(Les commits récents montrent une réorganisation/réimport des fichiers sources)*

---

## Tâches accomplies cette session

- [x] Analyse complète de l'architecture et des fichiers sources
- [x] Création du fichier SESSION.md (système de continuité IA)
- [x] Mise en place du workflow de continuité pour les futures sessions

---

## Bugs connus / Points d'attention

- Aucun bug identifié à ce stade
- La transpilation Babel en navigateur peut être lente sur des appareils peu puissants — à surveiller si des problèmes de performance remontent

---

## Décisions techniques notables

- **Pas de build pipeline** : choix délibéré pour simplifier le déploiement (fichiers statiques directs)
- **CDN pour les dépendances** : React et Babel chargés depuis unpkg/CDN — dépendance à la connectivité
- **Cloudflare Workers** : backend serverless, URL hardcodée dans `app.jsx`

---

## Fichiers modifiés cette session

| Fichier | Action | Description |
|---------|--------|-------------|
| `SESSION.md` | Créé | Fichier de continuité IA — première initialisation |

---

## Prochaine étape prioritaire

> **Définir avec l'utilisateur la fonctionnalité ou l'amélioration à développer en priorité.**

Pistes possibles identifiées lors de l'analyse :
1. Amélioration de la performance (Babel browser-side → précompilation)
2. Ajout de tests ou de validation des données
3. Nouvelles fonctionnalités UI (graphiques, exports, alertes budget)
4. Amélioration de la gestion des erreurs Cloudflare KV

---

## Contexte pour reprendre

Pour reprendre le développement :
1. Lire ce SESSION.md pour l'état du projet
2. Les composants clés à modifier : `screens.jsx` (UI principale), `store.jsx` (logique métier), `app.jsx` (navigation/auth)
3. Tester localement en ouvrant `index.html` dans un navigateur (serveur HTTP simple requis pour les modules)
4. Pousser les changements sur la branche `claude/youthful-davinci-8dzz2d`

---

*Généré automatiquement par Claude Code — 2026-06-11*
