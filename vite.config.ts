import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

const nodeModules = String.raw`node_modules[\\/]`

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: new RegExp(
                `${nodeModules}(react|react-dom|scheduler)[\\/]`,
              ),
              priority: 60,
            },
            {
              name: 'tanstack-vendor',
              test: new RegExp(`${nodeModules}@tanstack[\\/]`),
              priority: 50,
            },
            {
              name: 'trpc-vendor',
              test: new RegExp(`${nodeModules}@trpc[\\/]`),
              priority: 40,
            },
            {
              name: 'ui-vendor',
              test: new RegExp(
                `${nodeModules}(@radix-ui|radix-ui|lucide-react|sonner|vaul)[\\/]`,
              ),
              priority: 30,
            },
            {
              name: 'shared-vendor',
              test: new RegExp(
                `${nodeModules}(clsx|class-variance-authority|superjson|tailwind-merge|zod)[\\/]`,
              ),
              priority: 20,
            },
          ],
        },
      },
    },
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
})

export default config
