# SESSION.md — Mani Budget Pro
> Fichier de continuité IA. Lire en début de session, mettre à jour en fin de session.

---

## Identité du projet

| Champ | Valeur |
|-------|--------|
| Nom | **Mani Budget Pro** (mbp.) |
| Type | Application de budget personnel — UI mobile-first en français |
| URL worker | `https://manibudgetpro.emmanueldelasse.workers.dev` |
| Repo GitHub | `emmanueldelasse-droid/mani-budget-pro` |
| Branche dev | `claude/youthful-davinci-Ir9pq` |
| Dernière session | 2026-05-14 · Claude (claude-sonnet-4-6) |

---

## Architecture

**Stack** : React 18 (CDN, sans build) + Babel Standalone + Cloudflare Workers + KV

```
Mani-Budget-Pro/
├── index.html           # Entrée : charge React/Babel + tous les scripts JSX
├── components/
│   ├── data.jsx         # Données statiques : mois budgetaires, catégories, couleurs
│   ├── store.jsx        # State management : localStorage (fallback) + Cloudflare KV (primaire)
│   ├── screens.jsx      # Écrans principaux : Accueil, Mois, Comptes, Historique
│   ├── screens2.jsx     # Écrans secondaires : Ajouter, Charts, Catégories, Objectifs, Plus
│   └── app.jsx          # App root : lock screen, navigation, thèmes, mode desktop
└── data/
    └── budget.json      # Données de budget exportées (source pour data.jsx)
```

**Pas de Node.js / npm** — tout tourne directement dans le navigateur.

---

## Fonctionnalités implémentées

### Navigation
- **5 onglets** : Accueil · Mois · Comptes · Historique · Plus
- Tab bar mobile fixe en bas + FAB `+`
- Sidebar desktop (≥900px) avec bouton logout

### Authentification
- Lock screen avec token secret (`X-Budget-Token` header → Cloudflare Worker)
- **WebAuthn / Face ID / Touch ID** : si token sauvegardé en localStorage, tentative biométrique automatique au démarrage
- Fallback manuel (saisie du token) toujours accessible

### Thèmes & personnalisation (TweaksPanel)
| Option | Valeurs |
|--------|---------|
| Thème | `editorial` (défaut) · `minimal` · `fintech` · `terminal` |
| Accent | `rouille` (défaut) · `indigo` · `vert` · `rose` · `ambre` · `cyan` |
| Police | `serif` (Fraunces) · `sans` (Inter) · `mono` (JetBrains Mono) · `grotesk` (Space Grotesk) |
| Densité | `confortable` (défaut) · `compact` |

Le TweaksPanel est activé par `postMessage({ type:'__activate_edit_mode' })` depuis un parent iframe.

### Store (store.jsx)
- Init : charge depuis Cloudflare KV → fallback localStorage
- Sync cloud au déverrouillage (`syncFromCloud`)
- Opérations : `addTx`, `addTxSafe` (dedup), `addGain`, `addGainSafe`, `addTransfer`, `deleteAdded`, `createNextMonth`, `reset`
- `createNextMonth` : copie les charges fixes du mois précédent + ajoute le découvert éventuel comme charge "Découvert [mois]"
- État global exposé sur `window.STORE`

### Gestion des mois
- Mois statiques dans `data.jsx` (via `window.BUDGET.months`)
- Mois dynamiques créés par l'utilisateur (stockés dans `state.newMonths`)
- `getMonths()` fusionne les deux sources, triées chronologiquement
- `getSummary(monthKey)` → `{ totalGains, totalFixes, totalVar, reste, byCategory }`

### Sync Cloudflare
- Endpoint : `GET/POST /budget` avec header `X-Budget-Token`
- Indicateur visuel : `⟳` (syncing) · `✓` (ok) · `!` (erreur) en haut à droite

---

## Variables CSS (theming)

```css
--bg, --card, --fg, --muted, --line
--chip-bg, --accent-soft, --hero-bg, --hero-fg
--pos, --neg, --accent, --accent-fg, --font
```

---

## Points d'attention / décisions techniques

1. **Pas de build step** — avantage : déploiement immédiat sur GitHub Pages / Cloudflare Pages. Contrainte : pas de modules ES, tout via `window.*`.
2. **Dedup transactions** : clé = `detail.toLowerCase() + '|' + Math.abs(amount)` par mois. Ne pas modifier sans vérifier `addTxSafe` et `addGainSafe`.
3. **WebAuthn simplifié** : le client ne fait que vérifier la présence biométrique (challenge aléatoire local) puis utilise le token stocké. Pas de vrai enregistrement WebAuthn côté serveur.
4. **`window.__storeReady`** : Promise qui se résout quand le store est initialisé. Toujours attendre cette Promise avant d'utiliser `window.STORE`.
5. **`window.__budgetReady`** : Promise résolue par `data.jsx` quand `window.BUDGET`, `window.CURRENT_MONTH`, etc. sont disponibles.

---

## État actuel (2026-05-14)

- **Fonctionnel** : lock screen, navigation 5 onglets, thèmes, sync Cloudflare KV, ajout de transactions, gestion de mois, desktop + mobile
- **Manque / À faire** :
  - Contenu des écrans `ScreenCharts`, `ScreenCategories`, `ScreenGoals` (déclarés dans `app.jsx` mais à vérifier dans `screens2.jsx`)
  - Données réelles dans `data/budget.json` et `components/data.jsx`
  - Tests manuels de la biométrie WebAuthn sur un vrai appareil iOS/Android

---

## Prochaine étape prioritaire

> Vérifier et compléter les écrans `ScreenCharts`, `ScreenCategories`, et `ScreenGoals` dans `screens2.jsx` — confirmer qu'ils ont un contenu fonctionnel ou identifier ce qui manque.

---

## Commandes utiles

```bash
# Lancer localement (simple HTTP server)
python3 -m http.server 8080
# ou
npx serve .

# Push sur la branche de dev
git push -u origin claude/youthful-davinci-Ir9pq
```

---

## Contexte pour reprendre

Pour reprendre une session, donne ce fichier à l'IA et dis-lui ce que tu veux faire. L'état du code est dans les 6 fichiers listés ci-dessus — pas d'autre fichier de config. Le Cloudflare Worker n'est pas dans ce repo (il est géré séparément sur le dashboard Cloudflare).
