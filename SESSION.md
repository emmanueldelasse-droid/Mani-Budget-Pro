# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. Mis à jour à chaque fin de session.
> Pour reprendre : colle ce fichier en début de conversation IA.

---

## Projet

**Nom** : Mani Budget Pro
**Repo** : `emmanueldelasse-droid/Mani-Budget-Pro`
**Branch de travail** : `claude/youthful-davinci-dU8Zb`
**URL raw** : `https://raw.githubusercontent.com/emmanueldelasse-droid/Mani-Budget-Pro/main/SESSION.md`

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18.3.1 (CDN, sans build step) |
| JSX | Babel Standalone 7.29.0 (transpilation in-browser) |
| Backend/Sync | Cloudflare Workers (`manibudgetpro.emmanueldelasse.workers.dev`) |
| Stockage cloud | Cloudflare KV |
| Stockage local | localStorage |
| Auth | WebAuthn (Face ID / Touch ID) |
| Style | CSS custom + variables OKLCH |

### Structure des fichiers

```
Mani-Budget-Pro/
├── index.html          # Entry point + chargement CDN
├── components/
│   ├── app.jsx         # App root, lock screen, thèmes
│   ├── data.jsx        # Chargement données & helpers
│   ├── store.jsx       # State management + sync KV
│   ├── screens.jsx     # Écrans principaux (Home, Mois, Comptes, Historique)
│   ├── screens2.jsx    # Écrans secondaires (Goals, Catégories, etc.)
│   └── ios-frame.jsx   # Cadre iOS wrapper
└── data/
    └── budget.json     # Données budget mensuelles
```

---

## Fonctionnalités implémentées

- [x] Lock screen avec biométrie WebAuthn (Face ID / Touch ID)
- [x] Auth par token (localStorage)
- [x] 5 onglets : Accueil, Mois, Comptes, Historique, Plus
- [x] Budget mensuel (salaire, dépenses fixes, dépenses variables, gains)
- [x] 13 catégories de dépenses
- [x] Sync cloud via Cloudflare Workers/KV
- [x] Système de thèmes : editorial, minimal, fintech, terminal
- [x] 6 couleurs accent : rouille, indigo, vert, rose, ambre, cyan
- [x] 4 options de police : serif, sans, mono, grotesk
- [x] Densité : compact / confortable
- [x] Suivi des virements budget
- [x] Gestion découvert (report automatique mois suivant)
- [x] Détection des doublons de transactions

---

## Historique des sessions

### 2026-05-26 — Initialisation SESSION.md
- **IA** : Claude (claude-sonnet-4-6) via Claude Code
- **Accompli** : Création du fichier SESSION.md de continuité
- **Contexte** : Mise en place du système de continuité IA selon le guide fourni

---

## État actuel

- Branche : `claude/youthful-davinci-dU8Zb` (active, propre)
- Derniers commits (2026-04-18) : upload de fichiers après suppression/réorganisation
- Aucun bug connu ouvert

---

## Prochaine étape prioritaire

_À définir — aucune tâche en cours au moment de cette initialisation._

---

## Pour reprendre une session

Colle ce message à l'IA en début de conversation :

```
Lis ce SESSION.md avant de commencer :
[colle ici le contenu brut de ce fichier]

Résume en 3 lignes : projet, état actuel, prochaine étape prioritaire.
Puis demande-moi ce que je veux faire aujourd'hui.

RÈGLE IMPORTANTE : Dès que je dis "on approche de la fin", "bientôt fini",
"tokens", "sauvegarde la session" → génère IMMÉDIATEMENT le SESSION.md
complet mis à jour avant toute autre réponse.
```

---

## Modèle de fin de session

Dis à l'IA :

```
On termine la session. Génère le SESSION.md complet mis à jour.
Inclus : tâches accomplies, bugs résolus, décisions techniques,
fichiers modifiés, prochaine étape prioritaire.
```
