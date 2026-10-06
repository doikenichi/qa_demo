#!/usr/bin/env node
/**
 * Prints a per-case classification of a promptfoo run: PASS, ASSERT-FAIL, or
 * RUNNER-ERROR.
 *
 * NFR-001 bans retries, so a red eval job stays red and a human reads it. This
 * exists so that reading it does not require guessing: an assertion the skill
 * failed to produce and a transport or quota fault are different problems with
 * different responses, and promptfoo reports both through the same `error`
 * field. Diagnostic only — it never changes an exit code.
 *
 * Usage: node summarize-run.mjs <label> <promptfoo-output.json>
 */
import { readFileSync } from 'node:fs';

const REASON = { NONE: 0, ASSERT: 1, ERROR: 2 };
const [label, file] = process.argv.slice(2);

if (!label || !file) {
  console.error('usage: summarize-run.mjs <label> <promptfoo-output.json>');
  process.exit(0);
}

let doc;
try {
  doc = JSON.parse(readFileSync(file, 'utf8'));
} catch (e) {
  console.log(`[${label}] no readable eval output at ${file} (${e.code ?? 'parse error'}).`);
  console.log(`[${label}] the runner did not complete — this is a runner fault, not a skill result.`);
  process.exit(0);
}

const block = Array.isArray(doc.results) ? { results: doc.results } : (doc.results ?? {});
const cases = Array.isArray(block.results) ? block.results : [];

if (cases.length === 0) {
  console.log(`[${label}] no test cases in output — nothing was measured.`);
  process.exit(0);
}

let pass = 0, assertFail = 0, runnerError = 0;

cases.forEach((c, i) => {
  const out = c.response?.output;
  const text = typeof out === 'string' ? out : out == null ? '' : String(out);
  const desc = c.testCase?.description ?? `case ${i}`;
  let verdict;
  if (c.success === true) {
    verdict = 'PASS';
    pass++;
  } else if (c.failureReason === REASON.ERROR || (c.failureReason === undefined && c.error && !text.trim())) {
    verdict = 'RUNNER-ERROR';
    runnerError++;
  } else {
    verdict = 'ASSERT-FAIL';
    assertFail++;
  }
  console.log(`[${label}] ${verdict}  ${desc}`);
  if (verdict !== 'PASS') {
    console.log(`[${label}]   reason: ${String(c.error ?? 'unknown').split('\n')[0].slice(0, 240)}`);
  }
  if (verdict === 'ASSERT-FAIL') {
    console.log(`[${label}]   model said: ${text.replace(/\s+/g, ' ').slice(0, 240)}`);
  }
});

console.log(`[${label}] ${pass} pass, ${assertFail} assertion failure(s), ${runnerError} runner error(s).`);
if (runnerError > 0) {
  console.log(
    `[${label}] At least one case never reached an assertion. Treat this as infrastructure ` +
    `(credential, quota, transport), not as a verdict on the skill. Retries are banned ` +
    `(NFR-001), so re-run deliberately rather than automatically.`,
  );
}
