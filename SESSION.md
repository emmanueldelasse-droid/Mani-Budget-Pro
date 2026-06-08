# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. À lire en début de session pour reprendre le contexte du projet.

---

## Informations projet

| Champ | Valeur |
|-------|--------|
| **Nom** | Mani Budget Pro |
| **Repo GitHub** | emmanueldelasse-droid/Mani-Budget-Pro |
| **Langue** | Français |
| **Dernière mise à jour** | 2026-06-08 |
| **IA utilisée** | Claude (claude-sonnet-4-6) |

---

## Description

Application de gestion budgétaire personnelle en React, conçue comme une PWA mobile (frame iOS). Interface en français avec authentification biométrique (Face ID / Touch ID via WebAuthn) et synchronisation via Cloudflare Workers.

---

## Architecture technique

### Stack
- **Frontend** : React 18.3.1 chargé via CDN (UMD), JSX transpilé par Babel standalone — **pas de npm, pas de build step**
- **Backend** : Cloudflare Worker à `https://manibudgetpro.emmanueldelasse.workers.dev`
- **Auth** : WebAuthn (biométrique) + token manuel stocké dans localStorage (`mi:token`)
- **Fonts** : Google Fonts (Fraunces, Inter, JetBrains Mono, Space Grotesk)

### Fichiers clés

| Fichier | Rôle |
|---------|------|
| `index.html` | Point d'entrée, charge React + Babel + tous les composants JSX |
| `components/app.jsx` | Composant principal : lock screen, thèmes, navigation 5 onglets |
| `components/store.jsx` | State management global |
| `components/data.jsx` | Gestion et manipulation des données budget |
| `components/screens.jsx` | Écrans principaux (onglets 1–3) |
| `components/screens2.jsx` | Écrans secondaires (onglets 4–5) |
| `components/ios-frame.jsx` | Wrapper frame iOS pour le rendu mobile |
| `data/budget.json` | Données budget (enregistrements mensuels : salaire, dépenses fixes/variables, gains) |

### Thèmes disponibles
- `editorial` (défaut) — fond crème, typographie serif
- `minimal` — fond blanc pur, noir intense
- `fintech` — dégradé violet/indigo
- `terminal` — fond sombre, vert néon

### Accents couleur
`rouille` (défaut) · `indigo` · `vert` · `rose` · `ambre` · `cyan`

### Polices
`serif` (Fraunces) · `sans` (Inter) · `mono` (JetBrains Mono) · `grotesk` (Space Grotesk)

---

## État actuel du projet

### Ce qui fonctionne
- Structure de fichiers en place (tous les composants JSX + données JSON)
- Système de thèmes / accents / polices configuré dans `app.jsx`
- Lock screen WebAuthn implémenté avec fallback token manuel
- Synchronisation Cloudflare Worker intégrée

### Derniers commits (historique)
```
32bdc6c  2026-04-18  Add files via upload  (mise en place initiale)
4a1801c  2026-04-18  Add files via upload
40c775a  2026-04-18  Add files via upload
b3ff546  2026-04-18  Add files via upload
523179b  2026-04-18  Add files via upload
```

### Branche de développement actuelle
`claude/youthful-davinci-garNz`

---

## Décisions techniques importantes

1. **Pas de bundler** : choix délibéré de rester en CDN/Babel pour simplifier le déploiement (pas de `npm install`, pas de CI/CD complexe)
2. **WebAuthn côté client uniquement** : la vérification biométrique valide localement puis utilise le token stocké — le serveur Cloudflare valide le token
3. **Frame iOS** : l'app est conçue pour être utilisée dans un frame iOS simulé, suggérant un usage PWA ou intégration WebView

---

## Prochaine étape prioritaire

> **À définir lors de la prochaine session** — demander à l'utilisateur quelle fonctionnalité ou quel bug traiter en priorité.

Pistes possibles basées sur l'état du code :
- Compléter / tester l'intégration Cloudflare Worker (CRUD budget)
- Implémenter les 5 onglets dans `screens.jsx` / `screens2.jsx`
- Ajouter la gestion des erreurs réseau dans la sync
- Tester l'auth WebAuthn sur appareil réel

---

## Comment reprendre une session

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

## URL raw pour lecture automatique

```
https://raw.githubusercontent.com/emmanueldelasse-droid/Mani-Budget-Pro/main/SESSION.md
```
