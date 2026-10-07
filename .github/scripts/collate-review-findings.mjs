#!/usr/bin/env node
// Collates the review agents' findings files into one Markdown block and splices
// that block into the pull request body between two fixed markers.
//
// Deterministic by construction (NFR-001): no AI, no clock read, no randomness,
// and no network beyond the two `gh` calls. The same findings files always
// produce the same block, byte for byte. Agents are emitted in sorted order,
// never in directory-listing order.
//
// This script is plumbing, not a review agent. It applies no standard, forms no
// judgement, and never adds, drops, merges, or reworks a finding — it reproduces
// what each agent reported. That is why it is not a row in the spec's
// `Engineering standards as artifacts` table: there is no standard for it to
// author against, and nothing in it that could be withheld to prove a
// difference.

// `splice` and `buildBlock` are exported so `collate-review-findings.test.mjs`
// can exercise them without a GitHub token or a live pull request. The CLI half
// at the bottom runs only when this file is executed directly.

import { existsSync, readFileSync, readdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const START = '<!-- review-agents:start -->';
export const END = '<!-- review-agents:end -->';

// Read lazily rather than captured at import time, so the test can redirect
// them per case.
const agentsDir = () => process.env.AGENTS_DIR ?? '.claude/agents';
const findingsDir = () => process.env.FINDINGS_DIR ?? 'review-findings';
const runUrl = () => process.env.RUN_URL ?? '';

// The expected set of agents comes from the committed agent files themselves,
// not from a list in this script and not from the workflow matrix. The spec's
// standards table is the authoritative set and `.claude/agents/` is its on-disk
// form, so this stays correct when an agent is added or removed.
export function expectedAgents() {
  return readdirSync(agentsDir())
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .sort();
}

// A missing or unreadable file is reported as "did not report", never as clean.
// Conflating a crashed agent with a clean one would turn a failed run into false
// evidence, and NFR-012 item 2 counts a clean run as evidence.
export function parse(agent) {
  const path = join(findingsDir(), `${agent}.md`);
  if (!existsSync(path)) return { agent, status: 'missing' };

  const raw = readFileSync(path, 'utf8').trim();
  if (raw === '') return { agent, status: 'missing' };

  const lines = raw.split(/\r?\n/);
  let status = null;
  let declared = null;
  let i = 0;

  for (; i < lines.length; i++) {
    const s = /^STATUS:\s*(clean|findings)\s*$/i.exec(lines[i]);
    if (s) {
      status = s[1].toLowerCase();
      continue;
    }
    const c = /^COUNT:\s*(\d+)\s*$/i.exec(lines[i]);
    if (c) {
      declared = Number(c[1]);
      continue;
    }
    if (lines[i].trim() === '') continue;
    break;
  }

  const body = lines.slice(i).join('\n').trim();

  // No STATUS line: the agent answered, but not in the agreed shape. Show what
  // it said and flag the shape. Still never clean.
  if (status === null) return { agent, status: 'unparsed', body };
  if (status === 'clean') return { agent, status: 'clean', count: 0, body };

  const bullets = body.split(/\r?\n/).filter((l) => /^\s*[-*]\s+/.test(l)).length;
  return { agent, status: 'findings', count: declared ?? bullets, body };
}

export function buildBlock(results) {
  const findings = results.filter((r) => r.status === 'findings');
  const clean = results.filter((r) => r.status === 'clean');
  const missing = results.filter((r) => r.status === 'missing');
  const unparsed = results.filter((r) => r.status === 'unparsed');
  const total = findings.reduce((n, r) => n + r.count, 0);

  // Kept deliberately flat: no collapsible sections, no per-agent headings for
  // agents with nothing to say, and the advisory note on one line. Findings
  // arrive as single lines, so a reviewer should be able to read the whole block
  // without unfolding or scrolling anything.
  const out = [];
  out.push('## Review agents');
  out.push('');

  const tally = [`${results.length} ran`];
  tally.push(total === 1 ? '1 finding' : `${total} findings`);
  tally.push(`${clean.length} clean`);
  if (unparsed.length > 0) tally.push(`${unparsed.length} unreadable`);
  if (missing.length > 0) tally.push(`${missing.length} did not report`);
  out.push(`**${tally.join(' · ')}** — advisory; findings never block merge.`);
  out.push('');

  for (const r of results) {
    if (r.status !== 'findings') continue;
    out.push(`**${r.agent}**`);
    out.push(r.body);
    out.push('');
  }

  if (clean.length > 0) {
    out.push(`Clean: ${clean.map((r) => `\`${r.agent}\``).join(', ')}`);
  }

  if (missing.length > 0) {
    out.push(
      `Did not report: ${missing.map((r) => `\`${r.agent}\``).join(', ')} — unreviewed, not clean.`,
    );
  }

  // The one case still worth folding away: an agent that ignored the shape and
  // may have written several paragraphs.
  for (const r of unparsed) {
    out.push('');
    out.push(`<details><summary><code>${r.agent}</code> — unrecognised format</summary>`);
    out.push('');
    out.push(r.body);
    out.push('');
    out.push('</details>');
  }

  if (clean.length > 0 || missing.length > 0 || unparsed.length > 0) out.push('');

  out.push(
    runUrl()
      ? `[Full agent output](${runUrl()}) · collated by \`collate-review-findings.mjs\``
      : 'Collated by `collate-review-findings.mjs`.',
  );

  return out.join('\n').trimEnd();
}

export function splice(body, block) {
  const a = body.indexOf(START);
  const b = body.indexOf(END);

  // Both markers present and in order: replace only what sits between them, so
  // nothing the author wrote is ever touched.
  if (a !== -1 && b !== -1 && b > a) {
    return body.slice(0, a + START.length) + '\n' + block + '\n' + body.slice(b);
  }

  // Markers absent — a pull request opened before the template existed, or an
  // author who deleted them. Append rather than fail, so the summary is never
  // silently dropped.
  const base = body.trimEnd();
  const region = `${START}\n${block}\n${END}`;
  return base === '' ? region : `${base}\n\n---\n\n${region}`;
}

function main() {
  const results = expectedAgents().map(parse);

  if (results.length === 0) {
    console.error(`No agent files found in ${agentsDir()} — nothing to collate.`);
    process.exit(1);
  }

  const block = buildBlock(results);

  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${block}\n`);
  }
  writeFileSync('review-summary.md', `${block}\n`);

  for (const r of results) {
    console.log(`${r.agent}: ${r.status}${r.status === 'findings' ? ` (${r.count})` : ''}`);
  }

  if (process.env.CAN_EDIT_BODY !== 'true') {
    // A pull request from a fork gets a read-only GITHUB_TOKEN whatever the
    // permissions block says, so the body cannot be edited. The summary stays in
    // the step summary and the uploaded artifact. Not an error.
    console.log('\nBody edit skipped: no write access to this pull request (fork).');
    process.exit(0);
  }

  const prNumber = process.env.PR_NUMBER ?? '';
  if (!prNumber) {
    console.error('PR_NUMBER is not set.');
    process.exit(1);
  }

  const current =
    JSON.parse(execFileSync('gh', ['pr', 'view', prNumber, '--json', 'body'], { encoding: 'utf8' }))
      .body ?? '';

  const updated = splice(current, block);

  if (updated === current) {
    console.log('\nBody already carries this exact summary; nothing to write.');
    process.exit(0);
  }

  writeFileSync('pr-body.md', updated);
  execFileSync('gh', ['pr', 'edit', prNumber, '--body-file', 'pr-body.md'], { stdio: 'inherit' });
  console.log('\nPull request body updated.');
}

// Executed directly: do the work. Imported by the test: export only.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
