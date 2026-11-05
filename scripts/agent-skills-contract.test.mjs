import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

function operationSection(source, operation) {
  const prose = source.replace(/^```[^\n]*\n[\s\S]*?^```[ \t]*(?:\n|$)/gm, "");
  return prose.split(`## ${operation}\n`)[1]?.split("\n## ")[0];
}

test("approved agent-skill sources are first-party Vercel, Neon, and Next.js references", async () => {
  const policy = await read("docs/architecture/agent-skills.md");
  assert.ok(policy.includes("https://vercel.com/docs/agent-resources/skills"));
  assert.ok(policy.includes("https://neon.com/docs/ai/agent-skills"));
  assert.ok(policy.includes("https://nextjs.org/docs/app/guides/ai-agents"));
  assert.ok(policy.includes("https://github.com/vercel/next.js/tree/canary/skills"));
  assert.ok(policy.includes("directly to its source"));
  assert.ok(policy.includes("Next.js alone is not evidence that Vercel is used"));
  assert.ok(policy.includes("PostgreSQL dependency alone is not evidence that Neon is used"));
  assert.ok(policy.includes("not every skill they list"));
  assert.ok(policy.includes("do not invoke, recommend, incorporate, or rely on it"));
});

test("Doctor can recommend official skills but cannot incorporate or execute them", async () => {
  const playbook = await read("docs/playbooks/adopt-project.md");
  const doctor = operationSection(playbook, "Doctor");
  assert.ok(doctor);
  assert.ok(doctor.includes("official agent skills"));
  assert.ok(doctor.includes("never an automatic install"));
  assert.ok(doctor.includes("Do not save the report into the target"));
});

test("Adopt requires a named, approved skill and reviewed incorporation plan", async () => {
  const playbook = await read("docs/playbooks/adopt-project.md");
  const adopt = operationSection(playbook, "Adopt");
  assert.ok(adopt);
  assert.ok(adopt.includes("approved plan names the exact skill/source"));
  assert.ok(adopt.includes("authorized install method"));
  assert.ok(adopt.includes("never infer install permission"));
});

test("the report separates official skill suggestions from findings and install decisions", async () => {
  const report = await read("docs/templates/adoption-report.md");
  const skills = operationSection(report, "Official agent skills — optional, when relevant");
  assert.ok(skills);
  for (const label of ["First-party source and revision/date", "Evidence of active use and task fit", "Agent/runtime compatibility", "Disposition"]) {
    assert.ok(skills.includes(label), label);
  }
  assert.ok(skills.includes("Doctor may suggest"));
  assert.ok(skills.includes("explicitly approved Adopt plan"));
});
