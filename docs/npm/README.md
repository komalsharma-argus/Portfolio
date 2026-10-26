# Understanding NPM

A practical, SDE-1-level guide to **npm (Node Package Manager)**,
covering how npm works, how to manage dependencies, how packages are
resolved and executed, how to publish packages, and how to troubleshoot
real-world Node.js projects.

#### What is npm?

**npm** originally stood for Node Package Manager. It is the default
package manager for Node.js and consists broadly of:

-   A **CLI** used from the terminal.
-   A **registry** where packages are published and downloaded.
-   A package/dependency resolution system.
-   A package metadata and versioning ecosystem.

npm allows developers to:

-   Install third-party libraries.
-   Install development tools.
-   Manage project dependencies.
-   Run project scripts.
-   Publish reusable packages.
-   Share code across projects.
-   Reproduce dependency installations across machines and CI
    environments.

Example:

``` bash
npm install express
```

This generally:

1.  Resolves the requested package and its dependencies.
2.  Downloads the required package metadata/artifacts.
3.  Places packages under `node_modules`.
4.  Updates `package.json`.
5.  Updates `package-lock.json`.

------------------------------------------------------------------------

### Node.js, npm, and npx

These three are related but serve different purposes.

#### Node.js

Node.js is the JavaScript runtime.

``` bash
node app.js
```

runs JavaScript using Node.js.

#### npm

npm manages packages and project dependencies.

``` bash
npm install express
```

#### npx

`npx` executes package binaries.

For example:

``` bash
npx eslint .
```

You can think of them as:

``` text
Node.js -> Runs JavaScript
npm     -> Installs/manages packages
npx     -> Executes package-provided CLI binaries
```

Modern npm distributions include `npx`.

------------------------------------------------------------------------

### Installing and Verifying npm

Installing Node.js normally installs npm as well.

Check versions:

``` bash
node -v
npm -v
npx -v
```

Useful diagnostic command:

``` bash
npm doctor
```

The exact output depends on the installed Node.js/npm versions and
operating system.

------------------------------------------------------------------------

### npm Registry

The **npm registry** is the package repository used by npm.

The default public registry is:

``` text
https://registry.npmjs.org/
```

A package can contain:

-   Package name
-   Version
-   Description
-   Dependencies
-   Entry points
-   README
-   License
-   Repository metadata
-   Published files

Search packages:

``` bash
npm search express
```

View package metadata:

``` bash
npm view express
```

View a specific field:

``` bash
npm view express version
npm view express dependencies
npm view express dist.tarball
```

------------------------------------------------------------------------

### package.json

`package.json` is one of the most important files in a Node.js project.

Create one:

``` bash
npm init
```

or:

``` bash
npm init -y
```

A basic example:

``` json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "Example Node.js application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "node --test"
  },
  "dependencies": {
    "express": "^5.1.0"
  },
  "devDependencies": {
    "eslint": "^9.0.0"
  },
  "engines": {
    "node": ">=20"
  },
  "license": "MIT"
}
```

#### Important package.json fields

##### name

Package/project name.

``` json
"name": "my-app"
```

For published packages, the name must follow npm naming rules.

##### version

The package's current version.

``` json
"version": "1.0.0"
```

##### description

Short description of the package.

##### main

Historically used as the CommonJS entry point.

``` json
"main": "index.js"
```

For modern packages, `exports` is often preferred.

##### type

Controls how `.js` files are interpreted.

``` json
"type": "module"
```

means `.js` files are treated as ES modules.

Without it, `.js` files are generally treated as CommonJS unless another
rule applies.

##### scripts

Defines commands that can be run using npm.

``` json
"scripts": {
  "dev": "node --watch src/index.js",
  "start": "node src/index.js"
}
```

Run:

``` bash
npm run dev
npm start
```

##### dependencies

Packages required by the application at runtime.

``` json
"dependencies": {
  "express": "^5.1.0"
}
```

##### devDependencies

Packages required primarily for development, testing, linting, building,
etc.

``` json
"devDependencies": {
  "eslint": "^9.0.0"
}
```

##### peerDependencies

Used when the package expects the consuming project to provide a
compatible dependency.

Common in:

-   React libraries
-   UI component libraries
-   Plugins
-   Framework integrations

Example:

``` json
"peerDependencies": {
  "react": ">=18"
}
```

##### optionalDependencies

Dependencies that are allowed to fail during installation without
necessarily failing the entire installation.

##### bundledDependencies

Dependencies that are included inside the published package.

Use this only when there is a concrete reason; ordinary dependencies are
normally preferable.

##### engines

Specifies supported runtime versions.

``` json
"engines": {
  "node": ">=20"
}
```

This communicates compatibility expectations but should not be treated
as a substitute for runtime enforcement.

------------------------------------------------------------------------

### package-lock.json

`package-lock.json` records the dependency tree resolved for a project.

It helps provide:

-   Reproducible installations.
-   Exact package versions.
-   Integrity information.
-   Dependency relationships.
-   Faster and more deterministic CI installations.

A simplified relationship is:

``` text
package.json
    |
    | declares acceptable versions
    v
package-lock.json
    |
    | records resolved versions
    v
node_modules
    |
    | contains installed packages
```

#### Should package-lock.json be committed?

For applications, generally **yes**.

Commit:

``` text
package.json
package-lock.json
```

Do not normally commit:

``` text
node_modules/
```

------------------------------------------------------------------------

### node_modules

`node_modules` contains installed dependencies.

Example:

``` text
project/
├── node_modules/
├── src/
├── package.json
└── package-lock.json
```

You normally should not manually edit files inside `node_modules`.

If dependencies become corrupted, a common clean reinstall is:

``` bash
rm -rf node_modules
npm ci
```

On Windows PowerShell, an equivalent approach is:

``` powershell
Remove-Item -Recurse -Force node_modules
npm ci
```

------------------------------------------------------------------------

### Dependencies vs Dev Dependencies vs Peer Dependencies

This distinction is important in professional development.

#### dependencies

Required for the application to run.

Example:

``` json
"dependencies": {
  "express": "^5.1.0"
}
```

#### devDependencies

Required for development/build/test workflows.

Example:

``` json
"devDependencies": {
  "typescript": "^5.0.0",
  "eslint": "^9.0.0"
}
```

#### peerDependencies

Used by libraries when the host application is expected to provide a
dependency.

Example:

``` json
"peerDependencies": {
  "react": ">=18"
}
```

##### Rule of thumb

Ask:

> "Does the production application need this package to execute?"

If yes, it is generally a `dependency`.

If it is only required to build, test, lint, format, or develop the
project, it is generally a `devDependency`.

------------------------------------------------------------------------

### Semantic Versioning

npm packages commonly use **Semantic Versioning (SemVer)**.

Format:

``` text
MAJOR.MINOR.PATCH
```

Example:

``` text
2.4.7
```

means:

-   `2` -\> MAJOR
-   `4` -\> MINOR
-   `7` -\> PATCH

#### MAJOR

Breaking API changes.

``` text
2.x.x -> 3.x.x
```

#### MINOR

Backward-compatible features.

``` text
2.4.x -> 2.5.x
```

#### PATCH

Backward-compatible bug fixes.

``` text
2.4.7 -> 2.4.8
```

Pre-release versions can look like:

``` text
2.5.0-beta.1
```

------------------------------------------------------------------------

### Version Ranges

npm supports version ranges.

#### Exact version

``` json
"express": "5.1.0"
```

Only that version is requested.

#### Caret

``` json
"express": "^5.1.0"
```

Generally permits compatible updates that do not change the left-most
non-zero major/minor compatibility boundary.

For a normal major version:

``` text
^5.1.0
```

allows versions:

``` text
>=5.1.0 <6.0.0
```

#### Tilde

``` json
"express": "~5.1.0"
```

Generally allows patch-level updates:

``` text
>=5.1.0 <5.2.0
```

#### Wildcards

``` json
"express": "5.x"
```

or:

``` json
"express": "*"
```

Avoid overly broad ranges unless there is a specific reason.

------------------------------------------------------------------------

### Installing Packages

#### Install a production dependency

``` bash
npm install express
```

Shortcut:

``` bash
npm i express
```

#### Install a development dependency

``` bash
npm install --save-dev eslint
```

Shortcut:

``` bash
npm i -D eslint
```

#### Install a specific version

``` bash
npm install express@5.1.0
```

#### Install the latest version

``` bash
npm install express@latest
```

#### Install a package globally

``` bash
npm install -g typescript
```

Use global installation mainly for tools that you intentionally want
available system-wide. Project dependencies should normally be local.

#### Install all project dependencies

``` bash
npm install
```

npm reads `package.json` and the lockfile when available.

------------------------------------------------------------------------

### Removing and Updating Packages

Remove:

``` bash
npm uninstall express
```

Update packages within their declared ranges:

``` bash
npm update
```

Check outdated dependencies:

``` bash
npm outdated
```

View installed dependency tree:

``` bash
npm ls
```

View a specific package:

``` bash
npm ls express
```

------------------------------------------------------------------------

### npm Scripts

Scripts are commands defined in `package.json`.

Example:

``` json
{
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "lint": "eslint .",
    "test": "node --test"
  }
}
```

Run:

``` bash
npm run dev
npm start
npm run lint
npm test
```

Some scripts have special shorthand:

``` bash
npm start
npm test
npm restart
npm stop
```

#### Why scripts matter

They standardize project commands.

Instead of asking every developer to remember:

``` bash
node --watch src/server.js
```

the project can provide:

``` bash
npm run dev
```

This becomes particularly valuable in teams and CI/CD pipelines.

------------------------------------------------------------------------

### npx

`npx` runs executables supplied by npm packages.

Example:

``` bash
npx eslint .
```

For a package that exposes a CLI:

``` bash
npx <package-command>
```

A useful mental model:

``` text
npm install -> acquire/manage packages
npx          -> execute package binaries
```

For reproducible project tooling, prefer using the project's locally
installed version rather than relying on an unrelated global
installation.

------------------------------------------------------------------------

### Global vs Local Packages

#### Local installation

``` bash
npm install eslint --save-dev
```

The package is available to the project.

Typical location:

``` text
node_modules/.bin/
```

npm scripts automatically make local binaries available on `PATH`.

#### Global installation

``` bash
npm install -g eslint
```

The package is installed into npm's global prefix.

Check the global prefix:

``` bash
npm prefix -g
```

##### Best practice

For project-specific tooling:

``` text
Prefer local installation.
```

This avoids "works on my machine" problems caused by different global
versions.

------------------------------------------------------------------------

### How npm Resolves Dependencies

Suppose your application depends on:

``` text
A
```

and A depends on:

``` text
B
```

The resulting graph is:

``` text
Application
└── A
    └── B
```

Now suppose another package also requires B:

``` text
Application
├── A
│   └── B
└── C
    └── B
```

npm tries to construct a valid dependency tree while avoiding
unnecessary duplication.

The exact tree depends on:

-   Requested version ranges.
-   npm version.
-   Peer dependencies.
-   Existing lockfile.
-   Platform.
-   Optional dependencies.
-   Package metadata.

Understanding npm as a **dependency graph resolver**, rather than merely
a downloader, is important for debugging.

------------------------------------------------------------------------

### npm install vs npm ci

This is a very common SDE-1 and production question.

#### npm install

Used for normal development.

``` bash
npm install
```

It can:

-   Resolve dependencies.
-   Update the lockfile when necessary.
-   Install packages.
-   Reconcile `package.json` and the lockfile.

#### npm ci

Primarily intended for clean, automated, reproducible installations.

``` bash
npm ci
```

Important characteristics:

-   Requires a compatible lockfile.
-   Installs from the lockfile.
-   Removes existing `node_modules` before installation.
-   Does not intentionally update the lockfile.
-   Commonly used in CI/CD.

##### Typical workflow

Developer:

``` bash
npm install
```

CI:

``` bash
npm ci
```

------------------------------------------------------------------------

### Dependency Trees and Deduplication

Use:

``` bash
npm ls
```

to inspect dependencies.

A project can accidentally contain multiple versions of the same
package:

``` text
node_modules/
├── package-a/
│   └── node_modules/
│       └── lodash@4.x
└── lodash@4.x
```

npm can sometimes **deduplicate** compatible dependencies.

Command:

``` bash
npm dedupe
```

However, do not assume every duplicate can or should be removed.
Different packages may legitimately require incompatible versions.

------------------------------------------------------------------------

### npm Workspaces

Workspaces allow multiple packages to live in one repository.

Example:

``` text
monorepo/
├── package.json
├── package-lock.json
└── packages/
    ├── api/
    │   └── package.json
    ├── web/
    │   └── package.json
    └── shared/
        └── package.json
```

Root `package.json`:

``` json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

Workspaces are useful for:

-   Monorepos.
-   Shared libraries.
-   Frontend + backend repositories.
-   Internal packages.
-   Shared TypeScript utilities.

Example:

``` bash
npm install
```

from the root can install workspace dependencies.

Run a workspace script:

``` bash
npm run build --workspace=web
```

Workspaces are different from simply having multiple unrelated Node.js
projects in the same Git repository.

------------------------------------------------------------------------

### npm Configuration and .npmrc

npm configuration can be controlled using:

``` text
.npmrc
```

Configuration can exist at different levels, including:

-   Project level.
-   User level.
-   Global level.
-   Environment variables / CLI flags.

Inspect configuration:

``` bash
npm config list
```

Get a specific value:

``` bash
npm config get registry
```

Set a value:

``` bash
npm config set registry https://registry.npmjs.org/
```

##### Important caution

Never commit credentials or authentication tokens into `.npmrc`.

For private registries, authentication should be handled securely using
environment variables, CI secrets, or supported npm authentication
mechanisms.

------------------------------------------------------------------------

### Environment Variables and Secrets

Do not put secrets directly into:

``` text
package.json
.npmrc
Git
source code
```

Bad:

``` json
{
  "someToken": "actual-secret-value"
}
```

Prefer environment variables and secret managers.

For CI/CD, configure secrets through the CI platform.

A common `.gitignore` includes:

``` gitignore
node_modules/
.env
.env.*
```

Be careful: some projects intentionally commit non-secret `.env.example`
files.

------------------------------------------------------------------------

### Private Registries and Scoped Packages

npm supports scoped packages:

``` text
@company/package-name
```

Example:

``` bash
npm install @company/shared-utils
```

Organizations can use private registries to distribute internal
packages.

A project can configure a registry for a scope:

``` ini
@company:registry=https://registry.example.com/
```

This allows different scopes to resolve through different registries.

Private package authentication should be configured securely and never
hard-coded into source control.

------------------------------------------------------------------------

### Publishing an npm Package

Before publishing, ensure:

``` json
{
  "name": "my-package",
  "version": "1.0.0"
}
```

Login:

``` bash
npm login
```

Inspect what will be published:

``` bash
npm pack --dry-run
```

This is extremely useful because it shows which files will be included.

Publish:

``` bash
npm publish
```

For scoped public packages, depending on package configuration:

``` bash
npm publish --access public
```

#### Versioning before publishing

Patch:

``` bash
npm version patch
```

Minor:

``` bash
npm version minor
```

Major:

``` bash
npm version major
```

These commands update the package version and typically create the
corresponding Git metadata depending on configuration.

##### Important

Do not treat publishing as:

``` text
write code -> npm publish
```

A professional release process should also consider:

-   Tests.
-   Build output.
-   Package contents.
-   README.
-   License.
-   Versioning.
-   Changelog.
-   Security.
-   Compatibility.
-   Access control.

------------------------------------------------------------------------

### Package Entry Points and Exports

A package needs a clear public API.

Historically:

``` json
{
  "main": "index.js"
}
```

Modern packages can use:

``` json
{
  "exports": {
    ".": "./dist/index.js"
  }
}
```

`exports` provides stronger control over which files consumers can
import.

Example:

``` json
{
  "exports": {
    ".": "./dist/index.js",
    "./utils": "./dist/utils.js"
  }
}
```

Then consumers can use:

``` javascript
import packageName from "package-name";
```

or:

``` javascript
import { helper } from "package-name/utils";
```

depending on the package's module format and exports.

A key concept:

> `exports` defines the package's supported public import surface.

This can prevent consumers from depending on internal implementation
files.

------------------------------------------------------------------------

### CommonJS vs ESM

Node.js supports both major JavaScript module systems.

#### CommonJS

``` javascript
const express = require("express");

module.exports = myFunction;
```

#### ES Modules

``` javascript
import express from "express";

export default myFunction;
```

A package can declare ESM behavior using:

``` json
{
  "type": "module"
}
```

CommonJS can explicitly use:

``` text
.cjs
```

ES modules can explicitly use:

``` text
.mjs
```

##### Why SDE-1 developers should understand this

Many npm errors are actually module-system errors:

``` text
require is not defined
Cannot use import statement outside a module
ERR_REQUIRE_ESM
```

When debugging, inspect:

-   `package.json`
-   `"type"`
-   File extensions
-   Package `exports`
-   Whether the dependency is CommonJS or ESM

------------------------------------------------------------------------

### Lifecycle and Pre/Post Scripts

npm supports lifecycle scripts.

For example:

``` json
{
  "scripts": {
    "prebuild": "npm run clean",
    "build": "tsc",
    "postbuild": "node scripts/postbuild.js"
  }
}
```

Running:

``` bash
npm run build
```

can cause:

``` text
prebuild
   ↓
build
   ↓
postbuild
```

There are also lifecycle events associated with installation and
publishing.

##### Security consideration

Lifecycle scripts can execute code during package installation or other
npm operations.

This is one reason dependency trust and supply-chain security matter.

------------------------------------------------------------------------

### Security

npm projects are exposed to software supply-chain risks.

Major categories include:

-   Malicious packages.
-   Compromised dependencies.
-   Vulnerable dependencies.
-   Typosquatting.
-   Dependency confusion.
-   Malicious install scripts.
-   Credential leakage.
-   Stale dependencies.
-   Untrusted transitive dependencies.

#### Typosquatting

An attacker may publish a package with a name similar to a popular
package.

Example concept:

``` text
popular-package
populer-package
```

Always verify package names before installing.

#### Dependency confusion

An internal package name can accidentally resolve to a malicious public
package if registry configuration is incorrect.

Scoped private packages and explicit registry configuration help reduce
this risk.

------------------------------------------------------------------------

### Auditing and Vulnerability Management

Check vulnerabilities:

``` bash
npm audit
```

Attempt automatic fixes:

``` bash
npm audit fix
```

Be careful with aggressive upgrades because security fixes can introduce
breaking changes.

You should understand:

``` text
Direct dependency
        ↓
Transitive dependency
        ↓
Vulnerable package
```

A vulnerability may exist in a package you never directly installed.

Useful commands:

``` bash
npm audit
npm ls <package-name>
npm explain <package-name>
```

`npm explain` can help identify why a package exists in the dependency
tree.

------------------------------------------------------------------------

### Reproducible Builds and CI/CD

A production Node.js project should aim for reproducible dependency
installation.

Typical CI flow:

``` text
Clone repository
      ↓
Install Node.js
      ↓
npm ci
      ↓
Run lint
      ↓
Run tests
      ↓
Build
      ↓
Package/deploy
```

Example:

``` bash
npm ci
npm test
npm run build
```

The lockfile is important because different developers should not
randomly receive different transitive dependency versions.

------------------------------------------------------------------------

### Caching

npm maintains a local cache.

Inspect:

``` bash
npm cache verify
```

Clean the cache only when there is a concrete reason:

``` bash
npm cache clean --force
```

Do not make cache deletion your default response to every npm problem.

Many npm issues are caused by:

-   Incorrect package versions.
-   Peer dependency conflicts.
-   Broken lockfiles.
-   Registry/authentication issues.
-   Node/npm incompatibility.
-   Platform-specific optional dependencies.

------------------------------------------------------------------------

### Troubleshooting npm

#### 1. "Module not found"

Example:

``` text
Cannot find module 'express'
```

Check:

``` bash
npm ls express
```

If missing:

``` bash
npm install express
```

Also verify that you are running the command from the correct project
directory.

------------------------------------------------------------------------

#### 2. Delete node_modules and reinstall

When the dependency installation is genuinely corrupted:

``` bash
rm -rf node_modules
npm ci
```

On Windows PowerShell:

``` powershell
Remove-Item -Recurse -Force node_modules
npm ci
```

------------------------------------------------------------------------

#### 3. package-lock.json conflict

If `package.json` and the lockfile are inconsistent, understand why
before deleting the lockfile.

For a clean CI environment:

``` bash
npm ci
```

requires the lockfile to satisfy npm's expectations.

Do not blindly delete `package-lock.json` as a first troubleshooting
step.

------------------------------------------------------------------------

#### 4. Peer dependency conflict

You may see errors such as:

``` text
ERESOLVE unable to resolve dependency tree
```

First understand the conflicting package requirements.

Inspect:

``` bash
npm ls
npm explain <package>
```

Avoid immediately using:

``` bash
npm install --legacy-peer-deps
```

as a permanent solution. It can bypass dependency resolution protections
and leave an invalid or unsupported combination.

------------------------------------------------------------------------

#### 5. EACCES / permission errors

On Unix-like systems, permission errors can happen when npm directories
are owned by another user.

Investigate:

``` bash
npm config get prefix
```

Avoid solving the problem by routinely running npm with:

``` bash
sudo npm install
```

A correct Node/npm installation and user-level configuration is
preferable.

------------------------------------------------------------------------

#### 6. Registry problems

Check:

``` bash
npm config get registry
```

Expected public registry:

``` text
https://registry.npmjs.org/
```

If using a company registry, verify:

-   Registry URL.
-   Authentication.
-   Scope configuration.
-   Network/VPN.
-   Proxy configuration.

------------------------------------------------------------------------

#### 7. Network errors

Common errors include:

``` text
ETIMEDOUT
ECONNRESET
EAI_AGAIN
```

Possible causes:

-   Internet connectivity.
-   DNS.
-   Proxy.
-   VPN.
-   Corporate firewall.
-   Registry outage.

Do not immediately assume the package itself is broken.

------------------------------------------------------------------------

#### 8. "Works on my machine"

Check:

``` bash
node -v
npm -v
```

Then compare:

``` text
Node.js version
npm version
package.json
package-lock.json
OS
CPU architecture
environment variables
```

Use:

``` bash
npm ci
```

in CI to reduce environment-dependent dependency differences.

------------------------------------------------------------------------

### Performance and Dependency Hygiene

A good SDE-1 should not only know how to install packages but also
understand the cost of dependencies.

Consider:

-   Number of dependencies.
-   Package size.
-   Transitive dependency count.
-   Startup overhead.
-   Security exposure.
-   Maintenance status.
-   License compatibility.
-   Runtime vs build-time usage.

Before adding a dependency, ask:

``` text
Do I really need it?
Is the package maintained?
Is the API stable?
Is it secure?
Is the package size reasonable?
Can the functionality be implemented safely without another dependency?
```

Do not add a large library for a trivial utility unless the trade-off
makes sense.

------------------------------------------------------------------------

### Useful npm Commands

#### Project initialization

``` bash
npm init
npm init -y
```

#### Installation

``` bash
npm install
npm install <package>
npm install <package>@<version>
npm install -D <package>
npm install -g <package>
```

#### Removal

``` bash
npm uninstall <package>
```

#### Updates

``` bash
npm update
npm outdated
npm install <package>@latest
```

#### Inspection

``` bash
npm ls
npm ls <package>
npm explain <package>
npm view <package>
npm config list
npm config get registry
```

#### Scripts

``` bash
npm run <script>
npm start
npm test
```

#### Security

``` bash
npm audit
npm audit fix
```

#### Cache

``` bash
npm cache verify
npm cache clean --force
```

#### Package publishing

``` bash
npm login
npm pack --dry-run
npm publish
```

#### Versioning

``` bash
npm version patch
npm version minor
npm version major
```

#### Dependency graph

``` bash
npm ls
npm explain <package>
npm dedupe
```

### Practical Checklist

Before considering your npm fundamentals SDE-1 ready, you should be
comfortable with:

##### Package Management

-   [ ] `npm init`
-   [ ] `npm install`
-   [ ] `npm uninstall`
-   [ ] `npm update`
-   [ ] `npm outdated`
-   [ ] `npm ls`
-   [ ] `npm explain`

##### Dependency Management

-   [ ] `dependencies`
-   [ ] `devDependencies`
-   [ ] `peerDependencies`
-   [ ] `optionalDependencies`
-   [ ] Transitive dependencies
-   [ ] Dependency trees
-   [ ] Deduplication

##### Versioning

-   [ ] SemVer
-   [ ] Major/minor/patch
-   [ ] Caret ranges
-   [ ] Tilde ranges
-   [ ] Exact versions
-   [ ] Lockfiles

##### Project Configuration

-   [ ] `package.json`
-   [ ] `package-lock.json`
-   [ ] `.npmrc`
-   [ ] npm scripts
-   [ ] Workspaces
-   [ ] Environment variables

##### Node.js Integration

-   [ ] CommonJS
-   [ ] ESM
-   [ ] `type`
-   [ ] `main`
-   [ ] `exports`
-   [ ] Local binaries
-   [ ] npx

##### Production

-   [ ] `npm ci`
-   [ ] CI/CD dependency installation
-   [ ] Reproducible builds
-   [ ] Dependency auditing
-   [ ] Security practices
-   [ ] Registry configuration

##### Publishing

-   [ ] npm login
-   [ ] Package naming
-   [ ] Semantic versioning
-   [ ] `npm pack --dry-run`
-   [ ] `npm publish`
-   [ ] Package entry points
-   [ ] Public vs private packages

------------------------------------------------------------------------

### Mental Model

The most useful way to understand npm is to separate its
responsibilities:

``` text
                    ┌─────────────────────┐
                    │    npm Registry     │
                    │ Packages + Metadata │
                    └──────────┬──────────┘
                               │
                               │ resolve/download
                               ▼
┌──────────────────┐     ┌───────────────┐
│   package.json   │────▶│ npm Resolver  │
│ Desired ranges   │     │ Dependency     │
└──────────────────┘     │ graph         │
                         └───────┬───────┘
                                 │
                                 │ lock exact resolution
                                 ▼
                         ┌───────────────┐
                         │ package-lock  │
                         │ reproducible  │
                         │ resolution    │
                         └───────┬───────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │ node_modules  │
                         │ Installed     │
                         │ dependency    │
                         │ tree          │
                         └───────────────┘
```

If you understand this model, most npm behavior becomes easier to reason
about.

------------------------------------------------------------------------

### Final Takeaway

For an SDE-1, npm knowledge is not about memorizing commands.

You should understand the **system behind the commands**:

``` text
package.json
    ↓
version ranges
    ↓
dependency resolution
    ↓
package-lock.json
    ↓
node_modules
    ↓
local binaries / npm scripts
    ↓
application runtime
```

Then add the production concerns:

``` text
Security
   +
Reproducibility
   +
CI/CD
   +
Dependency hygiene
   +
Registry management
   +
Versioning
   +
Publishing
```

A developer who understands these concepts can:

-   Set up Node.js projects correctly.
-   Add and remove dependencies safely.
-   Diagnose dependency conflicts.
-   Understand lockfiles.
-   Build reproducible CI/CD pipelines.
-   Identify npm security risks.
-   Publish packages correctly.
-   Work effectively with monorepos and private registries.
-   Debug most common npm-related problems independently.

That is the practical npm foundation expected from an SDE-1 working with
Node.js-based applications.
