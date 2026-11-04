import { readFile, readdir, realpath, stat } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const CAPABILITIES = [
  "ui", "public-pages", "forms", "database", "auth",
  "i18n", "url-state", "analytics", "shared-cache", "external-api",
];

const REQUIRED = [
  "README.md", "AGENTS.md", "docs/project-context.md",
  "docs/architecture/applicability.md", "docs/playbooks/adopt-project.md",
  "docs/playbooks/bootstrap-project.md", "docs/templates/project-context.md",
  "docs/templates/adoption-report.md", "docs/quality/kit-validation.md",
  "docs/operations/application-ci.md", ".github/workflows/ci.yml",
];

function outside(root, path) {
  const pathFromRoot = relative(root, path);
  return pathFromRoot === ".." || pathFromRoot.startsWith(`..${sep}`) || isAbsolute(pathFromRoot);
}

// Preserve line numbers while ignoring illustrative fenced examples.
function proseLines(source) {
  let fence;
  return source.split(/\r?\n/).map((line) => {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && marker[2].trim() === "") {
        fence = undefined;
      }
      return "";
    }
    if (marker) {
      fence = marker[1];
      return "";
    }
    return line;
  });
}

function headingAnchors(source) {
  const counts = new Map();
  const anchors = new Set();
  for (const line of proseLines(source)) {
    const heading = line.match(/^ {0,3}#{1,6}\s+(.+?)\s*#*$/);
    if (!heading) continue;
    const slug = heading[1]
      .replace(/<[^>]*>/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\p{M}_\s-]/gu, "")
      .replace(/\s/g, "-");
    const count = counts.get(slug) ?? 0;
    anchors.add(count ? `${slug}-${count}` : slug);
    counts.set(slug, count + 1);
  }
  return anchors;
}

async function markdownFiles(root) {
  const paths = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if ([".git", "node_modules", ".next", "playwright-report", "test-results"].includes(entry.name)) continue;
      const path = resolve(directory, entry.name);
      // Do not follow symlinks into another workspace or read secret env files.
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile() && entry.name.endsWith(".md")) paths.push(path);
    }
  }
  await walk(root);
  return paths.sort();
}

export function validateContext(rawSource) {
  const source = rawSource.replaceAll("\r\n", "\n");
  const errors = [];
  const fields = new Map();
  for (const match of source.matchAll(/^- \*\*([^*]+):\*\*\s*(.+)$/gm)) {
    if (fields.has(match[1])) errors.push(`Duplicate field: ${match[1]}`);
    fields.set(match[1], match[2].trim());
  }

  for (const name of ["Status", "Mode", "Kit revision", "Knowledge root", "Approval"]) {
    if (!fields.has(name)) errors.push(`Missing field: ${name}`);
  }
  const status = fields.get("Status");
  const mode = fields.get("Mode");
  if (!["proposed", "approved"].includes(status)) errors.push("Status must be proposed or approved");
  if (!["kit", "new", "existing", "undecided"].includes(mode)) errors.push("Invalid Mode");
  const knowledgeRoot = fields.get("Knowledge root") ?? "";
  if (!/^[\p{L}\p{N}\p{M}_./ -]+$/u.test(knowledgeRoot) || isAbsolute(knowledgeRoot) || knowledgeRoot.split("/").includes("..")) {
    errors.push("Knowledge root must be a repository-relative path without traversal");
  }
  if (status === "approved") {
    if (mode === "undecided") errors.push("Approved Mode cannot be undecided");
    if (!fields.get("Approval") || /pending|not approved|unapproved/i.test(fields.get("Approval"))) {
      errors.push("Approved contracts need Approval evidence");
    }
  }

  const capabilities = new Map();
  // Read only the capability table; other tables can use the same words.
  const section = source.split(/^## Capabilities[ \t]*$/m)[1]?.split(/^## /m)[0] ?? "";
  for (const line of section.split(/\r?\n/)) {
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    const [name, state, evidence] = cells;
    if (name === "Capability" || /^-+$/.test(name ?? "")) continue;
    if (!CAPABILITIES.includes(name)) {
      errors.push(`Unknown capability: ${name}`);
      continue;
    }
    if (capabilities.has(name)) errors.push(`Duplicate capability: ${name}`);
    capabilities.set(name, state);
    if (!["active", "inactive", "unknown"].includes(state)) errors.push(`Invalid state for ${name}: ${state}`);
    if (!evidence) errors.push(`Missing decision/evidence for ${name}`);
    if (status === "approved" && state === "unknown") errors.push(`Approved capability ${name} is unknown`);
    if (mode === "kit" && state !== "inactive") errors.push(`Application capability ${name} must be inactive in kit mode`);
  }
  for (const name of CAPABILITIES) {
    if (!capabilities.has(name)) errors.push(`Missing capability: ${name}`);
  }
  for (const section of ["Conventions", "Verification", "Deferred work", "Current work"]) {
    if (!source.includes(`## ${section}\n`)) errors.push(`Missing section: ${section}`);
  }
  return errors;
}

export async function checkDocumentation(directory) {
  const root = await realpath(directory);
  const errors = [];
  const rules = new Map();
  const paths = await markdownFiles(root);
  let links = 0;

  for (const path of paths) {
    const source = await readFile(path, "utf8");
    const label = relative(root, path);
    for (const [index, line] of proseLines(source).entries()) {
      const location = `${label}:${index + 1}`;
      for (const match of line.matchAll(/\*\*([A-Z]+-\d+) \((?:MUST(?: NOT)?|SHOULD(?: NOT)?)\)\*\*/g)) {
        if (rules.has(match[1])) errors.push(`${location}: Duplicate rule ${match[1]} (first: ${rules.get(match[1])})`);
        else rules.set(match[1], location);
      }
      const withoutCode = line.replace(/(`+).*?\1/g, "");
      const destinations = [
        ...Array.from(withoutCode.matchAll(/!?\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g), (match) => match[1]),
        ...Array.from(withoutCode.matchAll(/^\s*\[[^\]]+\]:\s*(\S+)/g), (match) => match[1]),
      ];
      for (const destination of destinations) {
        if (/^(?:[a-z][a-z\d+.-]*:|\/)/i.test(destination)) continue;
        links += 1;
        try {
          const [targetPart, fragment] = destination.split("#");
          const target = targetPart ? resolve(dirname(path), decodeURIComponent(targetPart)) : path;
          if (outside(root, target)) {
            errors.push(`${location}: Reference outside repository: ${destination}`);
            continue;
          }
          const canonical = await realpath(target);
          if (outside(root, canonical)) {
            errors.push(`${location}: Reference outside repository: ${destination}`);
            continue;
          }
          if (fragment && canonical.endsWith(".md")) {
            const targetSource = canonical === path ? source : await readFile(canonical, "utf8");
            if (!headingAnchors(targetSource).has(decodeURIComponent(fragment))) {
              errors.push(`${location}: Missing anchor: ${destination}`);
            }
          }
        } catch (error) {
          errors.push(`${location}: Invalid reference ${destination} (${error.code ?? error.name})`);
        }
      }
    }
  }
  return { errors, files: paths.length, links, rules: rules.size };
}

export async function checkKit(directory) {
  const root = await realpath(directory);
  const result = await checkDocumentation(root);
  for (const path of REQUIRED) {
    try {
      const target = await realpath(resolve(root, path));
      if (outside(root, target)) result.errors.push(`Required file outside repository: ${path}`);
      else if (!(await stat(target)).isFile()) result.errors.push(`Missing required file: ${path}`);
    } catch {
      result.errors.push(`Missing required file: ${path}`);
    }
  }
  for (const path of ["docs/project-context.md", "docs/templates/project-context.md"]) {
    try {
      const target = await realpath(resolve(root, path));
      if (outside(root, target)) continue; // Already reported; never read outside the target.
      const source = await readFile(target, "utf8");
      result.errors.push(...validateContext(source).map((error) => `${path}: ${error}`));
    } catch (error) {
      result.errors.push(`${path}: Cannot validate project contract (${error.code ?? error.name})`);
    }
  }
  return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const root = process.argv[2] ?? fileURLToPath(new URL("../", import.meta.url));
    const result = await checkKit(root);
    console.log(`Checked ${result.files} Markdown files, ${result.links} local references, ${result.rules} rule IDs.`);
    for (const error of result.errors) console.error(error);
    if (result.errors.length) process.exitCode = 1;
    else console.log("Kit documentation and project contracts pass.");
  } catch (error) {
    console.error(`Kit check failed: ${error.message}`);
    process.exitCode = 1;
  }
}
