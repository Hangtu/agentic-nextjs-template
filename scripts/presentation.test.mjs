import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("the MIT license identifies the confirmed copyright holder and includes its grant/disclaimer", async () => {
  const license = await read("LICENSE");
  assert.match(license, /^MIT License/);
  assert.ok(license.includes("Copyright (c) 2026 frutit.app"));
  assert.ok(license.includes("Permission is hereby granted, free of charge"));
  assert.ok(license.includes("The above copyright notice and this permission notice"));
  assert.ok(license.includes('THE SOFTWARE IS PROVIDED "AS IS"'));
});

for (const name of ["cover", "mark"]) {
  test(`the original ${name} artwork is self-contained and has accessible text`, async () => {
    const svg = await read(`assets/${name}.svg`);
    assert.match(svg, /<svg\b[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    assert.match(svg, /<title\b[^>]*>[^<]+<\/title>/);
    assert.match(svg, /<desc\b[^>]*>[^<]+<\/desc>/);
    assert.match(svg, /role="img"/);
    assert.doesNotMatch(svg, /<script\b|<foreignObject\b|<!DOCTYPE|@import|@font-face|\son\w+\s*=|(?:href|src)\s*=\s*["'](?:https?:|\/\/)/i);
  });
}

test("the social preview is a compact 1280 by 640 PNG", async () => {
  const png = await readFile(new URL("assets/social-preview.png", root));
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.toString("ascii", 12, 16), "IHDR");
  assert.equal(png.readUInt32BE(16), 1280);
  assert.equal(png.readUInt32BE(20), 640);
  assert.ok(png.length < 1024 * 1024, "GitHub social preview must stay below 1 MiB");
});

test("README exposes artwork, community guidance, and application-validation limits", async () => {
  const readme = await read("README.md");
  for (const path of ["assets/cover.svg", "CONTRIBUTING.md", "SECURITY.md", "CODE_OF_CONDUCT.md", "LICENSE", "docs/quality/kit-validation.md"]) {
    assert.ok(readme.includes(path), path);
  }
  assert.ok(readme.includes("node scripts/verify-kit.mjs"));
  assert.ok(readme.includes("https://github.com/Hangtu/agentic-nextjs-template/actions/workflows/ci.yml/badge.svg"));
});

test("community entry points exist without requiring application infrastructure", async () => {
  for (const path of ["CONTRIBUTING.md", "SECURITY.md", "CODE_OF_CONDUCT.md", "assets/README.md"]) {
    assert.ok((await read(path)).trim().length > 0, path);
  }
  for (const name of ["bug-report", "feature-request", "adoption-feedback"]) {
    const form = await read(`.github/ISSUE_TEMPLATE/${name}.yml`);
    assert.match(form, /^name:/m);
    assert.match(form, /^description:/m);
    assert.match(form, /^body:/m);
  }
});

test("adoption retains the source license without replacing the application's license", async () => {
  const adoption = await read("docs/playbooks/adopt-project.md");
  assert.ok(adoption.includes("<knowledge-root>/LICENSE"));
  assert.ok(adoption.includes("application's license"));
});
