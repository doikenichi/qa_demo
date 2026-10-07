#!/usr/bin/env node
/**
 * promptfoo `exec:` provider that answers a prompt through the Claude Code CLI,
 * authenticated by CLAUDE_CODE_OAUTH_TOKEN rather than an Anthropic API key.
 *
 * Why this exists: the eval suites must load the committed skill file as the
 * model's system prompt, so that editing or deleting `.claude/skills/<skill>.md`
 * changes the eval result. An eval that inlines its own copy of the skill text
 * measures that copy, not the artifact, and cannot satisfy NFR-012 item 1.
 *
 * Three flags are load-bearing for the withheld-skill proof, not optional tuning:
 *
 *   --safe-mode   Claude Code otherwise auto-discovers CLAUDE.md, `.claude/skills/`,
 *                 agents and plugins from the working directory. In a withheld run
 *                 that would silently reload the very skill being withheld.
 *                 (`--bare` disables the same discovery but also breaks credential
 *                 loading — it answers "Not logged in" — so it cannot be used here.)
 *   --restricted  Intended for exactly this case: an evaluation harness driving
 *                 `claude`. Reads only managed settings, so a developer's personal
 *                 settings cannot change an eval result.
 *   --tools ""    With tools available the model could simply read the skill file
 *                 off disk and answer correctly without it in context, which would
 *                 also defeat the withheld run.
 *
 * Remove any of them and the proof is invalid however the assertions are written.
 *
 * promptfoo calls this as: node claude-provider.mjs <prompt> <optionsJSON> <contextJSON>
 * `options.config.systemPromptFile` names the file used as the system prompt, written
 * relative to the repository root.
 *
 * promptfoo runs the command with the working directory set to the *config's* directory
 * (`.claude/evals/<skill>/`), not the repository root, so every path here is resolved
 * against this script's own location instead of against cwd.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// .claude/evals/claude-provider.mjs -> repository root
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

const [prompt, optionsJson] = process.argv.slice(2);

const die = (msg) => {
  process.stderr.write(`claude-provider: ${msg}\n`);
  process.exit(1);
};

if (!prompt) die('no prompt was passed as the first argument');

let options = {};
if (optionsJson) {
  try {
    options = JSON.parse(optionsJson);
  } catch {
    die('the options argument was not valid JSON');
  }
}

const systemPromptRelative = options?.config?.systemPromptFile;
if (!systemPromptRelative) {
  die('options.config.systemPromptFile is required — it names the artifact under test');
}
const systemPromptFile = resolve(repoRoot, systemPromptRelative);
if (!existsSync(systemPromptFile)) {
  // A missing skill file must fail loudly. This is the signal that the suite is
  // bound to the artifact: delete the skill and its eval stops passing.
  die(`system prompt file not found: ${systemPromptRelative} (resolved to ${systemPromptFile})`);
}

const model = options?.config?.model ?? 'claude-sonnet-5-5';

const args = [
  '-p', prompt,
  '--system-prompt-file', systemPromptFile,
  '--model', model,
  '--safe-mode',
  '--restricted',
  '--tools', '',
  '--max-turns', '1',
  '--permission-prompts', 'none',
  '--no-session-persistence',
  '--output-format', 'json',
];

let raw;
try {
  raw = execFileSync('claude', args, {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
    cwd: repoRoot,
  });
} catch (e) {
  // Exit non-zero so promptfoo records an ERROR, not a failed assertion. The
  // withheld-skill verifier rejects a run containing any errored case, which is
  // what stops a quota or transport fault being banked as "the skill was needed".
  const detail = (e.stderr || e.stdout || e.message || '').toString().trim().slice(0, 600);
  die(`claude exited ${e.status ?? '?'}: ${detail}`);
}

let text;
try {
  const doc = JSON.parse(raw);
  text = doc.result ?? doc.text ?? doc.content;
  if (Array.isArray(text)) {
    text = text.map((b) => (typeof b === 'string' ? b : b?.text ?? '')).join('');
  }
  if (doc.is_error) die(`claude reported an error result: ${String(text).slice(0, 400)}`);
} catch (e) {
  if (e instanceof SyntaxError) die(`claude did not return JSON: ${raw.slice(0, 400)}`);
  throw e;
}

if (typeof text !== 'string' || text.trim() === '') {
  die('claude returned an empty result; there is no answer to assert against');
}

process.stdout.write(text);
