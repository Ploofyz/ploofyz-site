# Ploofyz Website

Source code and delivery automation for [ploofyz.com](https://ploofyz.com), a React 19, TypeScript, and Vite website.

## Source of truth

- `main` contains the production source.
- `app/` is the authoritative website application.
- `.github/workflows/ci.yml` validates pull requests and `main`.
- `.github/workflows/deploy-pages.yml` builds and deploys Pages artifacts from `main`.
- Generated directories such as `app/node_modules/` and `app/dist/` are not source and must not be edited manually.

## Local development

Prerequisites: a current Node.js LTS release and npm.

```powershell
cd app
npm ci
npm run dev
```

The application tolerates missing Supabase variables for public pages. Copy `app/.env.example` to an ignored local environment file only when Supabase-backed features need testing.

## Verification

Run from `app/`:

```powershell
npm run lint
npm run test -- --run
npm run build
npm run preview
```

Known lint and test failures are currently reported by the non-blocking `quality-baseline` CI job. The production build is the initial required gate; the quality baseline must be repaired and promoted to a required gate without allowing new regressions.

## Contribution workflow

1. Create a short-lived branch from current `origin/main`.
2. Make one coherent change and preserve unrelated work.
3. Run proportional local checks.
4. Open a pull request into `main` and complete the PR template.
5. Merge only after required checks pass and review concerns are resolved.
6. Let GitHub Actions deploy the merged commit; do not edit deployment artifacts directly.

See [docs/MAINTENANCE.md](docs/MAINTENANCE.md) for branch conventions, verification requirements, deployment migration, rollback, dependency maintenance, repository cleanup, and the definition of done.

## Project map

- Application shell and routes: `app/src/App.tsx`
- Pages: `app/src/pages/`
- Shared components: `app/src/components/`
- Pavilion event records: `app/src/data/pavillion/events/`
- Public assets: `app/public/`
- GitHub automation: `.github/workflows/`
- Operations runbook: `docs/MAINTENANCE.md`

The project intentionally spells the feature **Pavillion** in code and visible copy. Preserve that spelling unless a coordinated rename is approved.
