---
name: create-pr
allowed-tools: Bash(git log:*), Bash(git diff:*), Bash(git branch:*), Bash(git push:*), Bash(gh pr create:*), Bash(gh pr list:*)
description: Create a GitHub Pull Request with a given title and branch name
---

## Arguments

- `$BRANCH` — source branch to open PR from (e.g. `feat/dashboard-screen`)
- `$TITLE` — PR title following Conventional Commits: `type(scope): description` (e.g. `feat(auth): add login form`)

Parse arguments from the skill invocation: first argument is the branch name, second argument is the PR title. If either is missing, ask the user before proceeding.

## Context

- Current branch: !`git branch --show-current`
- All local branches: !`git branch`
- Commits ahead of main: !`git log origin/master..HEAD --oneline`
- Diff vs main: !`git diff origin/master...HEAD --stat`

## Your task

1. **Push the branch** to origin if it hasn't been pushed yet:
   ```
   git push -u origin <branch>
   ```

2. **Collect the diff** between the branch and `master` to understand what changed:
   - Read the commit log and diff stat to summarise changes for the PR body.

3. **Create the PR** using `gh pr create` with the body template below. Use a HEREDOC to pass the body.

### PR body template

```
## What & Why
<1-3 sentences: what problem this solves and why now>

## Changes
- <bullet: what was added/changed, focus on behaviour not files>

## API endpoints consumed / added
| Method | Path | Description |
| ------ | ---- | ----------- |
| ...    | ...  | ...         |

## Test plan
- [ ] Golden path works end-to-end
- [ ] Edge cases verified
- [ ] No regressions in existing features

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

Fill in the body based on the actual diff. If there are no API changes, remove that table.

### gh command to run

```bash
gh pr create \
  --base master \
  --head <branch> \
  --title "<title>" \
  --body "$(cat <<'EOF'
<filled body>
EOF
)"
```

**Rules:**
- Do not push to `master` directly — always use the provided branch.
- PR title must follow Conventional Commits format from CLAUDE.md.
- After creating the PR, output the PR URL so the user can open it.
- If the branch does not exist locally or remotely, tell the user and stop.