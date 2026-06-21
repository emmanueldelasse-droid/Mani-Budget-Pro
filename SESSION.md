# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. Lis ce fichier en début de session, génère-en une version mise à jour en fin de session.

---

## Informations générales

- **Projet** : Mani Budget Pro
- **Repo** : `emmanueldelasse-droid/mani-budget-pro`
- **URL raw** : `https://raw.githubusercontent.com/emmanueldelasse-droid/Mani-Budget-Pro/main/SESSION.md`
- **Dernière mise à jour** : 2026-06-21 (générée par Claude Code — routine planifiée)
- **IA utilisée** : Claude Code (claude-sonnet-4-6)

---

## Description du projet

Application web de suivi de budget personnel, style iOS, en français.

**Tech stack :**
- React 18.3.1 via CDN (pas de build, Babel standalone pour JSX)
- CSS-in-JS avec variables CSS (système de thèmes)
- Cloudflare Workers KV pour la persistance cloud
- WebAuthn (Face ID / Touch ID) pour l'authentification
- Claude AI (via Cloudflare Worker) pour l'OCR de relevés bancaires
- Worker endpoint : `https://manibudgetpro.emmanueldelasse.workers.dev`

**Structure des fichiers :**
```
index.html                  ← point d'entrée (34 lignes)
components/
  app.jsx       (321 lignes) ← composant principal, lock screen, thèmes
  data.jsx       (78 lignes) ← chargement des données budget
  store.jsx     (225 lignes) ← state management + sync KV Cloudflare
  screens.jsx   (690 lignes) ← écrans Home, Month, Accounts, History
  screens2.jsx  (411 lignes) ← écran ajout transaction + paramètres
  ios-frame.jsx (338 lignes) ← composants UI frame iOS
data/
  budget.json   (334 KB)    ← données budget pré-chargées (2023–présent)
```

---

## État actuel du projet

### Fonctionnalités complètes
- Navigation multi-onglets (Home, Month, Accounts, History, More)
- Gestion des transactions (dépenses, revenus, virements)
- Suivi dépenses fixes vs variables
- Saisie manuelle avec auto-catégorisation
- Import OCR de relevés bancaires (Société Générale, Revolut)
- Détection des doublons pour les transactions OCR
- Personnalisation thème / accent / police (6 thèmes, 6 accents)
- Authentification biométrique WebAuthn
- Sync cloud Cloudflare KV (token-based)
- Layout responsive desktop (sidebar) + mobile (bottom tab bar + FAB)
- Composants style iOS (status bar, glass pills)

### Points à clarifier / potentiellement en cours
- `ScreenGoals` (budget goals) référencé mais implémentation à vérifier
- `ScreenCharts` / `ScreenCategories` référencés mais pas entièrement lisibles
- Gestion du report mensuel / découvert : codée mais peu testée
- Backend Cloudflare Worker OCR (non présent dans ce repo)

### Historique git récent
Tous les commits datent du **18 avril 2026** — cycle delete/re-upload suggérant une réorganisation des fichiers dans `components/`. Messages génériques "Add files via upload" (upload via interface GitHub web).

---

## Décisions techniques importantes

- **Pas de build step** : React/Babel chargés depuis CDN pour simplifier le déploiement (static hosting simple)
- **Cloudflare KV** comme backend pour la persistance cross-device sans serveur dédié
- **WebAuthn** pour la sécurité locale sans mot de passe
- **Claude AI** intégré pour l'OCR (parsing intelligent des relevés bancaires)
- **Tout en français** : UI, noms de variables, logique métier

---

## Prochaine étape prioritaire

Vérifier et finaliser les écrans `ScreenGoals`, `ScreenCharts` et `ScreenCategories` — ces composants sont référencés dans la navigation mais leur état d'implémentation n'est pas confirmé. Ouvrir `screens.jsx` et `screens2.jsx` et chercher ces noms pour établir ce qui est fait vs à faire.

---

## Comment reprendre en session

```
Lis ce SESSION.md avant de commencer :
[colle ici le contenu brut du SESSION.md]

Résume en 3 lignes : projet, état actuel, prochaine étape prioritaire.
Puis demande-moi ce que je veux faire aujourd'hui.

RÈGLE IMPORTANTE : Dès que je dis "on approche de la fin", "bientôt fini",
"tokens", "sauvegarde la session" → génère IMMÉDIATEMENT le SESSION.md
complet mis à jour avant toute autre réponse.
```
