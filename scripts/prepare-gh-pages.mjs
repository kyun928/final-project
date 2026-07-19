/**
 * Prepares a GitHub Pages–compatible static folder from a TanStack Start build.
 *
 * GITHUB_PAGES builds use `nitro: false` + SPA mode → client assets in dist/client
 * (and `_shell.html`). Cloudflare/Lovable builds keep Nitro → `.output/public`.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const candidatePublicDirs = [
  resolve(root, "dist/client"),
  resolve(root, ".output/public"),
];
const publicDir = candidatePublicDirs.find((dir) => existsSync(dir));
const outDir = resolve(process.env.GH_PAGES_OUT || join(root, "gh-pages"));
const base = "/final-project/";

function findClientEntry(assetsDir) {
  const files = readdirSync(assetsDir);
  return (
    files.find((name) => /^index-.*\.js$/.test(name)) ||
    files.find((name) => /^entry-client.*\.js$/.test(name)) ||
    null
  );
}

function findMainCss(assetsDir) {
  const files = readdirSync(assetsDir);
  return (
    files.find((name) => /^styles-.*\.css$/.test(name)) ??
    files.find((name) => name.endsWith(".css"))
  );
}

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const from = join(src, entry.name);
    const to = join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else copyFileSync(from, to);
  }
}

function clearDir(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

if (!publicDir) {
  console.error(
    "Missing dist/client or .output/public — run `GITHUB_PAGES=true npm run build` first.",
  );
  process.exit(1);
}

const assetsDir = join(publicDir, "assets");
if (!existsSync(assetsDir)) {
  console.error("Missing assets/ in", publicDir);
  process.exit(1);
}

try {
  rmSync(outDir, { recursive: true, force: true });
} catch {
  try {
    clearDir(outDir);
  } catch (error) {
    console.warn("Could not fully clean output dir:", error.message);
  }
}
mkdirSync(outDir, { recursive: true });
copyDir(publicDir, outDir);

const shellCandidates = [
  join(outDir, "_shell.html"),
  join(outDir, "index.html"),
  join(outDir, ".html"),
];
const shellSrc = shellCandidates.find((p) => existsSync(p));
const indexPath = join(outDir, "index.html");

if (shellSrc && shellSrc !== indexPath) {
  copyFileSync(shellSrc, indexPath);
  console.log("Copied SPA shell → index.html from", shellSrc.replace(outDir, "."));
} else if (!existsSync(indexPath)) {
  const entryJs = findClientEntry(assetsDir);
  if (!entryJs) {
    console.error("No SPA shell and no client entry JS found.");
    process.exit(1);
  }
  const css = findMainCss(assetsDir);
  const cssTag = css
    ? `<link rel="stylesheet" href="${base}assets/${css}" />`
    : "";
  const html = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>와이즈인컴퍼니 | 데이터 분석 및 AI 솔루션 전문기업</title>
    <meta
      name="description"
      content="와이즈인컴퍼니는 데이터 분석, AI 솔루션, 데이터·AI 교육, B2C 플랫폼 개발을 제공하는 데이터·AI 전문기업입니다."
    />
    <link rel="icon" href="${base}favicon.ico" />
    ${cssTag}
  </head>
  <body>
    <div id="root"></div>
    <script>window.__GITHUB_PAGES_BASE__ = ${JSON.stringify(base)};</script>
    <script type="module" crossorigin src="${base}assets/${entryJs}"></script>
  </body>
</html>
`;
  writeFileSync(indexPath, html, "utf8");
  console.log("Synthesized fallback index.html");
}

// Fix absolute asset paths if the shell was prerendered with a wrong base.
let html = readFileSync(indexPath, "utf8");
if (!html.includes(base) && html.includes('href="/assets/')) {
  html = html
    .replaceAll('href="/assets/', `href="${base}assets/`)
    .replaceAll('src="/assets/', `src="${base}assets/`)
    .replaceAll('href="/favicon', `href="${base}favicon`);
  writeFileSync(indexPath, html, "utf8");
  console.log("Rewrote asset URLs for project Pages base path");
}

copyFileSync(indexPath, join(outDir, "404.html"));
writeFileSync(join(outDir, ".nojekyll"), "", "utf8");

// Clean junk from SPA path bugs / nitro leftovers
for (const junk of [".html", "_headers"]) {
  const junkPath = join(outDir, junk);
  if (existsSync(junkPath)) {
    try {
      rmSync(junkPath, { force: true });
    } catch {
      /* ignore */
    }
  }
}

const assetCount = readdirSync(join(outDir, "assets")).length;
console.log("Prepared", outDir);
console.log("  source:", publicDir);
console.log("  assets:", assetCount);
console.log("  base:", base);
console.log("OUT_DIR=" + outDir);
