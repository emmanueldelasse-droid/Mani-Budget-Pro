# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. À lire en début de session pour reprendre le contexte exact du projet.

---

## Identité du projet

- **Nom** : Mani Budget Pro
- **Repo** : `emmanueldelasse-droid/Mani-Budget-Pro`
- **URL raw SESSION.md** : `https://raw.githubusercontent.com/emmanueldelasse-droid/Mani-Budget-Pro/main/SESSION.md`
- **Type** : Application budget personnelle — React (Babel standalone), zéro build tool, hébergée sur GitHub Pages ou similaire
- **Worker Cloudflare** : `https://manibudgetpro.emmanueldelasse.workers.dev`

---

## Architecture technique

```
Mani-Budget-Pro/
├── index.html              ← Entrée principale, charge React 18 + Babel + les composants
├── components/
│   ├── app.jsx             ← Composant racine, lock screen WebAuthn, thèmes, sync Cloudflare
│   ├── data.jsx            ← Helpers de données / formatage
│   ├── store.jsx           ← État global (useState/useEffect), logique métier budget
│   ├── screens.jsx         ← Écrans principaux (tableau de bord, mois, dépenses…)
│   └── screens2.jsx        ← Écrans secondaires (paramètres, thèmes, stats…)
│   └── ios-frame.jsx       ← Wrapper cadre iOS simulé
└── data/
    └── budget.json         ← Données budget JSON (mois de sept. 2023 → présent)
```

### Points clés
- **Pas de bundler** : tout est chargé via `<script type="text/babel">` dans `index.html`
- **Thèmes** : éditorial / minimal / fintech / terminal ; accents : rouille / indigo / vert / rose / ambre / cyan
- **Auth** : Lock screen avec WebAuthn (Face ID / Touch ID) + token manuel en fallback
- **Sync** : Cloudflare Worker pour persister les données
- **Données** : `budget.json` couvre de sept. 2023 à ce jour avec gains, dépenses fixes, dépenses variables

---

## État actuel du projet (2026-05-27)

- **Branche de travail** : `claude/youthful-davinci-Vb6EE`
- **Statut** : Projet en cours de développement — tous les fichiers composants sont présents et fonctionnels
- **Ce qui fonctionne** : UI complète avec 5 onglets, lock screen, thèmes, sync Worker Cloudflare
- **Ce qui est en attente** : À définir en session

---

## Historique des sessions

### Session 2026-05-27 — Mise en place du système de continuité
- **IA utilisée** : Claude (claude-sonnet-4-6)
- **Tâches accomplies** :
  - Création du fichier `SESSION.md` à la racine du repo selon le guide de continuité de session IA
  - Analyse de l'architecture complète du projet (6 composants, 1 fichier de données)
- **Décisions** : Mise en place du workflow SESSION.md pour toutes les sessions futures
- **Prochaine étape prioritaire** : Définir avec l'utilisateur la prochaine fonctionnalité ou bug à traiter

---

## Comment utiliser ce fichier

### En début de session (Claude Code / Claude.ai)
```
Lis ce SESSION.md avant de commencer :
[colle ici le contenu brut]

Résume en 3 lignes : projet, état actuel, prochaine étape prioritaire.
Puis demande-moi ce que je veux faire aujourd'hui.
```

### En fin de session
```
On termine la session. Génère le SESSION.md complet mis à jour.
Inclus : tâches accomplies, décisions prises, fichiers modifiés, prochaine étape prioritaire.
```

### Mots-clés de sauvegarde d'urgence
> "on approche de la fin" / "bientôt fini" / "tokens" / "sauvegarde la session"
→ L'IA génère immédiatement le SESSION.md mis à jour avant toute autre réponse.
