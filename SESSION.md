# SESSION.md — Mani Budget Pro

> Fichier de continuité de session IA. À lire en début de session pour reprendre le contexte exact du projet.

---

## Informations du projet

- **Nom** : Mani Budget Pro
- **Repo** : `emmanueldelasse-droid/Mani-Budget-Pro`
- **URL raw (lecture auto)** : `https://raw.githubusercontent.com/emmanueldelasse-droid/Mani-Budget-Pro/main/SESSION.md`
- **Type** : Application web budget — React SPA (sans build, Babel in-browser)
- **Backend** : Cloudflare Workers (`manibudgetpro.emmanueldelasse.workers.dev`)
- **Langue interface** : Français

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18.3.1 (CDN/UMD) |
| JSX | Babel 7.29.0 (standalone, in-browser) |
| Style | CSS variables + système de thèmes |
| Auth | WebAuthn / biométrie (Face ID, Touch ID) + fallback token |
| Backend | Cloudflare Workers |
| Stockage | localStorage + `data/budget.json` |
| Fonts | Google Fonts (Fraunces, Inter, JetBrains Mono, Space Grotesk) |
| Déploiement | Statique (pas de build step) |

---

## Structure des fichiers clés

```
Mani-Budget-Pro/
├── index.html              # Point d'entrée — charge React, Babel, puis les composants
├── SESSION.md              # Ce fichier
├── components/
│   ├── data.jsx            # Utilitaires de données
│   ├── store.jsx           # State management (~8KB)
│   ├── screens.jsx         # Écrans principaux (~39KB)
│   ├── screens2.jsx        # Écrans secondaires (~21KB)
│   ├── ios-frame.jsx       # UI iOS-like (~15KB)
│   └── app.jsx             # Composant racine (~19KB)
└── data/
    └── budget.json         # Données budget (~341KB)
```

Ordre de chargement dans `index.html` : `data.jsx` → `store.jsx` → `screens.jsx` → `screens2.jsx` → `app.jsx`

---

## Fonctionnalités implémentées

- [x] Lock screen avec authentification biométrique (WebAuthn)
- [x] Système de thèmes : Editorial, Minimal, Fintech, Terminal
- [x] Couleurs d'accent : rouille, indigo, vert, rose, ambre, cyan
- [x] Familles de polices : serif, sans, mono, grotesk
- [x] Densité UI configurable
- [x] Synchronisation avec Cloudflare Workers
- [x] Interface entièrement en français

---

## État actuel

- **Dernière activité** : 2026-04-18 (uploads GitHub en masse)
- **Branche principale** : `main`
- **Statut** : Fonctionnel — structure de fichiers reconstituée après une série de suppressions/re-uploads

---

## Tâches accomplies (session du 2026-05-30)

- Création du fichier `SESSION.md` initial pour le système de continuité IA
- Exploration complète de la structure du repo et de la stack technique
- Documentation de l'état actuel du projet

---

## Décisions techniques à retenir

- Pas de `package.json` ni de build system — l'app tourne directement dans le navigateur via Babel standalone
- Le fichier `data/budget.json` est volumineux (341KB) — ne pas le modifier manuellement
- L'auth WebAuthn s'appuie sur un fallback token pour les environnements sans biométrie

---

## Bugs connus / Points de vigilance

- Aucun bug documenté à ce jour dans SESSION.md
- Les suppressions/re-uploads d'avril 2026 peuvent avoir introduit des incohérences — vérifier si l'app démarre correctement dans le navigateur

---

## Prochaine étape prioritaire

> Tester l'application dans le navigateur pour vérifier que tout fonctionne après la reconstitution des fichiers en avril 2026, puis identifier la prochaine fonctionnalité à développer.

---

## Comment reprendre en début de session

```
Lis ce SESSION.md avant de commencer.
Résume en 3 lignes : projet, état actuel, prochaine étape prioritaire.
Puis demande-moi ce que je veux faire aujourd'hui.

RÈGLE : Dès que je dis "on approche de la fin", "tokens", "sauvegarde la session" → génère IMMÉDIATEMENT le SESSION.md mis à jour.
```

---

*Dernière mise à jour : 2026-05-30 — Session initiale de documentation*
