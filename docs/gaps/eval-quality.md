# Gap Analysis: Eval Suite Quality and Measurement

**Date:** 2026-10-10
**Source:** PR #10 CI failure — job `Skill eval suites (with skill loaded) (code-standard)`,
run [38031317929](https://github.com/doikenichi/qa_demo/actions/runs/38031317929/job/114264038489?pr=10)

---

## The Incident

The `code-standard` eval suite failed in CI with 1 pass and 1 assertion failure:

- **Failing test:** "With skill: refuses virtual threads"
- **Assertion:** `contains: "not adopted"`
- **Model response:** "Virtual threads **aren't adopted** in this codebase…"
- **Root cause:** `"aren't adopted"` expands to `"are not adopted"` — the literal substring
  `"not adopted"` never appears, so the `contains` check fails despite a correct refusal.

The model grounded its answer in the skill's language and refused virtual threads correctly.
The assertion was too narrow to accept a natural contraction of the expected phrase.

---

## What the Eval Is Testing

The eval is a **prompt-following test**: given the skill text as a system prompt, does the model
obey it and echo back its authoritative phrasing when answering a user question?

The intent is to verify *skill influence*, not just answer correctness. A refusal that reasons from
general knowledge would pass correctness but fail this assertion, because it does not prove the
skill was the cause.

The withheld-skill counterpart (`promptfooconfig-withheld.yaml`) completes the picture: it runs the
same question without the skill in the system prompt and asserts the model does *not* produce the
expected phrase — proving the skill changes the model's output in the expected direction.

---

## Four Dimensions of Eval Efficacy

| Dimension | Definition | Current state |
|---|---|---|
| **Sensitivity** | Does the eval catch when the skill is absent? | Covered by the withheld-skill job (NFR-012 requires one per skill). |
| **Specificity** | Does the assertion check the right thing, not just the right words? | **Gap.** The current failure is a specificity problem: the assertion is phrasing-bound, not behavior-bound. |
| **Coverage** | Does the eval exercise all important behaviors of the skill? | **Gap.** `code-standard` has 2 cases; the skill also covers module structure, naming, Java 25 idioms — none tested. |
| **Stability** | Does the eval produce consistent verdicts across runs on the same inputs? | **Gap.** No multi-run protocol exists for evals (NFR-001's four-run protocol applies to the product suite, not evals). |

---

## What the Spec Plans (and Does Not Plan)

### Planned — NFR-012 (milestone 0, permanent floor)

- Every skill has an eval suite that runs in CI and is green.
- One eval per skill is proven to fail when the skill is withheld.

This floor is fixed and never revisited in later milestones.

### Planned — NFR-013 (milestone 5)

- Flaky score, published metrics, and stability measurement for the **product test suite**.
- The skill eval suites under `.claude/evals/` are not in scope for NFR-013.

### Not planned

- No coverage target for eval cases per skill.
- No assertion quality review.
- No stability measurement across model versions for evals.
- No milestone that revisits or expands eval suites after milestone 0.

---

## The Gap

The project ensures evals exist, are green, and that one fails when the skill is withheld. It has
no mechanism to catch a fragile assertion — that required a model output change to surface. The
four dimensions above (sensitivity excepted) are currently outside the spec's scope.

### Immediate fix for the incident

Broaden the assertion to accept the correct behavior regardless of contraction:

```yaml
# option A — check the decision, not the phrasing
assert:
  - type: contains
    value: "adopted"

# option B — accept both forms explicitly
assert:
  - type: javascript
    value: "output.includes('not adopted') || output.includes(\"aren't adopted\")"
```

Option A is preferred: it checks that the model cited the adoption status, which is the behavioral
signal, rather than enforcing a specific contraction.

### Longer-term considerations (require spec change and decisions-log entry)

1. **Assertion design rule** — prefer behavior-checking assertions (`contains` on a decision word,
   `llm-rubric` on a claim) over exact-phrase assertions that are contraction-sensitive.
2. **Coverage floor** — define a minimum number of test cases per skill proportional to the
   number of distinct rules it carries.
3. **Eval stability protocol** — run each eval suite N times at the same commit and flag
   disagreement, mirroring the product suite's flaky-score method.

None of these is a gate; they would be published metrics under NFR-013's "no invented target" rule
if adopted.
