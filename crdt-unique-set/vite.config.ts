/// <reference types="vitest" />

import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    /* Use global to avoid globals imports (describe, test, expect): */
    globals: true,
    includeSource: ['src/**/*.{js,ts}'],
  },
  define: {
    'import.meta.vitest': 'undefined',
  },
})