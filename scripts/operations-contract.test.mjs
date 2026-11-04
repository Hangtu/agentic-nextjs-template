import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

function operationSection(source, operation) {
  // A heading in the fenced integration example must not end the operation.
  const prose = source.replace(/^```[^\n]*\n[\s\S]*?^```[ \t]*(?:\n|$)/gm, "");
  return prose.split(`## ${operation}\n`)[1]?.split("\n## ")[0];
}

test("README exposes three independent operation entry points", async () => {
  const readme = await read("README.md");
  for (const operation of ["doctor", "adopt", "verify"]) {
    assert.ok(readme.includes(`docs/playbooks/adopt-project.md#${operation}`), operation);
  }
});

for (const operation of ["Doctor", "Adopt", "Verify"]) {
  test(`${operation} has an explicit boundary and stop condition in the shared playbook`, async () => {
    const section = operationSection(await read("docs/playbooks/adopt-project.md"), operation);
    assert.ok(section, operation);
    for (const label of ["Inputs", "Allowed", "Stop"]) {
      assert.ok(section.includes(`**${label}:**`), `${operation} needs ${label}`);
    }
  });
}

test("the report distinguishes decisions from evidence-backed findings", async () => {
  const report = await read("docs/templates/adoption-report.md");
  for (const label of ["Finding status", "Priority", "Evidence", "Impact", "Confidence", "Next action"]) {
    assert.ok(report.includes(`**${label}:**`), label);
  }
  assert.ok(report.includes("## Preserve / no change"));
  assert.ok(report.includes("## Adoption decisions"));
});

test("manual updates compare adopted source, candidate source, and local library", async () => {
  const playbook = await read("docs/playbooks/update-kit.md");
  for (const label of ["Adopted source", "Candidate source", "Local library"]) {
    assert.ok(playbook.includes(`**${label}:**`), label);
  }
  assert.ok(playbook.includes("## Missing provenance"));
  assert.ok(playbook.includes("## Verification"));
});
