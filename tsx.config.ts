import { defineConfig } from 'tsx'

export default defineConfig({
  compilerOptions: {
    moduleResolution: 'node',
    allowImportingTsExtensions: false,
  },
  experimentalLoader: true,
})
