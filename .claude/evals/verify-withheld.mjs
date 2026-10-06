#!/usr/bin/env node
/**
 * Verifies a withheld-skill eval run is genuine evidence.
 *
 * NFR-012 item 1 requires one eval per skill proven to fail when its skill is
 * withheld. A non-zero exit code from the runner is NOT sufficient evidence:
 * an invalid model id, a missing credential, or a network fault also exits
 * non-zero, and would record "the skill was needed" when nothing was measured.
 *
 * A genuine proof requires both:
 *   1. the provider answered every case  — the failure is an ASSERT, not an
 *      ERROR, and a model answer is present, and
 *   2. at least one assertion failed     — the model could not produce the
 *      skill's required statement on its own.
 *
 * promptfoo sets `error` on an assertion failure as well as on a provider
 * fault, so the discriminator is `failureReason`, not the presence of `error`.
 *
 * Usage: node verify-withheld.mjs <skill> <promptfoo-output.json>
 * Exits 0 when the proof is genuine, 1 otherwise.
 */
import { readFileSync } from 'node:fs';

// promptfoo's ResultFailureReason
const REASON = { NONE: 0, ASSERT: 1, ERROR: 2 };

const [skill, file] = process.argv.slice(2);
if (!skill || !file) {
  console.error('usage: verify-withheld.mjs <skill> <promptfoo-output.json>');
  process.exit(1);
}

const fail = (msg) => {
  console.error(`FAIL (${skill}): ${msg}`);
  process.exit(1);
};

let raw;
try {
  raw = readFileSync(file, 'utf8');
} catch (e) {
  fail(`no eval output at ${file} — the runner did not produce results (${e.code}). ` +
       `This is a runner fault, not evidence that the skill was needed.`);
}

let doc;
try {
  doc = JSON.parse(raw);
} catch {
  fail(`eval output at ${file} is not valid JSON — the runner did not complete.`);
}

// promptfoo has shipped both { results: { results: [...] } } and { results: [...] }.
const block = Array.isArray(doc.results) ? { results: doc.results } : (doc.results ?? {});
const cases = Array.isArray(block.results) ? block.results : [];
if (cases.length === 0) {
  fail('eval output contains no test cases — nothing was measured.');
}

const outputOf = (c) => {
  const out = c.response?.output;
  return typeof out === 'string' ? out : out == null ? '' : String(out);
};

// A provider or configuration fault. Where failureReason is absent, fall back to
// "error reported and no answer produced", which cannot be an assertion failure.
const isRunnerError = (c) =>
  c.failureReason === REASON.ERROR ||
  (c.failureReason === undefined && c.error && outputOf(c).trim() === '');

const errored = cases.filter(isRunnerError);
if (errored.length > 0) {
  const sample = String(errored[0].error ?? 'unknown').split('\n')[0].slice(0, 300);
  fail(`${errored.length}/${cases.length} case(s) errored instead of answering. ` +
       `First error: ${sample}\n` +
       `A provider or configuration fault cannot stand in for a failed assertion.`);
}

const silent = cases.filter((c) => outputOf(c).trim() === '');
if (silent.length > 0) {
  fail(`${silent.length}/${cases.length} case(s) produced no model output — ` +
       `the assertion could not have been evaluated against an answer.`);
}

const failures = cases.filter((c) => c.success === false);
if (failures.length === 0) {
  fail(`all ${cases.length} case(s) PASSED without the skill loaded. ` +
       `The suite is measuring the model, not the artifact (NFR-012 item 1). ` +
       `Rewrite the withheld case until it fails deterministically.`);
}

console.log(
  `PASS (${skill}): ${failures.length}/${cases.length} assertion(s) failed with the ` +
  `skill withheld, and every case received a model answer. The proof is genuine.`,
);
