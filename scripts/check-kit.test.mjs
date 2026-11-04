import assert from "node:assert/strict";
import { cp, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

import { checkDocumentation, checkKit, validateContext } from "./check-kit.mjs";

const fixture = (name) => readFile(new URL(`fixtures/${name}-context.md`, import.meta.url), "utf8");

async function sandbox(t) {
  const root = await mkdtemp(join(tmpdir(), "agent-kit-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, "docs"));
  return root;
}

for (const name of ["landing", "authenticated", "existing"]) {
  test(`accepts the approved ${name} project contract`, async () => {
    assert.deepEqual(validateContext(await fixture(name)), []);
  });
}

test("the blank template is proposed, not accidental authorization", async () => {
  const source = await readFile(new URL("../docs/templates/project-context.md", import.meta.url), "utf8");
  assert.deepEqual(validateContext(source), []);
  assert.match(source, /\*\*Status:\*\* proposed/);
});

test("accepts the same project contract with Windows line endings", async () => {
  assert.deepEqual(validateContext((await fixture("landing")).replaceAll("\n", "\r\n")), []);
});

test("a relocated reference library keeps its internal links without replacing target instructions", async (t) => {
  const root = await sandbox(t);
  const instructions = "# Existing instructions\n\nPreserve this project's conventions.\n";
  await writeFile(join(root, "AGENTS.md"), instructions);
  await cp(new URL("../docs/", import.meta.url), join(root, "docs/agent-kit"), { recursive: true });
  await writeFile(join(root, "docs/agent-kit/project-context.md"), await fixture("existing"));
  assert.deepEqual((await checkDocumentation(root)).errors, []);
  assert.equal(await readFile(join(root, "AGENTS.md"), "utf8"), instructions);
});

test("approval cannot turn unknown capabilities into inactive ones", async () => {
  const source = (await fixture("landing")).replace("| auth | inactive |", "| auth | unknown |");
  assert.ok(validateContext(source).some((error) => error.includes("auth") && error.includes("unknown")));
});

test("approved contracts need approval evidence and an explicit mode", async () => {
  const source = (await fixture("landing"))
    .replace("**Approval:** fixture owner approved", "**Approval:** pending")
    .replace("**Mode:** new", "**Mode:** undecided");
  const errors = validateContext(source);
  assert.ok(errors.some((error) => error.includes("Approval")));
  assert.ok(errors.some((error) => error.includes("Mode")));
});

test("rejects missing, duplicate, and misspelled capability states", async () => {
  const source = (await fixture("landing"))
    .replace("| auth | inactive | No accounts |", "")
    .replace("| forms | inactive | No submissions |", "| forms | maybe | No submissions |\n| forms | inactive | Duplicate |");
  const errors = validateContext(source);
  assert.ok(errors.some((error) => error.includes("Missing capability: auth")));
  assert.ok(errors.some((error) => error.includes("Duplicate capability: forms")));
  assert.ok(errors.some((error) => error.includes("Invalid state")));
});

for (const field of ["Kit source", "Adopted at", "Update policy"]) {
  test(`approved consumer contracts require ${field}`, async () => {
    const source = (await fixture("existing"))
      .split("\n").filter((line) => !line.startsWith(`- **${field}:**`)).join("\n");
    assert.ok(validateContext(source).some((error) => error.includes(field)));
  });
}

test("approved consumers need an exact commit, not a branch/tag/short revision", async () => {
  for (const revision of ["main", "v1.0.0", "8a3bdc5", "pending"]) {
    const source = (await fixture("existing")).replace("a".repeat(40), revision);
    assert.ok(validateContext(source).some((error) => error.includes("Kit revision")), revision);
  }
});

test("full Git object IDs and calendar-valid adoption dates are accepted", async () => {
  const source = (await fixture("existing")).replace("a".repeat(40), "b".repeat(64))
    .replace("2026-11-03", "2024-02-29");
  assert.deepEqual(validateContext(source), []);
});

test("invalid or pending adoption dates cannot approve a consumer", async () => {
  for (const date of ["2026-02-30", "2026-13-01", "2026-11-31", "2026-11-03T00:00:00Z", "pending", "not-applicable"]) {
    const source = (await fixture("existing")).replace("2026-11-03", date);
    assert.ok(validateContext(source).some((error) => error.includes("Adopted at")), date);
  }
});

test("provenance URLs are HTTPS, credential-free, and never echoed in errors", async () => {
  const original = "https://github.com/Hangtu/agentic-nextjs-template";
  const unsafe = [
    "http://example.invalid/kit", "https://user:fixture-secret@example.invalid/kit",
    "https://example.invalid/kit?token=fixture-secret", "file:///tmp/kit",
    "https://example.invalid/kit#main", "pending",
  ];
  for (const url of unsafe) {
    const source = (await fixture("existing")).replace(original, url);
    const errors = validateContext(source);
    assert.ok(errors.some((error) => error.includes("Kit source")));
    assert.ok(!errors.join("\n").includes("fixture-secret"));
  }
});

test("fork source URLs can be recorded without contacting the host", async () => {
  const source = (await fixture("existing")).replace(
    "https://github.com/Hangtu/agentic-nextjs-template", "https://example.invalid/team/fork",
  );
  assert.deepEqual(validateContext(source), []);
});

test("automatic synchronization is not a supported update policy", async () => {
  const source = (await fixture("existing")).replace("manual-review", "auto-sync");
  assert.ok(validateContext(source).some((error) => error.includes("Update policy")));
});

test("legacy provenance gaps are reported without guessing or changing the input", async () => {
  const source = (await fixture("existing")).split("\n")
    .filter((line) => !/^- \*\*(Kit source|Adopted at|Update policy):/.test(line)).join("\n")
    .replace("a".repeat(40), "unrecorded");
  const before = source;
  const errors = validateContext(source);
  assert.ok(errors.some((error) => error.includes("Kit source")));
  assert.ok(errors.some((error) => error.includes("Kit revision")));
  assert.equal(source, before);
});

test("Doctor, Adopt, and Verify do not become persistent project modes", async () => {
  for (const operation of ["doctor", "adopt", "verify"]) {
    const source = (await fixture("existing")).replace("**Mode:** existing", `**Mode:** ${operation}`);
    assert.ok(validateContext(source).some((error) => error.includes("Mode")));
  }
});

test("the source kit records an explicit not-applicable adoption date", async () => {
  const source = await readFile(new URL("../docs/project-context.md", import.meta.url), "utf8");
  assert.ok(source.includes("**Adopted at:** not-applicable"));
  assert.deepEqual(validateContext(source), []);
});

test("kit mode cannot accidentally activate application infrastructure", async () => {
  const source = (await fixture("landing")).replace("**Mode:** new", "**Mode:** kit");
  assert.ok(validateContext(source).some((error) => error.includes("kit mode")));
});

test("preserves a valid existing Unicode documentation path", async () => {
  const source = (await fixture("existing")).replace("**Knowledge root:** docs/agent-kit", "**Knowledge root:** documentación/ingeniería");
  assert.deepEqual(validateContext(source), []);
});

test("rejects a library path outside the target repository", async () => {
  const source = (await fixture("existing")).replace("**Knowledge root:** docs/agent-kit", "**Knowledge root:** ../other");
  assert.ok(validateContext(source).some((error) => error.includes("Knowledge root")));
});

test("checks relative targets and heading anchors without changing files", async (t) => {
  const root = await sandbox(t);
  const source = "# Guide\n\n[Checks](docs/checks.md#run-checks)\n";
  await writeFile(join(root, "README.md"), source);
  await writeFile(join(root, "docs/checks.md"), "# Checks\n\n## Run checks\n");
  const result = await checkDocumentation(root);
  assert.deepEqual(result.errors, []);
  assert.equal(result.links, 1);
  assert.equal(await readFile(join(root, "README.md"), "utf8"), source);
});

test("detects missing documents, missing anchors, and invalid rule definitions", async (t) => {
  const root = await sandbox(t);
  await writeFile(join(root, "README.md"), "# Guide\n\n[Missing](docs/missing.md)\n[Bad](docs/checks.md#absent)\n");
  await writeFile(join(root, "docs/checks.md"), "# Checks\n\n- **TEST-1 (MUST)** One definition\n- **TEST-1 (MUST)** Duplicate\n");
  const { errors } = await checkDocumentation(root);
  assert.ok(errors.some((error) => error.includes("missing.md")));
  assert.ok(errors.some((error) => error.includes("#absent")));
  assert.ok(errors.some((error) => error.includes("Duplicate rule TEST-1")));
});

test("ignores illustrative fenced links/rules and remote links", async (t) => {
  const root = await sandbox(t);
  await writeFile(join(root, "README.md"), [
    "# Guide",
    "[Remote](https://example.com/not-fetched)",
    "````markdown",
    "```md",
    "[Example](missing.md)",
    "- **TEST-1 (MUST)** Example",
    "```",
    "- **TEST-1 (MUST)** Still inside the outer fence",
    "````",
  ].join("\n"));
  assert.deepEqual((await checkDocumentation(root)).errors, []);
});

test("rejects traversal references instead of reading outside the fixture", async (t) => {
  const root = await sandbox(t);
  await writeFile(join(root, "README.md"), "# Guide\n\n[Outside](../private.md)\n");
  assert.ok((await checkDocumentation(root)).errors.some((error) => error.includes("outside")));
});

test("never loads a project contract through a symlink outside the repository", async (t) => {
  const root = await sandbox(t);
  const elsewhere = await sandbox(t);
  await writeFile(join(elsewhere, "context.md"), await fixture("landing"));
  await symlink(join(elsewhere, "context.md"), join(root, "docs/project-context.md"));
  const { errors } = await checkKit(root);
  assert.ok(errors.some((error) => error.includes("project-context.md") && error.includes("outside")));
});

test("the checker CLI reports an invalid kit with a nonzero exit status", async (t) => {
  const root = await sandbox(t);
  const result = spawnSync(process.execPath, [new URL("./check-kit.mjs", import.meta.url).pathname, root], { encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Missing required/);
});
