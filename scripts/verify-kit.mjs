import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const files = (await readdir(new URL("./", import.meta.url)))
  .filter((name) => name.endsWith(".mjs")).sort();

function run(args) {
  console.log(`\n> node ${args.join(" ")}`);
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: "inherit" });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

for (const file of files) run(["--check", `scripts/${file}`]);
run(["scripts/check-kit.mjs"]);
run(["--test", ...files.filter((file) => file.endsWith(".test.mjs")).map((file) => `scripts/${file}`)]);
