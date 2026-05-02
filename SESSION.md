# SESSION.md — Mani Budget Pro
> Fichier de continuité IA. Mis à jour à chaque fin de session.

---

## Projet
**Mani Budget Pro** — Application de suivi budgétaire personnel, style iOS/éditorial.
URL Worker : `https://manibudgetpro.emmanueldelasse.workers.dev`
Repo : `emmanueldelasse-droid/mani-budget-pro`
Branche de dev active : `claude/youthful-davinci-lv3zs`

---

## Stack technique
| Élément | Détail |
|---------|--------|
| Frontend | React 18 + Babel standalone (pas de bundler, scripts CDN) |
| Entrée | `index.html` charge les `.jsx` via `<script type="text/babel">` |
| État / sync | `components/store.jsx` — localStorage + Cloudflare KV (cloud-first) |
| Backend | Cloudflare Worker (`manibudgetpro.emmanueldelasse.workers.dev`) |
| Auth | Token `X-Budget-Token` + Lock screen WebAuthn / Face ID |
| Données | `data/budget.json` — historique mensuel (sept. 2023 → présent) |

---

## Architecture fichiers
```
Mani-Budget-Pro/
├── index.html                  ← entrée, charge React 18 + Babel + les JSX
├── SESSION.md                  ← ce fichier
├── components/
│   ├── data.jsx                ← charge budget.json, helpers (fmtEur, CAT_COLORS…)
│   ├── store.jsx               ← state global, sync KV + localStorage, dedup
│   ├── screens.jsx             ← écrans : Accueil, Mois, Comptes, Historique
│   ├── screens2.jsx            ← ScreenAdd (dépense manuelle + OCR), ScreenMore
│   ├── app.jsx                 ← App root, themes, lock screen, nav 5 onglets + desktop sidebar
│   └── ios-frame.jsx           ← cadre iPhone pour prévisualisation
└── data/
    └── budget.json             ← données historiques mensuelles
```

---

## Fonctionnalités en place
- **Lock screen** avec token + WebAuthn (Face ID / Touch ID) ; fallback manuel
- **5 onglets** : Accueil · Mois · Comptes · Historique · Plus
- **Desktop sidebar** (>768px) avec nav latérale 220px
- **Tweaks panel** : thème (éditorial / minimal / fintech / terminal), accent, police, densité
- **Sync cloud** Cloudflare KV + localStorage fallback ; indicateur de sync (syncDot)
- **OCR import** : screenshots Société Générale + Revolut (multi-photos)
- **Auto-catégorisation** par regex (13 catégories)
- **Déduplication** des transactions importées
- **Mois** : dépenses fixes + variables + gains, graphiques Bars / Spark / Donut
- **Données** : budget.json avec des mois réels de sept. 2023 à aujourd'hui

---

## Thèmes disponibles
`editorial` (défaut) · `minimal` · `fintech` · `terminal`
Accents : `rouille` (défaut) · `indigo` · `vert` · `rose` · `ambre` · `cyan`
Polices : `serif` (Fraunces) · `sans` (Inter) · `mono` (JetBrains Mono) · `grotesk` (Space Grotesk)

---

## État actuel (2026-05-02)
- Codebase stable, chargée via upload direct sur GitHub (commits "Add files via upload")
- Branche `claude/youthful-davinci-lv3zs` créée pour le développement IA
- Aucune PR ouverte
- SESSION.md créé pour la première fois lors de cette session

---

## Prochaine étape prioritaire
> À définir par le développeur — indiquer ici la prochaine fonctionnalité ou bug à traiter.

---

## Décisions techniques à retenir
- Pas de bundler volontairement : app légère, hébergeable sur GitHub Pages ou Cloudflare Pages
- Babel standalone évite toute étape de build ; chargement séquentiel des scripts important (data → store → screens → screens2 → app)
- Le Worker gère auth (token) + stockage KV ; toute requête sans token valide retourne 401
- `window.__budgetReady` et `window.__storeReady` sont des Promises — app.jsx attend `__storeReady` avant de monter React

---

## Commandes utiles
```bash
# Lancer en local (pas de build nécessaire)
npx serve .   # ou python3 -m http.server 8080

# Déployer (si Cloudflare Pages)
git push origin claude/youthful-davinci-lv3zs
```

---

*Généré par Claude Code — session 2026-05-02*
