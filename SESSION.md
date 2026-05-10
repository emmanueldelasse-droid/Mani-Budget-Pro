# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. Mis à jour à chaque fin de session.
> URL raw : `https://raw.githubusercontent.com/emmanueldelasse-droid/mani-budget-pro/main/SESSION.md`

---

## Projet

**Nom** : Mani Budget Pro (`mbp.`)
**Type** : Application web de suivi budgétaire personnel (interface mobile-first)
**Langue de l'UI** : Français
**Repo** : `emmanueldelasse-droid/mani-budget-pro`

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 18.3.1 (UMD/CDN), Babel Standalone 7.29.0 |
| Bundler | Aucun — JSX compilé à la volée par Babel |
| Backend | Cloudflare Worker (`manibudgetpro.emmanueldelasse.workers.dev`) |
| Persistance | Cloudflare KV (cloud-first) + localStorage (fallback) |
| Auth | Token HTTP (`X-Budget-Token`) + WebAuthn Face ID / Touch ID |
| Polices | Fraunces · Inter · JetBrains Mono · Space Grotesk (Google Fonts) |
| Hébergement | Fichiers statiques (pas de build, pas de npm) |

---

## Architecture des fichiers

```
mani-budget-pro/
├── index.html                  ← Point d'entrée, charge React + Babel + composants
├── data/
│   └── budget.json             ← Données historiques des mois budgétisés
├── components/
│   ├── data.jsx   (78 L)       ← Charge budget.json, expose window.BUDGET, helpers globaux
│   ├── store.jsx  (225 L)      ← window.STORE : state + sync Cloudflare KV + localStorage
│   ├── app.jsx    (321 L)      ← App principale : thèmes, LockScreen (WebAuthn), nav, TweaksPanel
│   ├── screens.jsx (690 L)     ← Écrans : Accueil, Mois, Comptes, Historique
│   ├── screens2.jsx (411 L)    ← ScreenAdd (saisie dépense + OCR) + ScreenMore (réglages)
│   └── ios-frame.jsx (338 L)   ← Wrapper cadre iOS pour aperçu mobile
└── SESSION.md                  ← Ce fichier
```

### Ordre de chargement (index.html)
`data.jsx` → `store.jsx` → `screens.jsx` → `screens2.jsx` → `app.jsx`

### Globals exposés
- `window.BUDGET` — données JSON complètes
- `window.CURRENT_MONTH` — dernier mois chronologiquement
- `window.STORE` — API state (addTx, addGain, createMonth…)
- `window.CAT_COLORS` / `window.CAT_ORDER` — couleurs OKLCH par catégorie
- `window.fmtEur(n)` / `window.fmtEurCompact(n)` — formateurs monétaires FR
- `window.MI_WORKER_URL` — URL du Worker Cloudflare

---

## Fonctionnalités implémentées

- **Lock screen** : Face ID / Touch ID via WebAuthn + saisie manuelle du token
- **5 onglets** : Accueil · Mois · Comptes · Historique · Plus
- **Sync cloud** : Cloudflare KV via Worker, token par header `X-Budget-Token`
- **Saisie manuelle** : dépenses fixes, variables, entrées manuelles
- **OCR** (ScreenAdd) : capture photo pour saisie automatisée
- **Auto-catégorisation** : règles par regex sur le libellé (screens2.jsx)
- **Création de mois** : duplication des fixes du mois précédent
- **Objectifs (goals)** : stockés dans STORE
- **Compte B** : entrées `compteBEntries` dans STORE
- **Thèmes** : editorial · minimal · fintech · terminal
- **Accents** : rouille · indigo · vert · rose · ambre · cyan
- **Polices** : serif · sans · mono · grotesk
- **Densité** : compact · confortable
- **TweaksPanel** : panneau de personnalisation en live

---

## État actuel (2026-05-10)

- Branche active : `claude/youthful-davinci-tGte4`
- Branche principale : `main`
- La branche de travail est à jour avec `main` (aucun commit en avance)
- Arbre de travail propre, aucune modification non commitée
- Le SESSION.md est le seul ajout de cette session

---

## Catégories de dépenses

`Logement` · `Courses` · `Resto & Café` · `Transport` · `Abonnements` · `Loisirs` · `Santé & Beauté` · `Vêtements` · `Assurances` · `Frais` · `Enfants` · `Virements` · `Autre`

Couleurs OKLCH harmoniques : même chroma (0.12) + luminosité (68%), teinte variée par catégorie.

---

## Décisions techniques importantes

- **Pas de bundler** : Babel compile le JSX à la volée depuis le CDN. Acceptable pour usage personnel, pas pour prod à large échelle.
- **Cloud-first** : le store charge depuis Cloudflare KV d'abord, localStorage en fallback si le réseau est absent ou si la réponse est non-OK.
- **WebAuthn sans enregistrement** : l'auth biométrique vérifie juste la présence d'un authentificateur plateforme ; le token API reste la vraie clé. Si WebAuthn échoue (`InvalidStateError`), bascule sur saisie manuelle.
- **Globals window** : les composants communiquent via `window.BUDGET`, `window.STORE`, etc. — pattern volontaire pour éviter le prop-drilling sans bundler.

---

## Prochaine étape prioritaire

> **Aucune tâche en cours** — projet en état stable. Définir la prochaine fonctionnalité à développer.

Pistes possibles non implémentées :
- Export CSV / PDF des dépenses
- Notifications de dépassement de budget
- Graphiques d'évolution sur plusieurs mois
- PWA (Service Worker + manifest) pour usage hors-ligne
- Tests automatisés (difficile sans bundler)

---

## Reprendre une session

```
Lis ce SESSION.md avant de commencer :
[colle le contenu brut de ce fichier]

Résume en 3 lignes : projet, état actuel, prochaine étape.
Puis demande-moi ce que je veux faire aujourd'hui.
```

---

*Dernière mise à jour : 2026-05-10 · IA : Claude (claude-sonnet-4-6) via Claude Code*
