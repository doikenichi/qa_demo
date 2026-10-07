// Unit tests for the review-findings collator. Run with `node --test`.
//
// These cover the two properties that matter, because getting either wrong
// damages a pull request rather than merely looking wrong:
//
//   1. The splice never touches text outside the markers. The body is
//      author-written, and this job edits it on every run.
//   2. A missing findings file reads as "did not report", never as clean.
//      A crashed agent reported as clean would be false evidence, and
//      NFR-012 item 2 counts a clean run as evidence.
//
// No GitHub token, no network, no live pull request.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  START,
  END,
  splice,
  buildBlock,
  parse,
  expectedAgents,
} from './collate-review-findings.mjs';

const BLOCK = '## Review agents\n\nfresh block';

test('splice keeps author text on both sides of the region', () => {
  const body = [
    '## What this changes',
    '',
    'Author text before. Must survive.',
    '',
    START,
    '_stale content from a previous run_',
    END,
    '',
    'Author trailer after. Must also survive.',
  ].join('\n');

  const out = splice(body, BLOCK);

  assert.match(out, /Author text before\. Must survive\./);
  assert.match(out, /Author trailer after\. Must also survive\./);
  assert.doesNotMatch(out, /stale content/);
  assert.match(out, /fresh block/);
  assert.equal(out.split(START).length - 1, 1, 'exactly one start marker');
  assert.equal(out.split(END).length - 1, 1, 'exactly one end marker');
});

test('splice is idempotent: a second run with the same block is a no-op', () => {
  const body = `## Title\n\ntext\n\n${START}\nold\n${END}\n`;
  const once = splice(body, BLOCK);
  assert.equal(splice(once, BLOCK), once);
});

test('splice appends a region when the markers are absent', () => {
  const out = splice('A body with no markers at all.', BLOCK);
  assert.match(out, /A body with no markers at all\./);
  assert.match(out, /fresh block/);
  assert.equal(out.split(START).length - 1, 1);
  assert.equal(out.split(END).length - 1, 1);
});

test('splice handles an empty body without a stray separator', () => {
  const out = splice('', BLOCK);
  assert.equal(out, `${START}\n${BLOCK}\n${END}`);
  assert.doesNotMatch(out, /^---/m);
});

test('splice appends when the markers appear in the wrong order', () => {
  // Reversed markers would make a slice-between meaningless; append instead of
  // producing a mangled body.
  const body = `${END}\nbroken\n${START}`;
  const out = splice(body, BLOCK);
  assert.match(out, /fresh block/);
  assert.match(out, /broken/);
});

test('a missing findings file is "did not report", never clean', () => {
  const dir = mkdtempSync(join(tmpdir(), 'collate-'));
  process.env.FINDINGS_DIR = dir;
  const r = parse('security-reviewer');
  assert.equal(r.status, 'missing');
});

test('an empty findings file is "did not report", never clean', () => {
  const dir = mkdtempSync(join(tmpdir(), 'collate-'));
  writeFileSync(join(dir, 'security-reviewer.md'), '   \n\n');
  process.env.FINDINGS_DIR = dir;
  assert.equal(parse('security-reviewer').status, 'missing');
});

test('a findings file with no STATUS line is "unparsed", never clean', () => {
  const dir = mkdtempSync(join(tmpdir(), 'collate-'));
  writeFileSync(join(dir, 'standards-reviewer.md'), 'I looked at the diff and it seemed fine.');
  process.env.FINDINGS_DIR = dir;
  const r = parse('standards-reviewer');
  assert.equal(r.status, 'unparsed');
  assert.match(r.body, /seemed fine/);
});

test('COUNT is used when given, and bullets are counted when it is not', () => {
  const dir = mkdtempSync(join(tmpdir(), 'collate-'));
  writeFileSync(join(dir, 'a.md'), 'STATUS: findings\nCOUNT: 7\n\n- one bullet only\n');
  writeFileSync(join(dir, 'b.md'), 'STATUS: findings\n\n- one\n- two\n- three\n');
  process.env.FINDINGS_DIR = dir;
  assert.equal(parse('a').count, 7);
  assert.equal(parse('b').count, 3);
});

test('the block names every clean agent explicitly (NFR-012 item 2)', () => {
  const block = buildBlock([
    { agent: 'standards-reviewer', status: 'clean', count: 0, body: 'nothing found' },
    { agent: 'security-reviewer', status: 'clean', count: 0, body: 'nothing found' },
  ]);
  assert.match(block, /`standards-reviewer`/);
  assert.match(block, /`security-reviewer`/);
  assert.match(block, /2 ran/);
  assert.match(block, /2 clean/);
});

test('the block distinguishes a silent agent from a clean one', () => {
  const block = buildBlock([
    { agent: 'standards-reviewer', status: 'clean', count: 0, body: '' },
    { agent: 'security-reviewer', status: 'missing' },
  ]);
  assert.match(block, /Did not report/);
  assert.match(block, /unreviewed, not clean/);
  assert.match(block, /1 clean/);
});

test('the block states that findings never block a merge', () => {
  const block = buildBlock([{ agent: 'standards-reviewer', status: 'clean', count: 0, body: '' }]);
  assert.match(block, /advisory/i);
  assert.match(block, /never block merge/);
});

test('the block folds away nothing when every finding is one line', () => {
  // The whole point of the short format: a reviewer reads the block without
  // unfolding anything. `<details>` is reserved for an agent that ignored the
  // shape.
  const block = buildBlock([
    { agent: 'a', status: 'findings', count: 1, body: '- `F.java:1` thing (NFR-001) -> fix' },
    { agent: 'b', status: 'clean', count: 0, body: 'clean' },
  ]);
  assert.doesNotMatch(block, /<details/);
});

test('an unrecognised-format report is folded away', () => {
  const block = buildBlock([{ agent: 'a', status: 'unparsed', body: 'paragraph after paragraph' }]);
  assert.match(block, /<details/);
  assert.match(block, /unrecognised format/);
  assert.match(block, /1 unreadable/);
});

test('singular and plural finding counts both read correctly', () => {
  const one = buildBlock([{ agent: 'a', status: 'findings', count: 1, body: '- x' }]);
  assert.match(one, /1 finding\b/);
  assert.doesNotMatch(one, /1 findings/);
  const two = buildBlock([{ agent: 'a', status: 'findings', count: 2, body: '- x\n- y' }]);
  assert.match(two, /2 findings/);
});

test('buildBlock is deterministic for the same input (NFR-001)', () => {
  const results = [
    { agent: 'standards-reviewer', status: 'findings', count: 1, body: '- `a.java:1` thing' },
    { agent: 'security-reviewer', status: 'clean', count: 0, body: 'clean' },
  ];
  assert.equal(buildBlock(results), buildBlock(results));
});

test('expectedAgents reads the committed agent files, sorted, ignoring non-Markdown', () => {
  const dir = mkdtempSync(join(tmpdir(), 'agents-'));
  writeFileSync(join(dir, 'zeta-reviewer.md'), '');
  writeFileSync(join(dir, 'alpha-reviewer.md'), '');
  writeFileSync(join(dir, 'README.txt'), 'not an agent');
  process.env.AGENTS_DIR = dir;
  assert.deepEqual(expectedAgents(), ['alpha-reviewer', 'zeta-reviewer']);
});

test('the real agent directory is the set the summary expects', () => {
  delete process.env.AGENTS_DIR;
  const agents = expectedAgents();
  // Guards the wiring, not the count: the spec's standards table owns the set,
  // so this asserts the directory is read, not how many rows that table has.
  assert.ok(agents.length > 0, '.claude/agents holds at least one agent');
  assert.ok(agents.includes('security-reviewer'));
});
