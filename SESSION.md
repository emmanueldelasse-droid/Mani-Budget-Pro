# SESSION.md — Mani Budget Pro
> Fichier de continuité IA · Mis à jour le 2026-04-22 · Claude Sonnet 4.6

---

## Projet

**Mani Budget Pro** — Application web de gestion de budget personnel, mobile-first.
Stack : React 18 (CDN, via Babel standalone), HTML/JSX statique, Cloudflare Workers + KV pour la persistance cloud.
Pas de bundler ni de build step — tout s'exécute directement dans le navigateur.

---

## Architecture

```
Mani-Budget-Pro/
├── index.html            — Point d'entrée, charge React 18 (CDN) + Babel + tous les scripts
├── components/
│   ├── data.jsx          — Charge budget.json, expose window.BUDGET, window.fmtEur, window.CAT_COLORS
│   ├── store.jsx         — Store global : state local (localStorage) + sync Cloudflare KV
│   ├── screens.jsx       — Écrans : Accueil, Mois, Comptes, Historique, Graphiques, Catégories, Objectifs
│   ├── screens2.jsx      — Écrans : Ajout (manuel + OCR), Plus
│   └── app.jsx           — LockScreen (WebAuthn), App shell, thèmes, tabbar
└── data/
    └── budget.json       — Données budget (mois de sept. 2023 à aujourd'hui)
```

### Globals exposés sur `window`
| Variable | Contenu |
|---|---|
| `BUDGET` | Données brutes du JSON (tous les mois) |
| `CURRENT_MONTH` | Dernier mois du JSON |
| `STORE` | Store avec get/subscribe/addTx/addGain/etc. |
| `MI_WORKER_URL` | `https://manibudgetpro.emmanueldelasse.workers.dev` |
| `fmtEur(n)` | Formatage monétaire français |
| `CAT_COLORS` | Map catégorie → couleur OKLCH |
| `CAT_ORDER` | Ordre d'affichage des catégories |
| `MONTH_FR` | Noms des mois en français |

---

## Fonctionnalités implémentées

### Authentification
- **Lock screen** avec champ token (`X-Budget-Token` envoyé au Worker)
- **WebAuthn / Face ID / Touch ID** : si un token est enregistré en localStorage, propose l'auth biométrique automatiquement
- Fallback manuel (saisie du token)

### Thèmes & personnalisation
- 4 thèmes : `editorial` (défaut, fond crème), `minimal`, `fintech`, `terminal` (dark)
- 6 accents : rouille, indigo, vert, rose, ambre, cyan
- 4 polices : serif (Fraunces), sans (Inter), mono (JetBrains Mono), grotesk (Space Grotesk)
- 2 densités : compact / confortable
- Panel "Tweaks" accessible via `window.postMessage({ type: '__activate_edit_mode' })`

### Navigation
- Mobile : tabbar fixe en bas + FAB "+" 
- Desktop (≥ 900px) : sidebar latérale 220px + contenu principal
- 5 onglets principaux : Accueil, Mois, Comptes, Historique, Plus
- Onglets secondaires (via "Plus") : Tendances, Catégories, Objectifs

### Écrans

**Accueil (`ScreenHome`)**
- Hero : reste du mois (coloré rouge si négatif), barre de progression budget utilisé
- Grid 3 colonnes : Entrées / Fixes / Variables
- 6 dernières transactions
- Bouton "+ Ajouter une dépense"

**Mois (`ScreenMois`)**
- Navigation slider ‹ mois › mois
- Hero solde du mois
- Bouton "Créer mois suivant" (copie les charges fixes + reporte le découvert si négatif)
- Bloc Entrées avec quick-add inline
- Bloc Dépenses avec quick-add inline
- SwipeRow : glisser gauche → supprimer (uniquement les transactions ajoutées par l'utilisateur)

**Comptes (`ScreenAccounts`)**
- 3 sous-onglets : Compte B (épargne), Vinted, Vacances
- Données lues depuis `budget.json` → `extras`

**Historique (`ScreenHistory`)**
- Liste de tous les mois (chronologie inversée)
- Stats : reste moyen, sparkline tendance
- Bouton "+ Nouveau mois"

**Ajout (`ScreenAdd`)**
- 4 modes : Dépense, Entrée, Virement, Scan 📷
- Pavé numérique custom
- Auto-catégorisation par regex sur le libellé
- **OCR** : upload screenshot(s) bancaire → analyse via Worker → liste de transactions cochables, détection doublons

**Plus (`ScreenMore`)**
- Accès aux vues secondaires (Tendances, Catégories, Objectifs)
- Export / Import JSON
- Réinitialisation des ajouts
- Déconnexion (supprime `localStorage['mi:token']`)

### Persistence
- **localStorage** : clé `mi:store:v1` (JSON)
- **Cloudflare KV** : sync au déverrouillage (`GET /budget` + `POST /budget`)
- Indicateur sync dans le coin supérieur droit (⟳ / ✓ / !)

### Store (`window.STORE`)
Méthodes principales :
```
get()                          → state actuel
subscribe(fn)                  → écoute les changements
getMonths()                    → mois fusionnés (JSON + newMonths)
getSummary(monthKey)           → { totalGains, totalFixes, totalVar, reste, byCategory }
addTx(tx)                      → ajoute une dépense
addTxSafe(tx, monthKey)        → ajoute avec vérification doublon
addGain(g)                     → ajoute une entrée
addGainSafe(g, monthKey)       → ajoute avec vérification doublon
addTransfer(t)                 → ajoute un virement
createNextMonth(fromMonthKey)  → crée le mois suivant (copie fixes + report découvert)
deleteAdded(id)                → supprime une transaction ajoutée
reset()                        → efface tous les ajouts
syncFromCloud()                → pull depuis Cloudflare KV
```

---

## Cloudflare Worker

URL : `https://manibudgetpro.emmanueldelasse.workers.dev`

Endpoints :
- `GET /budget` avec header `X-Budget-Token` → retourne le state KV
- `POST /budget` avec header `X-Budget-Token` + body JSON → sauvegarde le state
- `POST /ocr` avec header `X-Budget-Token` + body `{ image, mediaType, monthKey }` → appelle Claude API pour extraire les transactions d'un screenshot bancaire

---

## Données budget.json

Structure d'un mois :
```json
{
  "year": 2025,
  "month": 4,
  "salaire": 2500,
  "fixes": 1497.89,
  "variables": 350.20,
  "reste": 651.91,
  "gains": [ { "date": "2025-04-01", "detail": "Salaire", "amount": 2500 } ],
  "depFixes": [ { "day": 5, "detail": "Loyer", "amount": 700, "category": "Logement" } ],
  "depVar":   [ { "date": "2025-04-12", "detail": "Leclerc", "amount": 45.30, "category": "Courses" } ],
  "extras": { "Compte B": [...], "Vinted": [...], "Vacance": [...] }
}
```

Catégories disponibles : Logement · Virements · Courses · Resto & Café · Transport · Abonnements · Loisirs · Santé & Beauté · Vêtements · Assurances · Frais · Enfants · Autre

---

## État actuel du projet

- Toutes les fonctionnalités de base sont implémentées et fonctionnelles
- La branche de développement `claude/eager-hypatia-S1NdH` est au même niveau que `main`
- Aucune régression connue
- Le fichier SESSION.md vient d'être créé pour assurer la continuité des sessions IA

---

## Prochaine étape prioritaire

**À définir avec le développeur** — aucune tâche en cours au moment de la création de ce fichier.

Pistes possibles observées dans le code :
1. `ScreenGoals` : les objectifs d'épargne sont hardcodés → les rendre éditables et persistés dans le store
2. `ScreenAccounts / Vacances` : le solde vacances est hardcodé (`-25.46 €`) → le connecter aux vraies données
3. OCR : tester et affiner la robustesse de l'extraction (Société Générale + Revolut)
4. Ajouter la navigation par swipe horizontal entre les mois dans `ScreenMois`

---

## Contexte pour reprendre

- Le projet est une SPA React sans build step — modifier directement les `.jsx` dans `components/`
- Toujours charger `data.jsx` → `store.jsx` → `screens.jsx` → `screens2.jsx` → `app.jsx` (ordre important)
- Le token d'accès est stocké dans `localStorage['mi:token']`
- Le Worker Cloudflare est séparé de ce repo (pas de code worker dans ce dépôt)
- Pour tester en local : serveur HTTP simple suffit (`python3 -m http.server 8080` ou Live Server)
- Repo GitHub : `emmanueldelasse-droid/mani-budget-pro`
- Branche de développement active : `claude/eager-hypatia-S1NdH`
