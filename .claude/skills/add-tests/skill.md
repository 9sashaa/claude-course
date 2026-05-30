---
name: add-tests
allowed-tools: Read, Edit, Write, Bash(find:*), Bash(cat:*), Bash(ls:*), Bash(npm test:*), Bash(npx jest:*)
description: Generate and write unit tests for a given source file
---

## Arguments

- `$FILE` — path to the source file to test (e.g. `frontend/src/features/auth/api/authApi.ts`)

Parse the file path from the skill invocation. If the path is missing, ask the user before proceeding.

## Context

- Project structure: !`ls`
- Existing test files near the target (if any): !`find . -name "*.test.*" -o -name "*.spec.*" | grep -v node_modules | head -20`

## Your task

1. **Read the target file** at `$FILE` to understand what it exports and how it works.

2. **Find the test framework** in use:
   - Check `package.json` for `jest`, `vitest`, `mocha`, or similar.
   - Look at any existing test file for import style and assertion patterns to match.

3. **Determine the test file path** using the same convention as the rest of the project:
   - If existing tests sit next to source files: place the new file next to `$FILE` (e.g. `authApi.test.ts`).
   - If tests live in a `__tests__/` directory: mirror the path there.

4. **Write tests** that cover:
   - The happy path for each exported function/class/component.
   - Key edge cases (empty input, null/undefined, boundary values).
   - Error paths (thrown exceptions, rejected promises, failed fetches).

5. **Save the test file** using the determined path.

6. **Run the tests** to confirm they pass:
   ```bash
   npx jest <test-file> --no-coverage
   ```
   If they fail, fix the tests before finishing.

**Rules:**
- Match the import style, assertion library, and mocking approach of existing tests in the project.
- Do not modify the source file — only add or edit the test file.
- Do not add comments that describe what the test does — the test name should be self-explanatory.
- After saving the file, report the test file path and the number of test cases added.