<img src="./docs/icon_squooshed.png" alt="logo" width="100" height="100" align="right" />

# Browserosaurus

If you enjoy using Browserosaurus, please consider supporting its continued
development.

Browserosaurus is an open-source (MIT license), Electron-based browser prompter
for macOS. It works by setting itself as the default browser; any clicked links
in non-browser apps are now sent to Browserosaurus where it’ll present you with
a menu of all your installed browsers. You may now decide which browser you’d
like to continue opening the link with.

**Currently supports macOS 10.15.1**

## Development

Ensure you are running the correct version of Node. The repo includes an
`.nvmrc` file that includes the version number I use.

Get repo:

```
git clone git@github.com:will-stone/browserosaurus.git
```

Move to folder:

```
cd browserosaurus
```

Make sure you have access to FontAwesome Pro:

https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers#installing-pro

Install dependencies:

```
yarn
```

Run Browserosaurus in dev mode:

```
yarn start
```

### Finding bundle identifier for an app

```sh
mdls -name kMDItemCFBundleIdentifier -r /Applications/Firefox.app
```

### Browser logos

The browser logos are provided by an excellent project by
[Cătălin Mariș](https://github.com/alrra):
https://github.com/alrra/browser-logos

### Make icon.icns

To build an icns file (app icon) from `src/images/icon/icon.png`, simply run
`yarn run icns`.

## Publishing

App is published on GitHub, the following command will prompt to bump version
number, package, notarize, and make installers:

```
yarn release
```

The dmg and zip files can then be added to a GitHub release. **Remember to bump
the docs (website) version number too.**
