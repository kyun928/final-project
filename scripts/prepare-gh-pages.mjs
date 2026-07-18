/**
 * Prepares a GitHub Pages–compatible static folder from a TanStack Start build.
 *
 * This app is SSR/Cloudflare-oriented, so `.output/public` has assets but no
 * index.html. For project Pages (https://user.github.io/repo/) we emit a SPA
 * shell that loads the client bundle and copies 404.html for client routing.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const publicDir = resolve(root, ".output/public");
const outDir = resolve(root, "gh-pages");
const base = "/final-project/";

function findClientEntry(assetsDir) {
  const files = readdirSync(assetsDir);
  const preferred =
    files.find((name) => /^index-.*\.js$/.test(name)) ||
    files.find((name) => /^entry-client.*\.js$/.test(name)) ||
    files.find((name) => /client.*\.js$/.test(name) && !name.includes("server"));
  return preferred ?? null;
}

function findMainCss(assetsDir) {
  const files = readdirSync(assetsDir);
  return files.find((name) => /^styles-.*\.css$/.test(name)) ?? files.find((name) => name.endsWith(".css"));
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

if (!existsSync(publicDir)) {
  console.error("Missing .output/public — run `npm run build` first.");
  process.exit(1);
}

const assetsDir = join(publicDir, "assets");
if (!existsSync(assetsDir)) {
  console.error("Missing .output/public/assets");
  process.exit(1);
}

const entryJs = findClientEntry(assetsDir);
if (!entryJs) {
  console.error("Could not find client entry JS in assets/");
  process.exit(1);
}

const css = findMainCss(assetsDir);
const cssTag = css ? `<link rel="stylesheet" href="${base}assets/${css}" />` : "";

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
    <script>
      // Help client code detect GitHub Pages base path.
      window.__GITHUB_PAGES_BASE__ = ${JSON.stringify(base)};
    </script>
    <script type="module" crossorigin src="${base}assets/${entryJs}"></script>
  </body>
</html>
`;

rmSync(outDir, { recursive: true, force: true });
copyDir(publicDir, outDir);
writeFileSync(join(outDir, "index.html"), html, "utf8");
writeFileSync(join(outDir, "404.html"), html, "utf8");

// GitHub Pages: treat this as a project site, not a Jekyll site.
writeFileSync(join(outDir, ".nojekyll"), "", "utf8");

console.log("Prepared gh-pages/");
console.log("  entry:", entryJs);
if (css) console.log("  css:", css);
console.log("  base:", base);
