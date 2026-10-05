# Publishing Guide for ngx-mat-progress-bar

Releases are made by the GitHub Actions workflow `.github/workflows/publish.yml`. **A push to `main` is a release** whenever the version in `projects/mat-progress-bar-library/package.json` is not on npm yet, so merging a pull request that bumps the version publishes it.

## Setup Requirements

### 1. npm Trusted Publishing Setup

The workflow publishes to npm with [Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC). GitHub Actions proves its identity to npm for each run, so **no npm token is stored in this repository** and there is nothing to renew.

This is a one-time setup on npmjs.com, done by a maintainer of the package:

1. Go to https://www.npmjs.com/package/ngx-mat-progress-bar → **Settings**
2. In the **Trusted Publisher** section, choose **GitHub Actions** and fill in:
   - **Organization or user**: `evicio1`
   - **Repository**: `ngx-mat-progress-bar`
   - **Workflow filename**: `publish.yml` (the filename only, not the path)
   - **Environment name**: leave empty
   - **Allowed actions**: allow `npm publish`
3. Save. npm asks for your two-factor code.

The values must match exactly. If the repository is renamed or `.github/workflows/publish.yml` is renamed, update the trusted publisher or publishing fails with an authentication error.

Requirements, all met by the workflow: a GitHub-hosted runner, the `id-token: write` permission, npm 11.5.1 or later and Node.js 22.14.0 or later. Packages published this way get a provenance attestation automatically.

**Why not a token:** npm is retiring token-based publishing from CI. Write tokens expire after 90 days at most, and granular tokens that bypass 2FA lose the ability to publish directly around January 2027 ([announcement](https://github.blog/changelog/2026-07-08-npm-install-time-security-and-gat-bypass2fa-deprecation/)). The old `NPM_TOKEN` repository secret is no longer used and can be deleted. Once trusted publishing works, npm recommends setting the package's **Publishing access** to "Require two-factor authentication and disallow tokens".

### 2. What Triggers a Release

| Trigger | What happens |
|---------|--------------|
| Push to `main` (including a merged pull request) | Publishes the version in `projects/mat-progress-bar-library/package.json` if it is not on npm. If it is already on npm, the run fails at "Stop if version exists" and nothing is published |
| Push of a tag `v*` | Same, and the tag must equal `v` + the version in `package.json` or the run fails. You normally do not push tags yourself: the workflow creates the tag after publishing |
| **Run workflow** in the Actions tab | Same as a push to the selected branch |

A pull request does not run the workflow, and neither does a push to any other branch.

### 3. What the Workflow Does

- Builds the library with `npm run build:lib` (this also copies `README.md` and `LICENSE` into the package)
- Checks if the current version already exists on npm
- **Stops and fails if the version exists** (you need to update the version manually)
- Publishes to npm only if the version is new
- Creates a git tag `v<version>` for the published version
- **Creates a GitHub Release** with release notes and the package tarball
- **Publishes to GitHub Packages** (as `@evicio1/ngx-mat-progress-bar`), using the workflow's `GITHUB_TOKEN`

The workflow does not bump versions.

### 4. Manual Publishing (Alternative)

You need to be logged in with `npm login`, and npm asks for your two-factor code if 2FA is enabled:

```bash
# Build the library (also copies README.md and LICENSE into dist) and publish it
npm run publish:npm

# Or only build a tarball to inspect: dist/ngx-mat-progress-bar-<version>.tgz
npm run package
```

Building requires a Node.js version supported by Angular 22 (`^22.22.3`, `^24.15.0` or `>=26`). The workflow uses Node.js 24.

## Troubleshooting

1. **"Publish to npm" fails with `404 Not Found - PUT https://registry.npmjs.org/ngx-mat-progress-bar`** (or 401, 403, `ENEEDAUTH`): npm could not authenticate. The package exists; a 404 on publish means "not authorised". The trusted publisher on npmjs.com is missing or does not match this run. The failed step prints the repository and workflow it identified as, and the reason npm recorded. Check each field in "npm Trusted Publishing Setup" above:
   - it is configured on the **package** (`ngx-mat-progress-bar` → Settings), not on your account
   - **Organization or user** is the GitHub owner `evicio1`, and **Repository** is only `ngx-mat-progress-bar`
   - **Workflow filename** is only `publish.yml`
   - **Environment name** is empty
   - `npm publish` is ticked under **Allowed actions** (only `npm stage publish` is allowed by default)

   After fixing it, re-run the failed job. No new commit is needed.

2. **Version already exists**: The workflow checks for this and fails. Update the version in `projects/mat-progress-bar-library/package.json` and push again.

3. **Tag does not match version**: A pushed tag such as `v22.0.1` must match the version in `projects/mat-progress-bar-library/package.json`. Delete the tag, fix the version, and let the workflow create the tag.

4. **Missing files in the package**: `npm run build:lib` copies `README.md` and `LICENSE` to the dist folder (`postbuild:lib` script). `ng build mat-progress-bar-library` on its own does not.

5. **Write access to repository not granted**: The workflow needs `contents: write` (tags and releases), `packages: write` (GitHub Packages) and `id-token: write` (npm trusted publishing). All three are set in `publish.yml`.

## Installation Options

After publishing, users can install the package from multiple sources:

### From NPM (Primary)

```bash
npm install ngx-mat-progress-bar
```

### From GitHub Packages

```bash
# First, configure npm to use GitHub Packages for @evicio1 scope
echo "@evicio1:registry=https://npm.pkg.github.com" >> ~/.npmrc

# Then install
npm install @evicio1/ngx-mat-progress-bar
```

### From GitHub Releases

- Go to: https://github.com/evicio1/ngx-mat-progress-bar/releases
- Download the `.tgz` file
- Install locally: `npm install path/to/ngx-mat-progress-bar-x.x.x.tgz`

## Current Package Information

- **Package Name**: ngx-mat-progress-bar
- **Current Version**: 22.0.0
- **Angular Version**: 22+ (any 22.x version)
- **NPM URL**: https://www.npmjs.com/package/ngx-mat-progress-bar
- **GitHub Packages**: @evicio1/ngx-mat-progress-bar
- **Repository**: https://github.com/evicio1/ngx-mat-progress-bar
- **Releases**: https://github.com/evicio1/ngx-mat-progress-bar/releases

## Versioning Strategy

The version follows a **Major-Minor-Patch** pattern aligned with Angular:

### Format: `[ANGULAR_MAJOR].[FEATURE].[PATCH]`

- **Major Version**: Matches the Angular major version
  - `20.x.x` = Compatible with Angular 20 (any 20.x version)
  - `22.x.x` = Compatible with Angular 22 (any 22.x version)
- **Minor Version**: New features, enhancements, non-breaking changes
- **Patch Version**: Bug fixes, minor improvements

There is no 21.x release.

## Publishing Process

1. Make your changes to the library
2. **Update the version in `projects/mat-progress-bar-library/package.json`** (and in the root `package.json`, which is kept in step) and add an entry to `CHANGELOG.md`
3. Open a pull request and merge it to `main`
4. GitHub Actions will automatically:
   - Build and publish to npm (if the version is new)
   - Create a git tag and a GitHub Release with release notes and the downloadable package
   - Publish to GitHub Packages as `@evicio1/ngx-mat-progress-bar`
5. Check the results:
   - **npm**: https://www.npmjs.com/package/ngx-mat-progress-bar
   - **GitHub Releases**: https://github.com/evicio1/ngx-mat-progress-bar/releases

**Note**: A push to `main` that does not change the version, for example a documentation fix, ends in a failed run at "Stop if version exists". That is expected and publishes nothing.
