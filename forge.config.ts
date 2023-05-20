import { MakerZIP } from '@electron-forge/maker-zip'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'
import type { ForgeConfig } from '@electron-forge/shared-types'

import { mainConfig } from './webpack.main.config'
import { rendererConfig } from './webpack.renderer.config'

const config: ForgeConfig = {
  makers: [new MakerZIP({}, ['darwin'])],
  packagerConfig: {
    appBundleId: 'com.browserosaurus',
    appCategoryType: 'public.app-category.developer-tools',
    asar: false,
    extendInfo: 'plist/Info.plist',
    icon: 'src/shared/static/icon/icon.icns',
    osxNotarize: process.env.CI
      ? undefined
      : {
          keychain: '~/Library/Keychains/login.keychain-db',
          keychainProfile: 'AC_PASSWORD',
          tool: 'notarytool',
        },
    osxSign: process.env.CI
      ? undefined
      : {
          optionsForFile: () => ({
            'entitlements': 'plist/entitlements.mac.plist',
            'hardened-runtime': true,
          }),
        },
    protocols: [
      {
        name: 'HTTP link',
        schemes: ['http', 'https'],
      },
      {
        name: 'File',
        schemes: ['file'],
      },
    ],
  },
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/renderers/picker/index.html',
            js: './src/renderers/picker/index.tsx',
            name: 'picker_window',
            preload: {
              js: './src/renderers/shared/preload.ts',
            },
          },
          {
            html: './src/renderers/prefs/index.html',
            js: './src/renderers/prefs/index.tsx',
            name: 'prefs_window',
            preload: {
              js: './src/renderers/shared/preload.ts',
            },
          },
        ],
      },
    }),
    {
      config: {
        externals: ['file-icon'],
        includeDeps: false,
      },
      name: '@timfish/forge-externals-plugin',
    },
  ],
}

export default config
