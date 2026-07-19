// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
//
// IMPORTANT: Do not pass a callback to defineConfig(). Lovable wraps function returns as
// `{ vite: userConfig }`, which silently drops top-level `tanstackStart` / `nitro` options.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

const SERVER_ENV_KEYS = [
  "SUPABASE_URL",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_SESSION_SECRET",
] as const;

function serverEnvDefine(mode: string) {
  const env = loadEnv(mode, process.cwd(), "");
  return Object.fromEntries(
    SERVER_ENV_KEYS.filter((key) => env[key]).map((key) => [
      `process.env.${key}`,
      JSON.stringify(env[key]),
    ]),
  );
}

/** Set by CI when building for https://kyun928.github.io/final-project/ */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const pagesBase = isGitHubPages ? "/final-project/" : "/";
const pagesBasepath = isGitHubPages ? "/final-project" : undefined;

export default defineConfig({
  // Nitro SSR target is for Cloudflare/Lovable. GitHub Pages is static assets only.
  ...(isGitHubPages ? { nitro: false as const } : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
    ...(pagesBasepath
      ? {
          router: { basepath: pagesBasepath },
          // Static hosting: emit SPA shell via TanStack prerender (no Nitro).
          spa: {
            enabled: true,
            // Default shell path is /_shell.html (outputPath "/" becomes ".html").
            prerender: {
              outputPath: "/_shell",
            },
          },
          prerender: {
            failOnError: false,
          },
        }
      : {}),
  },
  vite: {
    base: pagesBase,
    // Lovable config only injects VITE_* — server-only secrets need explicit define.
    define: {
      ...serverEnvDefine("production"),
      ...serverEnvDefine("development"),
      ...(isGitHubPages
        ? {
            "import.meta.env.BASE_URL": JSON.stringify(pagesBase),
          }
        : {}),
    },
  },
});
