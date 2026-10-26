# Git & GitHub

A practical guide to everything an entry-level software engineer needs to know about Git and GitHub: concepts, commands, workflows, and the mistakes to avoid.

#### 1. Git vs GitHub

| | **Git** | **GitHub** |
|---|---|---|
| What | Distributed version control system (VCS) | Cloud platform that hosts Git repositories |
| Runs | Locally on your machine | On the web |
| Does | Tracks changes, branches, merges | Collaboration: pull requests, issues, code review, CI/CD |
| Alternatives | None really (Mercurial, SVN are legacy) | GitLab, Bitbucket |

**Why Git?** Full history, safe experimentation via branches, offline work, and painless collaboration.

---

#### 2. Installation & Setup

```bash
# Install
sudo apt install git          # Debian/Ubuntu
brew install git              # macOS
winget install Git.Git        # Windows

git --version                 # Verify
```

##### One-time configuration

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"     # VS Code as editor
git config --global pull.rebase false             # merge on pull (or true for rebase)

git config --list                                 # View all settings
git config user.name                              # View a single value
```

Config levels: `--system` (all users) → `--global` (your user) → `--local` (this repo only; default).

##### SSH authentication with GitHub (recommended)

```bash
ssh-keygen -t ed25519 -C "you@example.com"        # Generate key
eval "$(ssh-agent -s)" && ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub                         # Copy → GitHub → Settings → SSH and GPG keys
ssh -T git@github.com                             # Test connection
```

> Alternative: HTTPS with a **Personal Access Token (PAT)**. GitHub no longer accepts account passwords for Git operations.

---

#### 3. Core Concepts

##### The three areas

```
Working Directory  ──git add──▶  Staging Area (Index)  ──git commit──▶  Local Repository  ──git push──▶  Remote (GitHub)
   (your files)                   (what goes in next commit)           (.git history)
```

##### Key terms

| Term | Meaning |
|---|---|
| **Repository (repo)** | Project folder tracked by Git (contains a hidden `.git/` directory) |
| **Commit** | Snapshot of staged changes with a unique SHA-1 hash, author, timestamp, message |
| **Branch** | A lightweight, movable pointer to a commit |
| **HEAD** | Pointer to your current commit/branch |
| **Remote** | A hosted copy of the repo (conventionally named `origin`) |
| **Upstream** | The remote branch your local branch tracks |
| **Origin** | Default name for the remote you cloned from |
| **Fork** | Your own server-side copy of someone else's repo |
| **Detached HEAD** | HEAD points to a commit directly, not a branch |

##### File states

`Untracked` → `Staged` → `Committed` → `Modified` → `Staged` → ...

---

#### 4. Starting a Repository

```bash
git init                                   # Create a new repo in current folder
git init my-project                        # Create in a new folder

git clone <url>                            # Copy a remote repo locally
git clone <url> my-folder                  # Clone into a named folder
git clone --depth 1 <url>                  # Shallow clone (latest commit only; fast)
git clone -b <branch> <url>                # Clone a specific branch
```

---

#### 5. Daily Workflow: Stage, Commit, Inspect

##### Check status and differences

```bash
git status                       # Current state of working dir and staging area
git status -s                    # Short format
git diff                         # Unstaged changes
git diff --staged                # Staged changes (what will be committed)
git diff main..feature           # Compare two branches
git diff <commit1> <commit2>     # Compare two commits
```

##### Stage changes

```bash
git add file.txt                 # Stage a file
git add src/                     # Stage a directory
git add .                        # Stage everything in current directory
git add -p                       # Interactively stage chunks (hunks); great for clean commits
git rm file.txt                  # Delete file and stage the deletion
git rm --cached file.txt         # Untrack file but keep it on disk
git mv old.txt new.txt           # Rename/move and stage
```

##### Commit

```bash
git commit -m "Add login validation"          # Commit with message
git commit -am "Fix typo"                     # Stage tracked files + commit (skips new files)
git commit --amend -m "Better message"        # Rewrite the last commit message
git commit --amend --no-edit                  # Add staged changes to the last commit
```

##### View history

```bash
git log                                       # Full history
git log --oneline                             # One line per commit
git log --oneline --graph --all --decorate    # Visual branch graph
git log -n 5                                  # Last 5 commits
git log --author="Name"                       # Filter by author
git log --since="2 weeks ago"                 # Filter by date
git log -p file.txt                           # History with diffs for one file
git log --grep="bug"                          # Search commit messages
git show <commit>                             # Details and diff of one commit
git blame file.txt                            # Who last changed each line
```

---

#### 6. Branching

Branches let you work on features or fixes in isolation without touching `main`.

```bash
git branch                          # List local branches (* = current)
git branch -a                       # List local and remote branches
git branch -vv                      # Show tracking info and last commit
git branch feature/login            # Create branch
git switch feature/login            # Switch to branch (modern)
git switch -c feature/login         # Create and switch
git checkout feature/login          # Switch (older equivalent)
git checkout -b feature/login       # Create and switch (older equivalent)
git branch -m new-name              # Rename current branch
git branch -d feature/login         # Delete (only if merged)
git branch -D feature/login         # Force delete
git push origin --delete feature/login   # Delete remote branch
```

---

#### 7. Merging & Rebasing

Both integrate changes from one branch into another, differently.

##### Merge

```bash
git switch main
git merge feature/login             # Merge feature into main
git merge --no-ff feature/login     # Always create a merge commit
git merge --squash feature/login    # Combine all commits into one staged change
git merge --abort                   # Cancel an in-progress merge
```

- **Fast-forward**: main hasn't moved, so Git just advances the pointer (no merge commit).
- **Three-way merge**: both branches diverged, so Git creates a merge commit.

##### Rebase

Replays your commits on top of another branch for a **linear history**.

```bash
git switch feature/login
git rebase main                     # Replay feature commits on top of latest main
git rebase --continue               # After resolving conflicts
git rebase --abort                  # Cancel rebase
git rebase -i HEAD~3                # Interactive: squash, reword, reorder, drop last 3 commits
```

Interactive rebase keywords: `pick`, `reword`, `edit`, `squash`, `fixup`, `drop`.

##### Merge vs Rebase

| | Merge | Rebase |
|---|---|---|
| History | Preserves true history (non-linear) | Linear, cleaner |
| Safety | Non-destructive | Rewrites commits (new hashes) |
| Use for | Integrating into shared branches | Cleaning up your own local/feature branch |

> **Golden rule:** Never rebase commits that have been pushed to a shared branch.

---

#### 8. Resolving Merge Conflicts

Conflicts occur when two branches edit the same lines.

```
<<<<<<< HEAD
your current branch's version
=======
incoming branch's version
>>>>>>> feature/login
```

**Steps:**

```bash
git status                          # See conflicted files ("both modified")
# 1. Open the files, choose/combine the correct code, delete the markers
git add <resolved-file>             # 2. Mark as resolved
git commit                          # 3. Complete the merge (or: git rebase --continue)
```

```bash
git checkout --ours file.txt        # Take your version
git checkout --theirs file.txt      # Take the incoming version
git mergetool                       # Launch a configured merge tool
```

---

#### 9. Working with Remotes

```bash
git remote -v                                   # List remotes
git remote add origin <url>                     # Add a remote
git remote set-url origin <new-url>             # Change remote URL
git remote remove origin                        # Remove a remote

git fetch                                       # Download changes, don't merge
git fetch --prune                               # Also remove stale remote-tracking branches
git pull                                        # fetch + merge (or rebase) into current branch
git pull --rebase                               # fetch + rebase
git push origin main                            # Push branch
git push -u origin feature/login                # Push and set upstream (first push)
git push                                        # Push to the tracked upstream
git push --force-with-lease                     # Safer force push (fails if remote changed)
```

##### Fork workflow (open source)

```bash
git remote add upstream <original-repo-url>     # Link the original repo
git fetch upstream
git switch main
git merge upstream/main                         # Sync your fork with the original
git push origin main
```

> Prefer `--force-with-lease` over `--force`. Never force-push to `main`.

---

#### 10. Undoing Things

Choose the right tool depending on **what** you want to undo.

| Situation | Command |
|---|---|
| Discard unstaged changes in a file | `git restore file.txt` |
| Unstage a file (keep changes) | `git restore --staged file.txt` |
| Fix the last commit message | `git commit --amend` |
| Undo last commit, keep changes staged | `git reset --soft HEAD~1` |
| Undo last commit, keep changes unstaged | `git reset --mixed HEAD~1` *(default)* |
| Undo last commit, **discard** changes | `git reset --hard HEAD~1` ⚠️ |
| Undo a **pushed** commit safely | `git revert <commit>` |
| Remove untracked files | `git clean -fd` ⚠️ (preview first with `-n`) |

##### Reset vs Revert

- **`git reset`** moves the branch pointer back, **rewriting history**. Use only on local, unpushed commits.
- **`git revert`** creates a **new commit** that reverses an earlier one. Safe for shared branches.

```bash
git revert <commit>                 # Undo a commit with a new commit
git revert -m 1 <merge-commit>      # Revert a merge commit
git reset --hard origin/main        # Make local branch match remote exactly ⚠️
```

##### Recover "lost" work

```bash
git reflog                          # History of where HEAD has been (even after reset)
git reset --hard <hash-from-reflog> # Restore to that state
```

> Reflog is your safety net. Commits are rarely truly gone (typically retained ~90 days).

---

#### 11. Stash

Temporarily shelve uncommitted changes to switch context.

```bash
git stash                           # Stash tracked changes
git stash -u                        # Include untracked files
git stash push -m "wip: login form" # Stash with a message
git stash list                      # View all stashes
git stash show -p stash@{0}         # View stash contents
git stash pop                       # Apply latest stash and remove it
git stash apply stash@{1}           # Apply a stash and keep it
git stash drop stash@{0}            # Delete a stash
git stash clear                     # Delete all stashes
git stash branch new-branch         # Create a branch from a stash
```

---

#### 12. Tags & Releases

Tags mark specific commits, usually release versions (use [Semantic Versioning](https://semver.org): `MAJOR.MINOR.PATCH`).

```bash
git tag                             # List tags
git tag v1.0.0                      # Lightweight tag
git tag -a v1.0.0 -m "Release 1.0"  # Annotated tag (recommended)
git tag -a v0.9.0 <commit>          # Tag an older commit
git push origin v1.0.0              # Push one tag
git push origin --tags              # Push all tags
git tag -d v1.0.0                   # Delete local tag
git push origin --delete v1.0.0     # Delete remote tag
git checkout v1.0.0                 # Inspect code at a tag (detached HEAD)
```

---

#### 13. Advanced Tools

##### Cherry-pick: apply a specific commit to the current branch

```bash
git cherry-pick <commit>
git cherry-pick A..B                # A range of commits (A exclusive)
git cherry-pick --abort
```

##### Bisect: binary search to find the commit that introduced a bug

```bash
git bisect start
git bisect bad                      # Current commit is broken
git bisect good <known-good-commit>
# Git checks out midpoints; test, then mark `good` or `bad` until found
git bisect reset                    # Exit bisect
```

##### Worktrees: multiple branches checked out in separate folders

```bash
git worktree add ../hotfix hotfix-branch
git worktree list
git worktree remove ../hotfix
```

##### Submodules: embed another repo inside yours

```bash
git submodule add <url> path/
git submodule update --init --recursive
```

##### Hooks: scripts that run on Git events

Located in `.git/hooks/` (e.g., `pre-commit`, `commit-msg`, `pre-push`). Share them via tools like **Husky** or **pre-commit**.

##### Aliases: save keystrokes

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.lg "log --oneline --graph --all --decorate"
```

##### Searching

```bash
git grep "TODO"                     # Search tracked files
git log -S "functionName"           # Find commits that added/removed a string
```

---

#### 14. .gitignore

Tells Git which files to **not** track (build output, secrets, dependencies, OS/IDE files).

```gitignore
# Dependencies
node_modules/
venv/

# Build output
dist/
build/
*.log

# Secrets & environment
.env
*.pem

# OS / IDE
.DS_Store
.vscode/
.idea/

# Negation: keep this file despite the rule above
!important.log
```

**Notes:**
- `.gitignore` only affects **untracked** files. If a file is already tracked: `git rm --cached <file>`.
- Global ignore: `git config --global core.excludesfile ~/.gitignore_global`
- Generate templates at [gitignore.io](https://www.toptal.com/developers/gitignore) or from GitHub's `gitignore` repo.
- **Never commit secrets.** If you do, rotate the credential immediately; deleting the file later doesn't remove it from history.

---

#### 15. GitHub Essentials

| Feature | Purpose |
|---|---|
| **Repository** | Public/private home of the code |
| **README.md** | Project landing page: what, why, how to run |
| **Issues** | Track bugs, tasks, feature requests (labels, assignees, milestones) |
| **Pull Requests (PRs)** | Propose changes, discuss, review, merge |
| **Projects** | Kanban/roadmap boards |
| **Actions** | CI/CD automation |
| **Releases** | Packaged versions tied to tags |
| **Discussions** | Q&A and community conversations |
| **Wiki** | Extra documentation |
| **Security** | Dependabot alerts, secret scanning, code scanning |

##### Useful repo files

- `README.md`: overview, setup, usage
- `LICENSE`: terms of use (MIT, Apache-2.0, GPL...)
- `CONTRIBUTING.md`: how to contribute
- `CODE_OF_CONDUCT.md`: community standards
- `CODEOWNERS`: auto-assigns reviewers by file path
- `.github/PULL_REQUEST_TEMPLATE.md` and `.github/ISSUE_TEMPLATE/`

##### Linking issues and PRs

In a PR description or commit message, these keywords auto-close an issue on merge:
`Closes #42`, `Fixes #42`, `Resolves #42`

##### Branch protection (Settings → Branches)

Typical rules for `main`: require PR + approvals, require passing status checks, require up-to-date branches, block force pushes, require signed commits.

##### GitHub CLI (`gh`)

```bash
gh auth login
gh repo clone owner/repo
gh repo create my-repo --public --clone
gh issue list
gh issue create --title "Bug" --body "Details"
gh pr create --fill                 # Open a PR from current branch
gh pr list
gh pr checkout 123                  # Check out someone's PR locally
gh pr review 123 --approve
gh pr merge 123 --squash
gh run list                         # View Actions runs
gh run watch
```

---

#### 16. Pull Request Workflow

The standard flow on a team:

```bash
# 1. Sync and branch
git switch main
git pull
git switch -c feature/add-search

# 2. Work and commit in small logical chunks
git add -p
git commit -m "feat(search): add search endpoint"

# 3. Stay current with main
git fetch origin
git rebase origin/main              # or: git merge origin/main

# 4. Push and open a PR
git push -u origin feature/add-search
gh pr create --fill                 # or use the GitHub UI

# 5. Address review feedback: commit and push again (PR updates automatically)
# 6. After approval + green CI → merge → delete the branch
git switch main && git pull
git branch -d feature/add-search
```

##### Merge options on GitHub

| Option | Result | Best for |
|---|---|---|
| **Create a merge commit** | Preserves all commits + merge commit | Keeping full history |
| **Squash and merge** | All commits collapse into one | Clean `main`, messy feature branches |
| **Rebase and merge** | Commits replayed linearly, no merge commit | Linear history with meaningful commits |

##### Writing a good PR

- Small and focused: ideally under ~400 lines changed
- Descriptive title; explain **what** and **why**; link the issue
- Include screenshots/test notes where relevant
- Self-review your diff before requesting review
- Use **Draft PR** for work in progress

##### Reviewing code

- Be specific, kind, and constructive; ask questions rather than demand changes
- Check correctness, readability, edge cases, tests, security, performance
- Use **Approve**, **Request changes**, or **Comment** appropriately
- Prefix nitpicks with `nit:` so they're clearly optional

---

#### 17. GitHub Actions (CI/CD)

Automate tests, builds, and deployments. Workflows are YAML files in `.github/workflows/`.

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
```

**Vocabulary:** *workflow* → *job* → *step*; *runner* (machine that executes jobs); *action* (reusable step); *event* (trigger); *secret* (encrypted variable, referenced as `${{ secrets.MY_SECRET }}`).

Store sensitive values in **Settings → Secrets and variables → Actions**, never in code.

---

#### 18. Branching Strategies

| Strategy | Description | Best for |
|---|---|---|
| **GitHub Flow** | `main` is always deployable; short-lived feature branches → PR → merge | Most web teams, continuous delivery |
| **Trunk-Based Development** | Tiny commits to `main`/short branches; feature flags | High-velocity teams with strong CI |
| **Git Flow** | `main`, `develop`, `feature/*`, `release/*`, `hotfix/*` | Scheduled releases, versioned software |

##### Branch naming

```
feature/user-authentication
bugfix/null-pointer-checkout
hotfix/payment-timeout
chore/update-dependencies
docs/api-readme
```

---

#### 19. Commit Message Conventions

A commit message tells future readers **why** a change was made.

**Structure:**

```
<type>(<scope>): <short summary in imperative mood, ≤ 50 chars>

<optional body: what and why, wrapped at 72 chars>

<optional footer: Closes #123 / BREAKING CHANGE: ...>
```

**[Conventional Commits](https://www.conventionalcommits.org) types:**

| Type | Use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting (no logic change) |
| `refactor` | Restructure without behavior change |
| `test` | Add/modify tests |
| `chore` | Tooling, dependencies, config |
| `perf` | Performance improvement |
| `ci` | CI configuration |

**Examples:**

```
feat(auth): add Google OAuth login
fix(cart): prevent negative quantity on update
docs: add setup instructions to README
```

✅ "Add retry logic to payment client"
❌ "fixed stuff", "changes", "wip", "asdf"

---

#### 20. Best Practices & Common Pitfalls

##### Do

- Commit **small, atomic, logical** changes
- Pull/rebase from `main` often to avoid giant conflicts
- Write meaningful commit messages and PR descriptions
- Use feature branches; never commit directly to `main`
- Review `git status` and `git diff --staged` before every commit
- Delete merged branches
- Use `.gitignore` from day one
- Run tests/linters locally (pre-commit hooks) before pushing
- Sign commits where required (`git config --global commit.gpgsign true`)

##### Don't

- ❌ Commit secrets, API keys, `.env`, or large binaries
- ❌ Force-push to shared branches
- ❌ Rebase already-pushed shared history
- ❌ Use `git add .` blindly (check what you're staging)
- ❌ Mix unrelated changes in one commit/PR
- ❌ Leave PRs open for weeks without updates
- ❌ Panic: almost everything is recoverable (`git reflog`)

##### Large files

Use **Git LFS** for large binaries (images, datasets, models):

```bash
git lfs install
git lfs track "*.psd"
git add .gitattributes
```

---

#### 21. Troubleshooting Scenarios

**Committed to the wrong branch**
```bash
git switch correct-branch
git cherry-pick <commit>
git switch wrong-branch
git reset --hard HEAD~1            # Remove it from the wrong branch (if unpushed)
```

**Need to change the last commit (not yet pushed)**
```bash
git add forgotten-file.txt
git commit --amend --no-edit
```

**`git push` rejected (non-fast-forward)**
```bash
git pull --rebase                   # Integrate remote changes, then
git push
```

**Accidentally committed a secret**
1. **Rotate/revoke the secret immediately.**
2. Remove it from history with `git filter-repo` (or BFG Repo-Cleaner).
3. Force-push and notify collaborators.

**Detached HEAD: want to keep your work**
```bash
git switch -c rescue-branch
```

**Want to undo a merge that's already pushed**
```bash
git revert -m 1 <merge-commit>
```

**Local branch is a mess; reset to remote**
```bash
git fetch origin
git reset --hard origin/<branch>    # ⚠️ discards local changes and commits
```

**Remove a file from Git but keep it locally**
```bash
git rm --cached secret.txt && echo "secret.txt" >> .gitignore
```

**Find which commit broke something**
```bash
git bisect start && git bisect bad && git bisect good <hash>
```

**Fix an author name/email on the last commit**
```bash
git commit --amend --author="Name <email@example.com>" --no-edit
```

**Line-ending problems (Windows/Linux)**
```bash
git config --global core.autocrlf true    # Windows
git config --global core.autocrlf input   # macOS/Linux
```
---

#### 22. Quick Cheat Sheet
```bash
# SETUP
git config --global user.name "Name"        git config --global user.email "e@x.com"
git init                                    git clone <url>

# DAILY
git status                                  git diff / git diff --staged
git add <file> | -p | .                     git commit -m "msg"
git log --oneline --graph --all             git show <commit>

# BRANCH
git switch -c <name>                        git switch <name>
git branch -d <name>                        git merge <branch>
git rebase <branch>                         git rebase -i HEAD~N

# REMOTE
git remote -v                               git fetch / git pull / git pull --rebase
git push -u origin <branch>                 git push --force-with-lease

# UNDO
git restore <file>                          git restore --staged <file>
git commit --amend                          git reset --soft|--mixed|--hard HEAD~1
git revert <commit>                         git reflog

# STASH / TAG / PICK
git stash | pop | list                      git tag -a v1.0.0 -m "msg"
git cherry-pick <commit>                    git bisect start|good|bad|reset

# GITHUB CLI
gh pr create --fill                         gh pr checkout <n>
gh pr merge <n> --squash                    gh issue create
```
---

#### Further Learning

- [Pro Git Book](https://git-scm.com/book): free, official, comprehensive
- [Learn Git Branching](https://learngitbranching.js.org): interactive visual tutorial
- [GitHub Docs](https://docs.github.com)
- [Oh Shit, Git!?!](https://ohshitgit.com): recovering from mistakes
- `git help <command>` or `git <command> --help`: built-in docs

---

> **Remember:** Commit early, commit often, write clear messages, and never be afraid of Git: `git reflog` has your back.