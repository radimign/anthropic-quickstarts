# Anthropic Quickstarts – Issue Backlog Proposal

**Milestone:** v0.2 Quickstart Polish (applies to all issues)

## Issue Overview (titles + why it matters)
1. README Quickstart overhaul – make onboarding reproducible and step-by-step for every quickstart.
2. Add `.env.example` and configuration validation – prevent misconfiguration and missing API keys.
3. Add streaming chat example – showcase streaming responses for responsive UX.
4. Structured JSON output example with validation/repair – demonstrate reliable structured generations.
5. Reusable prompt templates (system/user) – improve consistency and reuse across quickstarts.
6. Retry/backoff + error handling for 429/5xx – increase robustness against transient API failures.
7. Safe logging & DEBUG mode – aid troubleshooting without leaking secrets.
8. Unified CLI runner for examples – single entrypoint to run any quickstart locally.
9. Offline unit + smoke tests – guard core behaviors without live API calls.
10. GitHub Actions CI (lint + test + badge) – enforce quality gates with caching.

---

## Issue 01: README Quickstart overhaul
**Priority:** P1  
**Labels:** documentation, enhancement, dx, good first issue  
**Estimate:** M (covers multiple subfolders and tables)

- **Context / Why**: Current root README is high-level; newcomers lack a step-by-step quickstart across projects and a clear matrix of stacks/commands.
- **Scope**: Rewrite `README.md` to add a top-level quickstart guide (per quickstart), prerequisite matrix (Python/Node), single-command setup instructions, and cross-links. Include a small FAQ and troubleshooting for missing API keys and rate limits.
- **Out of scope**: Changing code, moving folders, or rewriting individual subproject READMEs.
- **Implementation notes**:
  - Update root `README.md` with: prerequisites table (Python/Node), "Run in 5 minutes" section with commands per quickstart (e.g., `python main.py`, `npm run dev`), and a troubleshooting block for common errors.
  - Add badges for CI and milestone once available.
  - Use concise English with one Czech note pointing to the Czech CLI sample.
- **Definition of Done**: README contains step-by-step quickstart, prerequisites matrix, commands for each quickstart, troubleshooting list, and links to sub-READMEs.
- **Acceptance test / How to verify**: Render README and confirm all commands map to existing scripts; check links resolve; ensure CI badge placeholder exists or will be updated in Issue 10.
- **Dependencies**: CI badge depends on Issue 10 output (can leave placeholder text).

## Issue 02: Add `.env.example` and configuration validation
**Priority:** P1  
**Labels:** documentation, security, dx, enhancement  
**Estimate:** M (touches Python + Node projects)

- **Context / Why**: Env vars are undocumented across projects; misconfigured API keys lead to runtime failures.
- **Scope**: Add `.env.example` files for each quickstart (`simple-cli-chat`, `financial-data-analyst`, `customer-support-agent`, `computer-use-demo`) and validation on startup to fail fast with helpful messages.
- **Out of scope**: Secret management services, storing real keys.
- **Implementation notes**:
  - For Python quickstarts (`simple-cli-chat`, `financial-data-analyst` if Python), add `.env.example` with `ANTHROPIC_API_KEY` and optional model settings; implement validation in entrypoints using `os.environ` checks and clear errors.
  - For Node/Next projects (`customer-support-agent`, any Node parts), add `.env.example` with `ANTHROPIC_API_KEY` and NEXT-specific vars; use runtime guard (e.g., in `config.ts` or API handler) throwing descriptive error when missing.
  - Document loading instructions in each README (e.g., `cp .env.example .env && export $(cat .env | xargs)`).
- **Definition of Done**: `.env.example` present in each quickstart; startup validation blocks execution when required vars absent; READMEs mention copying .env.
- **Acceptance test / How to verify**: Run each quickstart without `ANTHROPIC_API_KEY` and observe clear error; confirm `.env.example` lists required vars only (no secrets).
- **Dependencies**: None.

## Issue 03: Add streaming chat example
**Priority:** P1  
**Labels:** examples, enhancement, dx  
**Estimate:** M (new example + docs)

- **Context / Why**: Current examples show simple request/response; streaming demonstrates responsiveness and reduces latency perception.
- **Scope**: Add a streaming example (Python) under `simple-cli-chat` or new `examples/streaming.py`, with README section showing how to run; ensure it works with Anthropic streaming API.
- **Out of scope**: Browser streaming UI.
- **Implementation notes**:
  - Create `simple-cli-chat/streaming.py` using Anthropic Python SDK streaming generator; handle token deltas and graceful interrupt (Ctrl+C).
  - Update `simple-cli-chat/README.md` with a “Streaming mode” section and command (`python streaming.py`).
  - Add optional flag in unified CLI (Issue 08) to run streaming example.
- **Definition of Done**: Streaming script exists, prints partial tokens, handles errors gracefully, and documented command works.
- **Acceptance test / How to verify**: Run `python streaming.py` with valid API key; see streamed output without buffering entire response; keyboard interrupt exits cleanly.
- **Dependencies**: Unified CLI integration depends on Issue 08 (can be separate).

## Issue 04: Structured JSON output example with validation/repair
**Priority:** P1  
**Labels:** examples, enhancement, testing, dx  
**Estimate:** M (example + validator)

- **Context / Why**: Users need reliable structured outputs; current samples don't show schema validation or auto-repair for malformed JSON.
- **Scope**: Add example that requests JSON (e.g., FAQ extractor) and validates against a schema; attempt auto-repair when invalid.
- **Out of scope**: Full dataset ingestion or production-grade parsers.
- **Implementation notes**:
  - Add `examples/structured_output.py` (Python) using `pydantic` or `jsonschema` to validate the model response; on failure, retry with a corrective prompt including validation errors.
  - Include test-friendly path to bypass live API (mocked client, see Issue 09).
  - Document usage in root README and `examples/README.md` (create if needed) with a one-line command.
- **Definition of Done**: Example script validates JSON, retries with repair prompt on failure, and prints validated object; README documents schema and run command.
- **Acceptance test / How to verify**: Run script with API key and see parsed JSON; force invalid JSON (mock) and verify retry/repair path is exercised in tests.
- **Dependencies**: Mock hooks from Issue 09 can be reused.

## Issue 05: Reusable prompt templates (system/user)
**Priority:** P2  
**Labels:** enhancement, dx, documentation, refactor  
**Estimate:** M

- **Context / Why**: Prompts are embedded inline across scripts, making maintenance hard; reusable templates improve consistency.
- **Scope**: Introduce prompt template files and a small helper to load/format them for Python quickstarts; refactor one Node quickstart if feasible.
- **Out of scope**: Full templating engines or localization.
- **Implementation notes**:
  - Add `templates/` folder (per quickstart) with `system.txt` and `user.txt` examples; include variable placeholders for model, persona, etc.
  - Create Python helper (`agents/prompt_loader.py` or similar) to load/format templates; update `simple-cli-chat/main.py` to consume it.
  - For `customer-support-agent`, optionally move existing system prompt into a template file and import in code.
  - Document template usage in READMEs.
- **Definition of Done**: Templates exist, code loads them via helper, inline prompts removed where replaced, documentation updated.
- **Acceptance test / How to verify**: Run CLI and confirm prompts load from files; modify template text and see effect without code changes.
- **Dependencies**: None.

## Issue 06: Retry/backoff + error handling for 429/5xx
**Priority:** P1  
**Labels:** enhancement, dx, security  
**Estimate:** M

- **Context / Why**: Current calls lack resilience; rate limits or transient errors lead to failures.
- **Scope**: Add retry with exponential backoff and jitter around Anthropic client calls in Python and Node quickstarts; include max retry limit and structured error messages.
- **Out of scope**: Circuit breakers or distributed tracing.
- **Implementation notes**:
  - Introduce a small utility in Python (`agents/retry.py`) wrapping SDK calls with backoff (e.g., `tenacity` or manual); ensure retries respect 429/5xx only and log warnings.
  - For Node/Next quickstart, add similar helper (e.g., using `p-retry` or custom) around API handler functions.
  - Surface user-friendly messages in CLI/HTTP responses and ensure errors do not leak API keys.
- **Definition of Done**: Helpers exist and are used by main call sites; retries limited (e.g., 3 attempts) with jitter; errors logged once; docs mention behavior.
- **Acceptance test / How to verify**: Simulate 429 via mock client and observe retry attempts; ensure final failure message is user-friendly and secrets are not logged.
- **Dependencies**: Logging from Issue 07 can be reused.

## Issue 07: Safe logging & DEBUG mode
**Priority:** P2  
**Labels:** enhancement, dx, security  
**Estimate:** M

- **Context / Why**: Developers need visibility while avoiding secret leakage.
- **Scope**: Add logging configuration with INFO/DEBUG levels, redaction for secrets, and structured logs in Python and Node quickstarts; document a `DEBUG=1` toggle.
- **Out of scope**: External log aggregation services.
- **Implementation notes**:
  - Add `logging.py` helper for Python quickstarts configuring `logging` module with redaction filter for `ANTHROPIC_API_KEY` and pretty console output.
  - For Node, add a small logger (e.g., `pino` or console wrapper) with redaction and DEBUG toggle via env.
  - Update README to describe enabling DEBUG and sample output; ensure errors include correlation IDs if feasible.
- **Definition of Done**: Logging helpers in place, used in main entrypoints, DEBUG flag functional, secrets not printed.
- **Acceptance test / How to verify**: Run with `DEBUG=1` to see verbose logs without secrets; run without DEBUG to see concise logs; unit tests assert redaction.
- **Dependencies**: None (pairs well with Issue 06).

## Issue 08: Unified CLI runner for examples
**Priority:** P1  
**Labels:** dx, examples, enhancement  
**Estimate:** M

- **Context / Why**: Each quickstart has its own entrypoint; a unified CLI improves discoverability and onboarding.
- **Scope**: Add a Python-based CLI at repo root (e.g., `cli.py` using `typer` or `argparse`) that can run each quickstart (regular or streaming), print setup help, and validate env vars before dispatching.
- **Out of scope**: Packaging to PyPI or global install.
- **Implementation notes**:
  - Create `cli.py` with commands: `run simple-cli-chat`, `run streaming`, `run financial-data-analyst`, `run customer-support-agent` (invoke `npm run dev` or print instructions), and `list` to show options.
  - Reuse env validation (Issue 02) and logging (Issue 07); ensure Node commands are invoked via subprocess with clear messages if dependencies missing.
  - Document in root README with `python cli.py run simple-cli-chat` example.
- **Definition of Done**: CLI exists, dispatches to available quickstarts with helpful errors, includes help text, and documented commands work.
- **Acceptance test / How to verify**: Run `python cli.py --help`, run each command with/without env vars to see expected behavior; streaming option triggers Issue 03 script.
- **Dependencies**: Depends on Issue 02 (env validation) and Issue 03 (streaming command).

## Issue 09: Offline unit + smoke tests
**Priority:** P1  
**Labels:** testing, dx, examples, enhancement  
**Estimate:** M

- **Context / Why**: Repository lacks automated tests; offline tests ensure changes don't break examples without hitting the API.
- **Scope**: Add pytest (Python) and Vitest/Jest (Node) basic suites with mocked Anthropic clients; include smoke tests for CLI commands and structured output validator.
- **Out of scope**: Full integration tests against live API.
- **Implementation notes**:
  - Add `tests/` in Python quickstarts with fixtures mocking Anthropic client responses; cover streaming generator, retry helper, and prompt loader.
  - For `customer-support-agent`, add minimal test to ensure API handler formats request/response using mocks.
  - Configure `pyproject.toml` or per-project configs for pytest markers and Node test runner; add `npm test` or `pnpm test` script if missing.
- **Definition of Done**: Test suites exist and pass offline; CI (Issue 10) runs them; documentation lists how to run tests.
- **Acceptance test / How to verify**: Run `pytest` in Python projects and `npm test` in Node project and see all tests pass without network.
- **Dependencies**: Relies on mockable code paths from Issues 03–07; feeds into Issue 10.

## Issue 10: GitHub Actions CI (lint + test + badge)
**Priority:** P0  
**Labels:** ci, testing, dx  
**Estimate:** M

- **Context / Why**: No CI pipeline to enforce lint/tests; contributors need quick feedback and README badge.
- **Scope**: Add GitHub Actions workflow running lint and tests for Python and Node quickstarts with caching; publish status badge to README.
- **Out of scope**: Deployment or release automation.
- **Implementation notes**:
  - Create `.github/workflows/ci.yml` that runs on PR + main: Python job (set up 3.10+, install deps per quickstart with caching, run pytest/ruff if added), Node job (install with npm/pnpm, run lint/test for `customer-support-agent`).
  - Use matrix to avoid redundant installs; ensure jobs skip subprojects without package manager lockfile.
  - Add badge to root README pointing to workflow.
- **Definition of Done**: Workflow runs lint/tests on main/PRs with caching; badge visible in README; failing tests block merges.
- **Acceptance test / How to verify**: Trigger workflow in PR; confirm both jobs execute and badge URL resolves; local `act` run optional.
- **Dependencies**: Tests from Issue 09 and README badge placeholder from Issue 01.

---

# Issue Template Proposals (.github/ISSUE_TEMPLATE)

## bug_report.yml
```yaml
name: "Bug report"
description: "Report a bug in Anthropic Quickstarts"
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: "Thanks for helping us improve the quickstarts!"
  - type: input
    id: summary
    attributes:
      label: "Summary"
      description: "Clear, concise description of the bug"
      placeholder: "Streaming output stops after first token"
    validations:
      required: true
  - type: textarea
    id: steps
    attributes:
      label: "Steps to reproduce"
      description: "List exact steps and commands"
      placeholder: "1. cd simple-cli-chat\n2. python streaming.py\n3. ..."
    validations:
      required: true
  - type: input
    id: expected
    attributes:
      label: "Expected behavior"
    validations:
      required: true
  - type: input
    id: actual
    attributes:
      label: "Actual behavior"
    validations:
      required: true
  - type: dropdown
    id: area
    attributes:
      label: "Area"
      options:
        - simple-cli-chat
        - customer-support-agent
        - financial-data-analyst
        - computer-use-demo
        - other
    validations:
      required: true
  - type: input
    id: env
    attributes:
      label: "Environment"
      placeholder: "macOS 14, Python 3.10, Node 18"
  - type: textarea
    id: logs
    attributes:
      label: "Logs / Screenshots"
      description: "Attach sanitized logs (no secrets)"
  - type: checkboxes
    id: checklist
    attributes:
      label: "Checklist"
      options:
        - label: "I have removed/obscured any secrets from logs"
          required: true
        - label: "I have searched existing issues"
          required: true
```

## feature_request.yml
```yaml
name: "Feature request"
description: "Suggest an enhancement or new example"
labels: ["enhancement"]
body:
  - type: input
    id: summary
    attributes:
      label: "Summary"
      placeholder: "Add Kotlin quickstart"
    validations:
      required: true
  - type: textarea
    id: motivation
    attributes:
      label: "Motivation"
      description: "Why is this useful?"
    validations:
      required: true
  - type: textarea
    id: proposal
    attributes:
      label: "Proposed solution"
      description: "Outline the approach, files, and commands"
    validations:
      required: true
  - type: dropdown
    id: area
    attributes:
      label: "Area"
      options:
        - simple-cli-chat
        - customer-support-agent
        - financial-data-analyst
        - computer-use-demo
        - docs
        - other
  - type: checkboxes
    id: checklist
    attributes:
      label: "Checklist"
      options:
        - label: "I have searched existing issues"
          required: true
```

## task.yml (preferred template)
```yaml
name: "Task"
description: "Actionable task for the quickstarts"
labels: ["dx"]
body:
  - type: input
    id: summary
    attributes:
      label: "Summary"
      placeholder: "Add retry helper for Anthropic SDK"
    validations:
      required: true
  - type: textarea
    id: context
    attributes:
      label: "Context / Why"
      description: "Business/user value and background"
    validations:
      required: true
  - type: textarea
    id: scope
    attributes:
      label: "Scope"
      description: "What is in scope"
    validations:
      required: true
  - type: textarea
    id: out_of_scope
    attributes:
      label: "Out of scope"
      description: "What is explicitly excluded"
  - type: textarea
    id: implementation
    attributes:
      label: "Implementation notes"
      description: "Key steps, files, commands"
    validations:
      required: true
  - type: textarea
    id: dod
    attributes:
      label: "Definition of Done"
      description: "Measurable acceptance criteria"
    validations:
      required: true
  - type: textarea
    id: testing
    attributes:
      label: "Testing plan"
      description: "How to verify (commands, tools)"
    validations:
      required: true
  - type: input
    id: dependencies
    attributes:
      label: "Dependencies"
      placeholder: "Issue #123, PR #456"
  - type: dropdown
    id: priority
    attributes:
      label: "Priority"
      options:
        - P0
        - P1
        - P2
    validations:
      required: true
```

## config.yml (contact links)
```yaml
contact_links:
  - name: Anthropic Support
    url: https://support.anthropic.com
    about: Official Anthropic support documentation and contact
  - name: Discord Community
    url: https://www.anthropic.com/discord
    about: Join the community for Q&A and help
```
