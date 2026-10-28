import { defineConfig, loadEnv } from 'vite'

// API tests talk to the real Supabase project through its public API, the same
// way the site does. They read .env (site keys) and .env.test (the secret key
// used only to create and delete test accounts). See tests/api/README.md.
export default defineConfig(({ mode }) => ({
  test: {
    include: ['tests/**/*.test.js'],
    environment: 'node',
    env: loadEnv(mode, process.cwd(), ''),
    testTimeout: 30000,
    hookTimeout: 30000,
    fileParallelism: false,
  },
}))
