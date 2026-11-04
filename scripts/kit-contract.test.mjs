import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("kit CI validates the kit without an application manifest or pnpm", async () => {
  const workflow = await read(".github/workflows/ci.yml");
  assert.match(workflow, /run: node scripts\/verify-kit\.mjs/);
  assert.doesNotMatch(workflow, /pnpm\/action-setup|run: pnpm|postgres:/);
});

test("README routes adoption through a read-only diagnosis before copying", async () => {
  const readme = await read("README.md");
  assert.match(readme, /playbooks\/adopt-project\.md/);
  assert.doesNotMatch(readme, /copy \*\*everything in this folder\*\*/i);
});

test("the kit entry point does not infer bootstrap from package.json alone", async () => {
  const agents = await read("AGENTS.md");
  assert.match(agents, /project-context\.md/);
  assert.doesNotMatch(agents, /If there is no `package\.json` yet/);
});

test("the JSON-LD rule requires an actual script-safe escape", async () => {
  const seo = await read("docs/discoverability/seo.md");
  assert.doesNotMatch(seo, /escaped as `<`/);
  assert.match(seo, /\\\\u003c/);
});

test("the documented serializer blocks script termination and preserves the data", async () => {
  const seo = await read("docs/discoverability/seo.md");
  const source = seo.match(/```js\n(function serializeJsonLd[\s\S]*?)\n```/)?.[1];
  assert.ok(source, "The canonical serializer must remain executable in the documentation");
  const serialize = runInNewContext(`${source}; serializeJsonLd`, {}, { timeout: 100 });
  const payload = { name: "</script><script>alert('x')</script>", text: "< & >" };
  const result = serialize(payload);
  assert.ok(!result.includes("<"));
  assert.deepEqual(JSON.parse(result), payload);
  assert.throws(() => serialize(undefined));
});

test("public-action infrastructure has no mandatory auth import", async () => {
  const actions = await read("docs/backend/server-actions.md");
  const helper = actions.match(/```ts\n\/\/ src\/server\/action\.ts([\s\S]*?)\n```/)?.[1];
  assert.ok(helper);
  assert.ok(!helper.includes("@/server/auth/"), "Public actions must not require an installed auth provider");
  assert.match(helper, /if \(definition\.access === "authenticated"\)/);
});

test("private mutation references acquire the actor instead of accepting an arbitrary actor ID", async () => {
  const mutations = await read("docs/backend/server-actions.md");
  const reference = await read("docs/architecture/reference-feature.md");
  assert.doesNotMatch(mutations, /function archiveProject\([^\n]*actorId/);
  assert.match(mutations, /const user = await requireActor\(\)/);
  assert.doesNotMatch(reference, /function createProject\([^\n]*ownerId/);
});

test("API pagination matches the reference query's page and sortBy contract", async () => {
  const api = await read("docs/backend/api-routes.md");
  const schema = api.match(/const listQuerySchema = z\.object\(\{([\s\S]*?)\}\)/)?.[1];
  assert.ok(schema);
  assert.match(schema, /page:/);
  assert.match(schema, /sortBy:/);
  assert.doesNotMatch(schema, /cursor:|limit:/);
});

test("the shared URL parser exports the sort type used by the reference query", async () => {
  const state = await read("docs/standards/state-management.md");
  assert.ok(/export type ProjectSort\s*=/.test(state), "Reference ProjectSort must be exported by the shared parser");
});

test("a docs-only repository has a runnable verification entry point", async () => {
  const script = await read("scripts/verify-kit.mjs");
  assert.match(script, /check-kit\.mjs/);
  assert.match(script, /--test/);
});
