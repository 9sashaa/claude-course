---
name: standup
allowed-tools: Bash(git log:*), Bash(git diff:*), Bash(git show:*), Bash(git branch:*)
description: Generate a detailed standup report based on yesterday's git activity
---

## Context

- Today's date: !`date +%Y-%m-%d`
- Current branch: !`git branch --show-current`
- Yesterday's commits (all branches): !`git log --all --since=yesterday.midnight --until=today.midnight --oneline --date=short`
- Yesterday's commits with stats: !`git log --all --since=yesterday.midnight --until=today.midnight --stat --date=short`
- Yesterday's commits full diff: !`git log --all --since=yesterday.midnight --until=today.midnight --patch --date=short`

## Your task

Based on the git activity above, generate a **standup report in Russian** covering what was done yesterday.

Structure the report as follows:

```
## Стендап — <дата вчера>

### Что было сделано:
- <детальное описание задачи 1>
- <детальное описание задачи 2>
...

### Технические детали:
- <какие файлы/модули были изменены и зачем>
- <какие проблемы были решены>
- <какие решения были приняты>

### Коммиты:
- `<hash>` — <описание>
```

**Rules:**
- If there are no commits from yesterday, say so clearly and suggest checking the date range.
- Group related commits into logical tasks — don't list each commit separately in "Что было сделано".
- Be specific about what changed and why, not just file names.
- Technical details should explain the "why" behind the changes, not just "what".
- Keep the tone professional, suitable for a team standup meeting.
- Respond only with the report, no additional commentary.
