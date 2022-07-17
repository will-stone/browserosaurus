module.exports = {
  packagerConfig: {
    appBundleId: 'com.browserosaurus',
    asar: true,
    appCategoryType: 'public.app-category.developer-tools',
    packageManager: 'npm',
    extendInfo: 'plist/Info.plist',
    osxSign: {
      'gatekeeper-assess': false,
      'hardened-runtime': true,
      'entitlements': 'plist/entitlements.mac.plist',
      'entitlements-inherit': 'plist/entitlements.mac.plist',
    },
    icon: 'src/shared/static/icon/icon.icns',
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
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack.main.config.cjs',
        renderer: {
          config: './webpack.renderer.config.cjs',
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
      },
    ],
    [
      '@timfish/forge-externals-plugin',
      {
        externals: ['file-icon'],
        includeDeps: true,
      },
    ],
  ],
}
