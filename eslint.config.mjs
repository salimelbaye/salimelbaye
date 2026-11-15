import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// Replaces `next lint` and .eslintrc.json, both removed in Next.js 16.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // eslint-config-next's own defaults, restated because this list replaces them.
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Cloudflare build output, local state, and generated binding types.
    '.open-next/**',
    '.wrangler/**',
    'worker-configuration.d.ts',
  ]),
]);
