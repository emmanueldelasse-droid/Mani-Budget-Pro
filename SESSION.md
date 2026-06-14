# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. Lis ce fichier en début de session pour reprendre le contexte exact du projet.

---

## Infos projet

| Champ | Valeur |
|-------|--------|
| **Nom** | Mani Budget Pro (mbp.) |
| **Repo** | `emmanueldelasse-droid/Mani-Budget-Pro` |
| **Langue UI** | Français |
| **Dernière session** | 2026-06-14 |
| **IA utilisée** | Claude (claude-sonnet-4-6) |

---

## Description

Application web de gestion de budget personnel. SPA React chargée via CDN (sans build tool), avec authentification biométrique (WebAuthn / Face ID), sync cloud via Cloudflare Workers KV, et OCR de relevés bancaires via Claude API.

---

## Stack technique

| Couche | Techno |
|--------|--------|
| Frontend | React 18.3.1 (CDN/UMD) + Babel standalone |
| Styles | CSS pur, variables OKLCH, 4 thèmes × 6 accents × 4 polices |
| Backend | Cloudflare Workers + KV |
| Auth | Token (X-Budget-Token) + WebAuthn biométrique |
| OCR | Claude API (via Worker) |
| Données | localStorage (`mi:` prefix) + Cloudflare KV |

**Worker URL :** `https://manibudgetpro.emmanueldelasse.workers.dev`

---

## Architecture — fichiers clés

```
index.html               ← Point d'entrée, charge les scripts dans l'ordre
components/
  app.jsx                ← Wrapper principal, thèmes, navigation, lock screen
  data.jsx               ← Chargement budget.json, helpers globaux (fmtEur, CAT_COLORS…)
  store.jsx              ← State management, CRUD transactions/gains/transferts, sync KV
  screens.jsx            ← 7 écrans : Home, Mois, Historique, Comptes, Charts, Catégories, Objectifs
  screens2.jsx           ← ScreenAdd (saisie manuelle + OCR) + ScreenMore (export/import/settings)
  ios-frame.jsx          ← Primitives UI style iOS — défini mais non utilisé actuellement
data/
  budget.json            ← Données historiques sept 2023 → jan 2024 (15 187 lignes)
SESSION.md               ← CE FICHIER
```

---

## Comptes suivis

| Compte | Clé |
|--------|-----|
| Principal | `principal` |
| Compte B | `compteB` |
| Vacances | `vacances` |

---

## Catégories de dépenses (12)

Logement · Courses · Resto & Café · Transport · Abonnements · Loisirs · Santé & Beauté · Vêtements · Assurances · Frais · Enfants · Virements · Autre

Auto-catégorisation via règles regex sur le libellé de transaction.

---

## Fonctionnalités — état actuel

| Fonctionnalité | État |
|----------------|------|
| Auth token + WebAuthn | ✅ Opérationnel |
| Suivi budget mensuel (revenus / dépenses fixes / variables) | ✅ Opérationnel |
| Saisie manuelle (pad numérique) | ✅ Opérationnel |
| OCR relevés bancaires (SG, Revolut) | ✅ Opérationnel via Claude API |
| Transferts entre comptes | ✅ Opérationnel |
| Sync Cloudflare KV | ✅ Opérationnel |
| Export / Import JSON | ✅ Opérationnel |
| Thèmes (Editorial, Minimal, Fintech, Terminal) | ✅ Opérationnel |
| Graphiques (barres, sparkline, donut) | ✅ Opérationnel |
| Détection doublons | ✅ Opérationnel |
| Objectifs financiers (ScreenGoals) | ⚠️ Écran présent, logique de création à compléter |
| iOS frame / app mobile | ⚠️ Composants définis, non intégrés au build actuel |
| README.md | ❌ Absent |

---

## Décisions techniques importantes

- **Pas de build tool intentionnel** — architecture CDN-first pour simplicité maximale ; Babel standalone transpile JSX côté navigateur.
- **EDITMODE** — zone de tweaks visuels activée via `postMessage` depuis une fenêtre parente (intégration Figma ou panel admin).
- **Pas de .env** — URL Worker hardcodée dans `app.jsx`.
- **Préfixe localStorage** : `mi:` — ne pas changer sans migration.
- **Thème par défaut** : Editorial + accent Rouille + police Serif + densité Confortable.

---

## Flux critiques à connaître

1. **Auth** → token localStorage → défi WebAuthn → validation KV Cloudflare
2. **Sync** → déverrouillage app → `store.syncFromCloud()` → fetch avec header `X-Budget-Token`
3. **OCR** → upload image → Worker → Claude API → parse transactions → vérif doublons → import
4. **Nouveau mois** → copie dépenses fixes du mois précédent → report solde négatif éventuel
5. **Export** → sérialisation complète du state → blob JSON → téléchargement navigateur

---

## État git

| Champ | Valeur |
|-------|--------|
| Branche active | `claude/youthful-davinci-s5pjzz` |
| Dernier commit | `32bdc6c` — "Add files via upload" (2026-04-18) |
| Arbre de travail | Propre (aucun changement non commité avant cette session) |

---

## Tâches accomplies lors de cette session (2026-06-14)

- [x] Exploration complète du projet (structure, stack, état des fonctionnalités)
- [x] Création du fichier `SESSION.md` de continuité IA
- [x] Push sur la branche `claude/youthful-davinci-s5pjzz`

---

## Prochaine étape prioritaire

**Compléter la logique ScreenGoals** — l'écran existe mais ne permet pas encore de créer, éditer ou suivre des objectifs financiers (ex. épargne cible, date butoir, progression).

---

## Pour reprendre en session suivante

Colle ce fichier en début de message :

```
Lis ce SESSION.md et résume en 3 lignes : projet, état actuel, prochaine étape.
Puis demande-moi ce que je veux faire aujourd'hui.
[contenu de ce fichier]
```

---

*Généré automatiquement — mettre à jour en fin de chaque session.*
