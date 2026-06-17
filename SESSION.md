# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. Lis ce fichier au début de chaque session pour reprendre sans perdre de contexte.

---

## État du projet

**Date dernière session :** 2026-06-17  
**IA utilisée :** Claude (claude-sonnet-4-6)  
**Branche active :** `claude/youthful-davinci-syj8su`

---

## Description du projet

Application React de suivi budgetaire personnel, sans étape de build. Fonctionne directement dans le navigateur via CDN (React 18 + Babel standalone). Backend sur Cloudflare Workers avec stockage KV pour la synchronisation multi-appareils.

**URL Worker :** `https://manibudgetpro.emmanueldelasse.workers.dev`  
**Repo :** `emmanueldelasse-droid/mani-budget-pro`

---

## Architecture technique

| Fichier | Rôle | Lignes |
|---------|------|--------|
| `index.html` | Point d'entrée, charge les scripts CDN dans le bon ordre | 34 |
| `components/data.jsx` | Charge `budget.json`, expose les helpers `fmtEur`, `fmtEurCompact`, `CAT_COLORS` | 78 |
| `components/store.jsx` | State management : Cloudflare KV (priorité) + localStorage (fallback) | 225 |
| `components/app.jsx` | App principale : lock screen, 5 onglets, thèmes, accents, fonts | 321 |
| `components/screens.jsx` | Écrans : Accueil, Mois, Comptes, Historique | 690 |
| `components/screens2.jsx` | Écran ajout dépense (manuel + fixe + OCR) + ScreenMore | 411 |
| `components/ios-frame.jsx` | Frame iOS 26 Liquid Glass (status bar, nav bar, clavier) | 338 |
| `data/budget.json` | Données statiques des mois (depuis Septembre 2023) | — |

### Ordre de chargement dans index.html
```
data.jsx → store.jsx → screens.jsx → screens2.jsx → ios-frame.jsx → app.jsx
```

---

## Fonctionnalités implémentées

### Auth & Sécurité
- Lock screen avec WebAuthn / biométrique (Face ID, Touch ID)
- Fallback token manuel (mot de passe secret)
- Token stocké dans `localStorage` après première validation
- Vérification du token via `GET /budget` sur le Worker (header `X-Budget-Token`)

### Personnalisation UI
- **4 thèmes :** Éditorial, Minimal, Fintech, Terminal
- **6 accents :** rouille, indigo, vert, rose, ambre, cyan
- **4 fonts :** Fraunces (serif), Inter (sans), JetBrains Mono, Space Grotesk
- **2 densités :** confortable, compact

### Données & Sync
- Chargement initial depuis `data/budget.json` (données statiques historiques)
- Transactions ajoutées manuellement stockées dans `state.addedTx` (cloud + local)
- Gains ajoutés dans `state.addedGains`
- Virements dans `state.transfers`
- Nouveaux mois créés dynamiquement dans `state.newMonths`
- Objectifs (`state.goals`)
- Entrées compte B (`state.compteBEntries`)
- Déduplication des transactions : même `monthKey` + `detail` (insensible casse) + `amount`

### Import OCR
- Upload photo(s) de screenshot bancaire (Société Générale, Revolut)
- Parsing automatique + auto-catégorisation par regex
- Import avec contrôle de doublons (`addTxSafe`)

### Interface
- Swipe gauche pour supprimer une transaction (SwipeRow)
- Graphiques : barres (Bars), sparkline (Spark), donut (Donut)
- Navigation 5 onglets
- Frame iOS 26 Liquid Glass pour simulation mobile

---

## Auto-catégorisation (règles actuelles dans screens2.jsx)

| Catégorie | Mots-clés détectés |
|-----------|-------------------|
| Logement | loyer, assurance maison, shurgard, emprunt, frais banque |
| Courses | leclerc, franprix, monoprix, carrefour, lidl, aldi, amazon... |
| Resto & Café | macdo, kfc, burger, uber eat, deliveroo, just eat... |
| Transport | essence, uber, sncf, ratp, parking, navigo... |
| Abonnements | netflix, spotify, apple, orange, chatgpt, claude... |
| Loisirs | cinema, bar, vinted, trade, fnac, steam... |
| Santé & Beauté | coiffeur, pharmacie, medecin, dentiste, sephora |
| Vêtements | zara, levis, ugg, hermes, primark, h&m, uniqlo |
| Assurances | assurance, mutuelle |
| Virements | virement, maman, mila, compte |
| Frais | frais, commission, cotis |

---

## État des données (budget.json)

- **Premier mois :** Septembre 2023 (données vides)
- **Données complètes depuis :** Janvier 2024
- Le reste calculé dynamiquement : `totalGains - totalFixes - totalVar`

---

## Tâches accomplies (cette session)

- Exploration complète de l'architecture du projet
- Création du fichier SESSION.md initial pour le système de continuité IA

---

## Bugs connus / Points d'attention

- `SwipeRow` : le swipe se bloque parfois si l'offset est à exactement -80px (le bouton rouge reste visible sans action confirmée)
- Déduplication basée sur detail+amount seulement — si même montant + même libellé des mois différents, seule la vérification par `monthKey` les distingue
- WebAuthn : sur certains navigateurs bureau, `rpId` doit correspondre exactement au domaine déployé

---

## Prochaine étape prioritaire

**Tester et valider le déploiement complet sur Cloudflare Pages** — vérifier que le Worker répond correctement, que le token fonctionne, et que la sync cloud est opérationnelle depuis un vrai appareil mobile.

---

## Contexte pour reprendre

- Pas de dépendances npm, pas de `package.json` — tout via CDN
- Pour tester localement : `python3 -m http.server` ou `npx serve .` depuis la racine
- Le Worker Cloudflare gère auth + KV, son code n'est pas dans ce repo
- Les `screens.jsx` et `screens2.jsx` sont les fichiers les plus longs à modifier
- Le thème par défaut est `editorial` avec l'accent `rouille`
