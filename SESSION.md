# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. À lire au début de chaque session.
> Colle ce contenu dans ton prompt de démarrage pour reprendre le contexte.

---

## Projet
**Mani Budget Pro (mbp.)** — Application web de gestion de budget personnel.
SPA React client-side, mobile-first, avec auth biométrique, sync cloud Cloudflare KV, et extraction OCR de transactions depuis captures bancaires.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18.3.1 (CDN + Babel transpilation, pas de build tools) |
| Persistence locale | localStorage |
| Sync cloud | Cloudflare Workers KV (`MI_WORKER_URL`) |
| Auth | WebAuthn (Face ID / Touch ID) + token API |
| OCR | Claude Vision API (extraction de transactions) |
| Styling | CSS-in-JS, 4 thèmes × 6 accents × 4 polices × 2 densités |
| Données statiques | `data/budget.json` (333 KB) |

---

## Structure des fichiers

```
Mani-Budget-Pro/
├── index.html                 # Point d'entrée unique — charge React + tous les JSX via Babel
├── SESSION.md                 # Ce fichier
├── components/
│   ├── data.jsx               # Chargement budget.json, formatage EUR, couleurs, catégories
│   ├── store.jsx              # Couche persistence : localStorage + sync Cloudflare KV
│   ├── app.jsx                # App principale, LockScreen, TweaksPanel, DesktopShell
│   ├── screens.jsx            # Écrans Home/Mois/Comptes/Historique + primitives UI
│   ├── screens2.jsx           # ScreenAdd (manuel/fixe/OCR), ScreenMore, auto-catégorisation
│   └── ios-frame.jsx          # Composants UI style iOS (StatusBar, GlassPill)
└── data/
    └── budget.json            # Données mensuelles statiques (mois, revenus, dépenses)
```

---

## 5 écrans principaux

1. **Home** — Résumé mensuel, solde, répartition dépenses
2. **Mois** — Vue détaillée du mois
3. **Comptes** — Gestion des comptes
4. **Historique** — Historique des transactions
5. **Plus** — Paramètres, déconnexion, personnalisation

---

## Flux de données

```
budget.json → data.jsx → store.jsx → localStorage ↔ Cloudflare KV
                                          ↓
                                    composants React (app.jsx / screens.jsx)
```

---

## État actuel du projet

- **Statut** : En développement actif
- **Dernier commit** : 18 avril 2026 — upload de fichiers
- **Branche de travail** : `claude/eager-hypatia-UutC2`
- **Fonctionnalités stables** :
  - Auth biométrique WebAuthn
  - Navigation 5 onglets
  - Persistence localStorage + sync KV
  - Système de thèmes (4 thèmes, palettes, polices, densités)
  - Ajout de transactions (manuel, fixe, OCR)
  - Swipe-to-delete
  - Auto-catégorisation
  - Détection de doublons

---

## Prochaine étape prioritaire

> À définir selon la session en cours.
> Mettre à jour cette section à chaque fin de session.

---

## Historique des sessions

| Date | IA | Résumé |
|------|----|--------|
| 2026-04-20 | Claude (claude-sonnet-4-6) | Initialisation du SESSION.md — audit complet du repo, documentation de la structure et du stack |

---

## Notes techniques importantes

- Pas de build tool (webpack/vite) — les fichiers JSX sont transpilés directement par Babel en navigateur
- `ios-frame.jsx` est inclus mais non utilisé activement dans la navigation principale
- La variable `MI_WORKER_URL` doit être configurée pour le sync KV Cloudflare
- Les commentaires dans le code sont en **français**
- `budget.json` est volumineux (333 KB) — ne pas le modifier manuellement

---

*Généré le : 2026-04-20 — IA : Claude (claude-sonnet-4-6)*
*Mot-clé de fin de session : "on approche de la fin" → génère SESSION.md mis à jour immédiatement*
