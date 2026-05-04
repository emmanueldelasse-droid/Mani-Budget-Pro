# SESSION.md — Mani Budget Pro

> Fichier de continuité IA. Lis ce fichier au début de chaque session avant de commencer.

---

## Résumé projet

**Nom** : Mani Budget Pro
**Type** : Application web de suivi budgetaire personnel, browser-based (aucun build step)
**Stack** : React 18.3.1 + Babel standalone (JSX servi directement), pas de Node/npm
**Backend** : Cloudflare Worker — `https://manibudgetpro.emmanueldelasse.workers.dev`
**Repo** : `emmanueldelasse-droid/mani-budget-pro`
**Branche de travail active** : `claude/youthful-davinci-UzpdQ`

---

## Architecture des fichiers

```
Mani-Budget-Pro/
├── SESSION.md                  ← ce fichier
├── index.html                  ← entry point HTML, charge React/Babel via CDN
├── components/
│   ├── app.jsx       (321 L)   ← app principale, thèmes, lock screen, WebAuthn auth
│   ├── data.jsx       (78 L)   ← utilitaires de données, parsing budget.json
│   ├── ios-frame.jsx (338 L)   ← frame device iOS (aperçu UI)
│   ├── screens.jsx   (690 L)   ← écrans Accueil, Mois, Comptes, Historique
│   ├── screens2.jsx  (411 L)   ← écrans Paramètres + autres
│   └── store.jsx     (225 L)   ← state management, sync Cloudflare KV + localStorage
└── data/
    └── budget.json             ← données budgétaires (mois depuis Sept 2023)
```

---

## Fonctionnalités implémentées

### Auth & Sécurité
- Lock screen avec WebAuthn (Face ID / Touch ID)
- Fallback token manuel (`X-Budget-Token` header)
- Token sauvegardé en `localStorage` (`mi:token`)

### Thèmes & Personnalisation
- **4 thèmes** : Editorial (défaut), Minimal, Fintech, Terminal
- **6 accents** : rouille (défaut), indigo, vert, rose, ambre, cyan
- **4 polices** : serif/Fraunces (défaut), sans/Inter, mono/JetBrains Mono, grotesk/Space Grotesk
- **Densité** : confortable (défaut)

### Budget & Données
- Suivi mensuel : salaire, dépenses fixes, dépenses variables, reste
- Types de transactions : gains, `depFixes`, `depVar`
- Compte B (compteBEntries)
- Virements (transfers)
- Objectifs (goals)
- Ajout de nouveaux mois (newMonths)
- Déduplication automatique des transactions

### Persistance
- Cloud first : Cloudflare KV via Worker
- Fallback : localStorage (`mi:store:v1`)
- Clé locale : `mi:store:v1`

### Composants UI
- `Card`, `Section`, `Chip`, `CatDot`
- Graphiques : `Bars`, `Spark` (sparkline SVG), `Donut`
- `TxRow` (ligne de transaction avec catégorie colorée)

---

## Worker Cloudflare

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/budget` | GET | Charge l'état (auth via `X-Budget-Token`) |
| `/budget` | POST | Sauvegarde l'état (auth via `X-Budget-Token`) |

URL Worker : `https://manibudgetpro.emmanueldelasse.workers.dev`
Définie dans `app.jsx` ligne 5 : `window.MI_WORKER_URL`

---

## État actuel du projet

- [x] App fonctionnelle (lock screen + auth + thèmes + sync cloud)
- [x] Données budget.json présentes (Sept 2023 → présent)
- [x] Tous les composants en place
- [ ] Aucune modification custom sur la branche de travail actuelle
- [ ] Prochaine étape : à définir selon les besoins de la session

---

## Prochaine étape prioritaire

> **À renseigner en début/fin de session** — Décris ici la prochaine action concrète.

Exemple : "Ajouter un écran de statistiques annuelles" ou "Corriger le bug d'affichage du solde négatif".

---

## Décisions techniques

| Date | Décision | Raison |
|------|----------|--------|
| (initiale) | Pas de build step — Babel standalone CDN | Déploiement simple, pas de Node requis |
| (initiale) | Cloudflare Worker pour la persistance | Gratuit, global, sans serveur dédié |
| (initiale) | WebAuthn pour l'auth biométrique | UX native iOS/macOS |

---

## Bugs connus / Points d'attention

- `reste` peut être négatif (calcul : salaire − fixes − variables). Normal.
- La déduplication compare `detail` (insensible à la casse) + `amount` par mois.
- Si le Worker est down, l'app tombe sur localStorage silencieusement.

---

## Comment reprendre une session

1. Lis ce fichier
2. Résume en 3 lignes : projet, état, prochaine étape
3. Demande ce que l'utilisateur veut faire aujourd'hui
4. **Ne jamais inventer l'état du projet** — tout est dans ce fichier + le code

**Mot-clé fin de session** : "on approche de la fin" / "tokens" / "sauvegarde la session"
→ Génère immédiatement le SESSION.md mis à jour, avant toute autre réponse.

---

*Dernière mise à jour : 2026-05-04 — IA : Claude (claude-sonnet-4-6)*
