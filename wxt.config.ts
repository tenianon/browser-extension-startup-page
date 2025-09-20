import tailwindcss from '@tailwindcss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  imports: false,
  manifest: {
    permissions: ['tabs', 'webNavigation', 'scripting'],
    host_permissions: ['https://*.bing.com/*', 'https://*.google.com/*'],
  },
  filterEntrypoints: ['newtab'],
  outDir: 'build',
  outDirTemplate: `v${process.env.npm_package_version}`,
  vite: () => ({
    plugins: [tailwindcss(), vueJsx()],
  }),
})
