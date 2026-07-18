// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
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

export default defineConfig(({ mode }) => ({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    // Lovable config only injects VITE_* — server-only secrets need explicit define.
    define: serverEnvDefine(mode),
  },
}));
