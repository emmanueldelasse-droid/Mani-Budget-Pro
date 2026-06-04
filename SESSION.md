# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. Lis ce fichier au début de chaque session avant de commencer.
> En fin de session, génère une version mise à jour et commite-la.

---

## État du projet

**Date dernière mise à jour** : 2026-06-04
**IA utilisée** : Claude (claude-sonnet-4-6)
**Branche active** : `claude/youthful-davinci-ztaaY`

---

## Description du projet

Application web de gestion budgétaire personnelle (React 18, no build, Babel standalone).
Hébergée en fichiers statiques. Backend Cloudflare Workers + KV pour la persistance cloud.

**URL Worker** : `https://manibudgetpro.emmanueldelasse.workers.dev`

---

## Architecture des fichiers

```
Mani-Budget-Pro/
├── index.html                  ← Point d'entrée, charge les JSX via Babel standalone
├── SESSION.md                  ← Ce fichier de continuité
├── components/
│   ├── data.jsx                ← Chargement data/budget.json, helpers globaux (fmtEur, CAT_COLORS…)
│   ├── store.jsx               ← Persistance : Cloudflare KV (cloud first) + localStorage fallback
│   ├── screens.jsx             ← Écrans principaux : Accueil, Mois, Comptes, Historique
│   ├── screens2.jsx            ← ScreenAdd (ajout manuel + OCR) + ScreenMore
│   ├── ios-frame.jsx           ← Frame iOS pour prévisualisation mobile
│   └── app.jsx                 ← App principale : thèmes, accents, polices, lock screen WebAuthn
└── data/
    └── budget.json             ← Données brutes mensuelles du budget
```

---

## Stack technique

| Couche | Tech |
|--------|------|
| UI | React 18 (CDN unpkg) |
| Transpilation | Babel Standalone 7.29 |
| Polices | Google Fonts (Fraunces, Inter, JetBrains Mono, Space Grotesk) |
| Persistence cloud | Cloudflare Workers + KV |
| Auth | WebAuthn (Face ID / Touch ID) + token manuel `X-Budget-Token` |
| Déploiement | Fichiers statiques (pas de build) |

---

## Fonctionnalités implémentées

- **Lock screen** : WebAuthn/biométrie, fallback token manuel, auto-auth si token sauvegardé
- **Thèmes** : éditorial (défaut), minimal, fintech, terminal
- **Accents** : rouille (défaut), indigo, vert, rose, ambre, cyan
- **Polices** : serif (Fraunces), sans (Inter), mono (JetBrains), grotesk (Space Grotesk)
- **Densité** : compact / confortable
- **Tweaks panel** : panneau flottant d'édition des préférences visuelles
- **Écrans** : Accueil, Mois, Comptes, Historique, Ajouter, Plus
- **Ajout de dépenses** : saisie manuelle + OCR multi-photos (Société Générale, Revolut)
- **Auto-catégorisation** : 11 catégories + règles regex sur le libellé
- **Catégories** : Logement, Courses, Resto & Café, Transport, Abonnements, Loisirs, Santé & Beauté, Vêtements, Assurances, Virements, Frais, Enfants, Autre
- **Sync cloud** : Cloudflare KV, indicateur de statut de sync dans l'UI
- **Interface responsive** : mobile (nav bottom) + desktop (sidebar 220px)
- **Dédup** : détection de doublons sur (monthKey + libellé + montant)
- **Objectifs** : structure `goals` dans le store
- **Compte B** : `compteBEntries` — second compte de suivi
- **Transferts** : suivi des virements inter-comptes

---

## Données du store (structure Cloudflare KV)

```js
{
  addedTx: [],         // Dépenses ajoutées manuellement
  addedGains: [],      // Gains ajoutés manuellement
  transfers: [],       // Virements inter-comptes
  newMonths: [],       // Mois créés manuellement
  goals: null,         // Objectifs d'épargne
  compteBEntries: [],  // Entrées du compte secondaire
}
```

---

## Tâches accomplies (cette session)

- Création du fichier SESSION.md initial (analyse complète du codebase)

---

## Bugs connus / Points d'attention

- L'historique git montre des suppressions/ré-uploads récents : les fichiers actuels sont la version la plus récente et correcte
- `screens2.jsx` contient `runOcrMultiple` appelée dans le handler `onChange` mais la fonction doit être définie dans le scope parent (à vérifier si OCR fonctionne bien)
- Le Worker Cloudflare est externe au repo — ses modifications ne sont pas tracées ici

---

## Prochaine étape prioritaire

**À définir par l'utilisateur** — aucune tâche en cours au moment de la création de ce fichier.

---

## Contexte pour reprendre

- App purement statique, ouvrir `index.html` dans un navigateur (ou serveur local) pour tester
- Auth : saisir le token dans le lock screen, ou utiliser la biométrie si enregistrée
- Pour modifier les données de base : éditer `data/budget.json`
- Pour ajouter une dépense programmatiquement : passer par `window.Store.addTx(...)`
- L'OCR utilise probablement une API externe ou le Worker (à vérifier dans `screens2.jsx`)
