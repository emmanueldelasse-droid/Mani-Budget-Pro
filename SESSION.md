# SESSION.md — Mani Budget Pro

> Fichier de continuité de session IA. Lis ce fichier en début de session, génère une version mise à jour en fin de session.

---

## Projet

**Nom :** Mani Budget Pro (`mbp.`)
**Repo :** `emmanueldelasse-droid/Mani-Budget-Pro`
**Type :** Application web de gestion budgétaire personnelle (React, no build step)
**URL worker :** `https://manibudgetpro.emmanueldelasse.workers.dev`

---

## Architecture technique

```
Mani-Budget-Pro/
├── index.html                  ← Point d'entrée, charge React 18 (CDN) + Babel Standalone
├── data/
│   └── budget.json             ← Données budget (mois archivés)
└── components/
    ├── data.jsx                ← Définitions de données / constantes budget
    ├── store.jsx               ← Persistance : Cloudflare KV (cloud) + localStorage
    ├── screens.jsx             ← Écrans principaux : Home, Mois, Comptes, Historique
    ├── screens2.jsx            ← ScreenAdd (saisie manuelle, fixe, OCR) + ScreenMore
    ├── app.jsx                 ← App racine, LockScreen, thèmes, routing onglets
    └── ios-frame.jsx           ← Cadre de prévisualisation iOS (mode édition)
```

**Stack :**
- React 18.3.1 via unpkg (UMD, pas de Node ni bundler)
- Babel Standalone 7.29 pour transpiler JSX dans le navigateur
- Cloudflare Workers + KV pour la sync cloud
- WebAuthn (Face ID / Touch ID) pour le déverrouillage biométrique
- Auth par token `X-Budget-Token` → vérifié côté Worker

---

## Fonctionnalités implémentées

- **Lock screen** : token secret + déverrouillage biométrique (WebAuthn, Face ID/Touch ID)
- **5 onglets** : Accueil, Mois, Comptes, Historique, Plus
- **4 thèmes** : Éditorial, Minimal, Fintech, Terminal
- **Accents** : rouille, indigo, vert, rose, ambre, cyan
- **Polices** : Fraunces (serif), Inter (sans), JetBrains Mono, Space Grotesk
- **Densité** : Compact / Confortable
- **Sync cloud** : syncFromCloud() au déverrouillage, indicateur visuel (⟳ ✓ !)
- **Ajout de dépense** : saisie manuelle + charges fixes + OCR
- **Auto-catégorisation** des dépenses
- **Shell desktop** : sidebar 220px + main content (≥ 900px)
- **Mobile** : bottom tab bar + FAB (+)
- **Mode édition** : TweaksPanel (postMessage avec parent iframe)

---

## État actuel

| Zone | État |
|------|------|
| Lock screen + biométrie | Terminé |
| Navigation 5 onglets | Terminé |
| Thèmes / Accents / Polices | Terminé |
| Sync Cloudflare KV | Terminé |
| ScreenAdd (OCR inclus) | Terminé |
| ScreenMore | Terminé |
| Desktop shell | Terminé |

---

## Décisions techniques importantes

- **Pas de bundler** : tout charge en `<script type="text/babel">` pour éviter un setup Node.js — déploiement = git push ou simple upload.
- **WebAuthn simplifié** : Face ID valide la présence biométrique, le token reste en `localStorage`. Ce n'est pas une auth WebAuthn complète (pas de credential enregistré côté serveur).
- **Cloudflare Worker** centralise lecture/écriture KV, le token est le seul secret.
- **`window.__storeReady`** : promesse globale, l'app attend que le store soit prêt avant de monter React.
- **Branche de travail Claude** : `claude/youthful-davinci-fq4CG`

---

## Fichiers modifiés lors de cette session

*(aucun — SESSION.md créé pour initialiser le système de continuité)*

---

## Prochaine étape prioritaire

> **À définir avec l'utilisateur.** Décrire ici la prochaine fonctionnalité ou correction à implémenter.

Exemples de pistes possibles :
- Implémenter ScreenCharts (graphiques mensuels)
- Implémenter ScreenGoals (objectifs d'épargne)
- Améliorer ScreenCategories
- Ajouter la gestion multi-comptes complète dans ScreenAccounts
- Optimiser l'OCR dans ScreenAdd

---

## Contexte pour reprendre

1. L'app est un fichier HTML statique + JSX — ouvrir `index.html` dans un navigateur (ou la servir via `python3 -m http.server`) suffit pour tester.
2. Le token de test et l'URL du Worker sont nécessaires pour tester la sync cloud.
3. Les screens `ScreenCharts`, `ScreenGoals`, `ScreenCategories` sont référencés dans `app.jsx` mais leur implémentation peut être incomplète — vérifier dans `screens.jsx` et `screens2.jsx`.
4. Le mode édition (TweaksPanel) fonctionne via `postMessage` avec un iframe parent — ne pas chercher à le tester hors contexte iframe.

---

*Dernière mise à jour : 2026-05-17 — Session d'initialisation (Claude Code)*
