import { defineConfig } from 'tsx/config'

export default defineConfig({
  // Configuración para resolver problemas con rutas en Windows
  compilerOptions: {
    // Forzar resolución de módulos
    moduleResolution: 'node',
    allowImportingTsExtensions: false,
  },
  // Configuración experimental para ESM
  experimentalLoader: true,
})
