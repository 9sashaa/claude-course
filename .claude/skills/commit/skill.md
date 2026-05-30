---
name: commit
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*), Bash(git log:*), Bash(git branch:*)
description: Create a git commit following the project's Conventional Commits convention
---

## Context

- Current branch: !`git branch --show-current`
- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Recent commits: !`git log --oneline -10`

## Commit convention

This project uses **Conventional Commits**: `<type>(<scope>): <description>`

| Type | When to use |
| --- | --- |
| `feat` | New feature or endpoint |
| `fix` | Bug fix |
| `refactor` | Refactoring without behaviour change |
| `chore` | Tooling, deps, config, migrations |
| `docs` | Documentation only |
| `test` | Adding or fixing tests |

**Rules:**
- Scope is optional but recommended for cross-cutting changes: `feat(auth):`, `fix(transactions):`.
- Description in lowercase, imperative mood, no period: `feat: add transaction summary endpoint`.
- One logical change per commit — don't mix features and fixes.
- Group related files into one commit (e.g. schema + migration + module handler = one `feat` commit).

## Branching rules

- Never commit directly to `main` — all work goes in feature branches.
- Branch naming mirrors the commit type: `feat/`, `fix/`, `refactor/`, `chore/`.

## Your task

Based on the above changes, create a single git commit following the Conventional Commits convention above.

Stage all relevant changed files and create the commit with a properly formatted message. Do not push, do not open a PR. Do not send any other text or messages besides the tool calls.