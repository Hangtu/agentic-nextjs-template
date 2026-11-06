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
    if (operation === "doctor") {
      assert.ok(readme.includes("Node.js runtime status check"));
      assert.ok(readme.includes("official release schedule"));
    }
  }
});

test("README links the license and community entry points", async () => {
  const readme = await read("README.md");
  for (const path of ["LICENSE", "CONTRIBUTING.md", "SECURITY.md", "CODE_OF_CONDUCT.md", "assets/README.md", "docs/operations/github-presentation.md"]) {
    assert.ok(readme.includes(path), path);
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

test("Doctor assesses Node.js lifecycle and compatibility without upgrading the target", async () => {
  const playbook = await read("docs/playbooks/adopt-project.md");
  const doctor = operationSection(playbook, "Doctor");
  assert.ok(doctor);
  assert.ok(doctor.includes("Node.js runtime (include in every Doctor report)"));
  assert.ok(doctor.includes("https://nodejs.org/en/about/previous-releases"));
  assert.ok(doctor.includes("Current, Alpha"));
  assert.ok(doctor.includes("never changes runtime pins"));
  assert.ok(doctor.includes("If Node.js is irrelevant, explicitly mark this check not applicable"));

  const techStack = await read("docs/architecture/tech-stack.md");
  assert.ok(techStack.includes("https://nodejs.org/en/about/previous-releases"));
  assert.ok(techStack.includes("compatible supported LTS line"));
  assert.ok(!techStack.includes("Node.js 26"), "Do not freeze dynamic release guidance to one major");

  const report = await read("docs/templates/adoption-report.md");
  const node = operationSection(report, "Node.js runtime — include in every Doctor report");
  assert.ok(node);
  for (const label of ["Declared versions/evidence", "Official schedule", "Compatibility and recommendation"]) {
    assert.ok(node.includes(`**${label}:**`), label);
  }
  assert.ok(node.includes("Never recommend “latest” without its release phase and compatibility evidence"));
});

test("the report distinguishes decisions from evidence-backed findings", async () => {
  const report = await read("docs/templates/adoption-report.md");
  const findings = operationSection(report, "Findings");
  const decisions = operationSection(report, "Adoption decisions");
  assert.ok(findings, "Technical findings need their own section");
  assert.ok(decisions, "Adoption decisions need a separate section");
  for (const label of ["Finding status", "Priority", "Evidence", "Impact", "Confidence", "Next action"]) {
    assert.ok(findings.includes(`**${label}:**`), label);
  }
  assert.ok(decisions.includes("| Classification | Area | Evidence / finding ID |"));
  assert.ok(report.includes("## Preserve / no change"));
});

test("AGENTS distinguishes available check commands from execution permission", async () => {
  const agents = await read("AGENTS.md");
  const always = agents.match(/^\*\*Always:\*\*(.+)$/m)?.[1];
  assert.ok(always);
  assert.ok(!always.includes("run the contract's checks"), "A global check obligation must not override Doctor");
  const verification = operationSection(agents, "2. Verification boundaries");
  assert.ok(verification);
  for (const operation of ["Doctor", "Adopt", "Verify"]) {
    assert.ok(verification.includes(`**${operation}:**`), operation);
  }
  assert.ok(verification.includes("not blanket permission"));
});

test("completion and review instructions preserve Doctor's no-execution boundary", async () => {
  const completion = operationSection(await read("docs/workflow/definition-of-done.md"), "Verification");
  assert.ok(completion);
  assert.ok(!completion.includes("The contract's checks were actually run"), "Completion must not force unauthorized execution");
  assert.ok(completion.includes("Doctor"));
  const review = await read("docs/playbooks/code-review.md");
  assert.ok(review.includes("Doctor"));
  assert.ok(review.includes("approved checks"));
});

test("manual updates compare adopted source, candidate source, and local library", async () => {
  const playbook = await read("docs/playbooks/update-kit.md");
  for (const label of ["Adopted source", "Candidate source", "Local library"]) {
    assert.ok(playbook.includes(`**${label}:**`), label);
  }
  assert.ok(playbook.includes("## Missing provenance"));
  assert.ok(playbook.includes("## Verification"));
});
