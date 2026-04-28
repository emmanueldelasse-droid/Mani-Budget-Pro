# SESSION.md — Mani Budget Pro

## Projet

**Nom :** Mani Budget Pro  
**Repo :** `emmanueldelasse-droid/mani-budget-pro`  
**Type :** Application budget personnelle — React (Babel standalone, pas de build), hébergée en static, backend Cloudflare Worker  
**URL Worker :** `https://manibudgetpro.emmanueldelasse.workers.dev`  
**Branche active :** `claude/youthful-davinci-bBzoc`

---

## Architecture

```
Mani-Budget-Pro/
├── SESSION.md               ← fichier de continuité IA (ce fichier)
├── index.html               ← point d'entrée, charge React 18 + Babel via CDN
├── components/
│   ├── app.jsx              ← root : LockScreen, thèmes, accents, fonts, tweaks
│   ├── data.jsx             ← données initiales / helpers
│   ├── store.jsx            ← état global (transactions, budget, sync)
│   ├── screens.jsx          ← écrans principaux (dashboard, transactions…)
│   ├── screens2.jsx         ← écrans secondaires (paramètres, stats…)
│   └── ios-frame.jsx        ← wrapper UI style iOS (frame, nav, status bar)
└── data/
    └── budget.json          ← données de budget persistées côté Cloudflare KV
```

**Stack :**
- React 18 (UMD CDN) + Babel Standalone (pas de build step)
- Cloudflare Worker pour l'API REST (token auth via header `X-Budget-Token`)
- Authentification : WebAuthn (Face ID / Touch ID) + fallback token manuel
- Thèmes : `editorial` | `minimal` | `fintech` | `terminal`
- Accents : `rouille` | `indigo` | `vert` | `rose` | `ambre` | `cyan`
- Fonts : `serif` (Fraunces) | `sans` (Inter) | `mono` (JetBrains Mono) | `grotesk` (Space Grotesk)
- Densité : `confortable` | …

---

## État actuel

- Application fonctionnelle avec lock screen WebAuthn
- 5 onglets + écran verrouillé + synchronisation Cloudflare
- Thèmes et accents configurables via `TWEAK_DEFAULTS`
- Fichiers supprimés du repo racine (screens, screens2, store, data, ios-frame) → tous dans `components/`
- Branch de travail Claude : `claude/youthful-davinci-bBzoc`

---

## Dernières modifications

| Date | Action | Fichiers |
|------|--------|----------|
| Avant 2026-04-28 | Upload initial des fichiers | `components/*.jsx`, `data/budget.json`, `index.html` |
| Avant 2026-04-28 | Nettoyage — suppression des anciens fichiers à la racine | `screens.jsx`, `screens2.jsx`, `store.jsx`, `data.jsx`, `ios-frame.jsx` |
| 2026-04-28 | Création du SESSION.md | `SESSION.md` |

---

## Prochaine étape prioritaire

> **À définir avec l'utilisateur** — Demander quelle fonctionnalité ou quel bug traiter en priorité lors de la prochaine session.

---

## Contexte pour reprendre

- `index.html` charge les scripts dans cet ordre : `data.jsx` → `store.jsx` → `screens.jsx` (screens2 et ios-frame **ne sont pas chargés** dans index.html actuellement — vérifier si c'est intentionnel)
- Le worker Cloudflare gère la persistance : endpoint `/budget` avec header `X-Budget-Token`
- Les tweaks UI (thème, accent, font, densité) sont dans `TWEAK_DEFAULTS` dans `app.jsx:6`
- `app.jsx` contient le composant `LockScreen` avec logique biométrique WebAuthn

---

## Notes techniques importantes

- **Pas de build step** : tout modification doit rester compatible Babel Standalone (pas d'imports ES modules natifs, pas de JSX dans des `.js`)
- **Ordre de chargement** : les composants sont des globals `window.X` ou définis dans l'ordre — attention aux dépendances entre fichiers
- `screens2.jsx` et `ios-frame.jsx` existent dans `components/` mais **ne sont pas référencés dans index.html** → à confirmer avec l'utilisateur
