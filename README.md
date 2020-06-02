# Browserosaurus

If you enjoy using Browserosaurus, please consider supporting its continued
development.

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Z8Z7V0KF)

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

Prepare for publishing:

```
yarn package
yarn notarize
yarn make
```

### Finding bundle identifier (`appId`) for an app

```sh
mdls -name kMDItemCFBundleIdentifier -r /Applications/Firefox.app
```

### Browser logos

The browser logos are provided by an excellent project by
[Cătălin Mariș](https://github.com/alrra):
https://github.com/alrra/browser-logos

### Make icon.icns

To build an icns file from `src/images/icon/icon.png`, simply run
`yarn run icns`.
