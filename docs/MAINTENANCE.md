# Ploofyz Website Maintenance SOP

This runbook defines how changes move from an idea to `ploofyz.com`. It is intentionally lightweight enough for a small self-learning team while preserving professional release controls.

## 1. Operating model

- `main` is the only source-of-truth branch.
- Use short-lived branches created from the latest `origin/main`.
- Merge through pull requests. Do not push feature work directly to `main`.
- GitHub Actions builds the Vite application and deploys the generated artifact after a successful merge.
- Generated output is disposable. Do not edit `dist`, `node_modules`, minified assets, or a deployment branch by hand.
- Production credentials belong in GitHub environment secrets or variables, never in source control.

Recommended branch names:

- `feat/<short-description>` for user-facing features.
- `fix/<short-description>` for defects.
- `content/<short-description>` for site copy or event updates.
- `chore/<short-description>` for tooling and maintenance.
- `codex/<short-description>` for Codex-managed worktrees.

Delete branches after merge. Never reuse a branch whose pull request has already merged.

## 2. Start-of-work checklist

1. Confirm the authoritative repository is `Ploofyz/ploofyz-site`.
2. Run `git status --short --branch` and preserve unrelated work.
3. Run `git fetch origin`.
4. Create a new branch from `origin/main`.
5. Inspect the affected source before editing.
6. Keep the pull request focused on one coherent outcome.

Example:

```powershell
git fetch origin
git switch -c fix/example origin/main
cd app
npm ci
```

## 3. Local verification

Run commands from `app/`.

| Change type | Required checks |
| --- | --- |
| Content only | Targeted content/path check, `npm run build` |
| React or TypeScript | Targeted tests, `npm run lint`, `npm run test -- --run`, `npm run build` |
| Styling or responsive UI | Code checks plus browser checks near 360, 768, 1024, and 1440 px |
| Routing or deployment | Production build, preview, direct-route reload, JS/CSS asset requests, `CNAME` check |
| Dependencies or workflow | `npm ci`, full build, relevant workflow/schema validation |

The current lint and test suites have known failures. Until they are repaired, CI reports them as a non-blocking baseline while `build` remains the required gate. Every pull request must state whether the baseline improved, stayed unchanged, or regressed. New failures are not acceptable.

## 4. Pull-request SOP

1. Review `git diff --check`, changed files, and staged scope.
2. Use an imperative commit subject that describes the outcome.
3. Push the short-lived branch and open a pull request into `main`.
4. Complete every PR-template section, including existing failures and deployment impact.
5. Wait for the `build` check to pass.
6. Resolve all review conversations.
7. Prefer squash merge for a focused PR; use a merge commit only when preserving multiple meaningful commits is intentional.
8. Delete the branch after merge.

Recommended `main` ruleset after the first successful CI run:

- Require a pull request before merging.
- Require the `build` status check.
- Require conversation resolution.
- Block force pushes and branch deletion.
- Allow squash merge as the default strategy.
- Start with zero mandatory approvals for a solo maintainer; require one independent approval once another active maintainer exists.

## 5. Deployment SOP

After the Actions migration is enabled, every push to `main` runs `.github/workflows/deploy-pages.yml`:

1. Check out the merged commit.
2. Install locked dependencies with `npm ci`.
3. Build `app/dist`.
4. Verify `index.html`, `404.html`, root-relative assets, and `CNAME`.
5. Upload an immutable Pages artifact.
6. Deploy through the protected `github-pages` environment.

Do not report a release as live until the `deploy-pages` job succeeds and production smoke checks pass.

Post-deployment smoke checks:

1. Open `https://ploofyz.com/` and the changed route.
2. Hard-refresh the changed route and confirm it returns to the same route.
3. Confirm JavaScript and CSS assets return HTTP 200.
4. Check the browser console for top-level runtime errors.
5. Verify the expected visible content and one adjacent unaffected workflow.
6. Record the deployed commit SHA in the release report or PR.

## 6. Rollback and incident response

Use rollback only when production is materially broken and a forward fix cannot be completed quickly.

1. Record the failing deployment, commit SHA, error, and affected routes.
2. Identify the last known-good commit from the Pages deployment history.
3. Run `Deploy Pages` manually with the known-good commit SHA in the `ref` input.
4. Verify the restored site using the post-deployment checks.
5. Open a forward-fix branch from current `main`; do not rewrite `main` or force-push.
6. Document the cause, restoration SHA, fix PR, and prevention action.

For a small isolated defect, prefer a short-lived `fix/` branch and normal expedited PR over direct production edits.

## 7. Dependency and security maintenance

Dependabot checks npm and GitHub Actions weekly.

- Review patch/minor update groups within seven days.
- Review major updates individually with release notes and full verification.
- Never auto-merge a dependency PR that changes runtime behavior without a green build and targeted testing.
- Run `npm audit` monthly and prioritize exploitable runtime vulnerabilities over raw counts.
- Keep workflow permissions minimal and keep third-party actions pinned to immutable commit SHAs.
- Rotate exposed credentials immediately and remove them from Git history with a coordinated incident procedure.

## 8. Repository hygiene migration

The repository currently contains generated and legacy files that should be cleaned in separate, reviewable pull requests.

### Phase A: activate automated delivery

1. Merge the CI/CD standardization PR.
2. In **Settings > Pages**, change **Source** from `Deploy from a branch` to `GitHub Actions`.
3. Run `Deploy Pages` manually from `main` once.
4. Verify `ploofyz.com`, direct route reloads, assets, console, and `CNAME`.
5. Keep `gh-pages` temporarily as a rollback reference; stop writing new deployments to it.

### Phase B: stop tracking generated files

Create a dedicated cleanup branch and review the deletion separately:

```powershell
git rm -r --cached app/node_modules app/dist
git status --short
```

Confirm `app/.gitignore` still ignores both directories, run `npm ci` and `npm run build`, then merge the cleanup PR. This removes generated files from future snapshots without rewriting history.

### Phase C: retire legacy exports

Map each root-level HTML, CSS, and `assets/` file to the current React/Vite source. Delete only files proven unused by the build, custom domain, or external links. Remove the legacy `gh-pages` npm dependency and deploy script after the Actions deployment has completed successfully at least once.

### Phase D: optional history optimization

The generated files remain in old commits after Phase B. Rewrite history only if repository size still causes operational problems. History rewriting requires a backup, collaborator coordination, protected-branch changes, fresh clones, and explicit approval. It is not routine maintenance.

## 9. Maintenance schedule

| Frequency | Tasks |
| --- | --- |
| Every PR | Scope review, build gate, risk notes, deployment expectation |
| After every deploy | Route, asset, console, content, and adjacent-flow smoke checks |
| Weekly | Dependabot review, failed Actions review, stale branch cleanup |
| Monthly | `npm audit`, dependency backlog, Pages/custom-domain health, broken-link spot check |
| Quarterly | Ruleset review, rollback drill, repository-size review, SOP update |

## 10. Definition of done

A website change is done only when:

- The requested behavior is implemented in source.
- Required checks and known failures are reported accurately.
- The pull request is reviewed and merged into `main`.
- The Pages deployment succeeds when production delivery is expected.
- Production smoke checks pass.
- Remaining risk and follow-up work are recorded.
