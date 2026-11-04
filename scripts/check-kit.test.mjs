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
