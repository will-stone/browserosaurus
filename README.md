# Browserosaurus

Browserosaurus is an open-source (MIT license), Electron-based browser prompter for macOS. It works by setting itself as the default browser; any clicked links in non-browser apps are now sent to Browserosaurus where it’ll present you with a menu of all your installed browsers. You may now decide which browser you’d like to continue opening the link with.

## Development

Get repo:

```
git clone git@github.com:will-stone/browserosaurus.git
```

Move to folder:

```
cd browserosaurus
```

Install dependencies:

```
yarn install
```

Build the CSS:

```
yarn build-css
```

Run Browserosaurus in dev mode:

```
yarn start
```

Package and make installer:

```
yarn run make
```

### Browser logos

https://github.com/alrra/browser-logos

### Make icon.icns

To build an icns file from `src/images/icon/icon.png`, simply run `yarn run icns`.
