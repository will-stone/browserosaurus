# Supporting a browser or app

Adding and maintaining the available browsers and apps is a community effort; I
have now added support for all the browsers that I use, and any newly requested
apps are either too niche or behind pay walls. However, by following this
document you can add the browser yourself and submit it to be included in
Browserosaurus. Don't worry, even if you've never contributed to an open source
project before, I'll take you through the steps of how to add support for a new
browser, and if something is confusing or you'd like a little extra help, please
[ask on the discussions forum](https://github.com/will-stone/browserosaurus/discussions/categories/q-a),
or even send a
[pull request](https://github.com/will-stone/browserosaurus/pulls) to improve
this documentation.

> 🚨 Any apps that receive an issue and are not fixed via a pull request, will
> be removed from subsequent releases.

## Prerequisite

Fork the project to your GitHub account, and then make sure you are
[set-up for development](./setting-up-for-development.md).

## Adding a new browser

Using your text editor (I recommend
[Visual Studio Code](https://code.visualstudio.com/)), open the
`/src/config/apps.ts` file. After all the import statements, you'll see an
`apps` object that contains all of the apps that Browserosaurus can find on a
user's system. The key to each app object is the app name (as written in the
`/Applications` folder). Add your new app to the list:

```ts
export const apps = typeApps({
  // ...
  Firefox: {},
  // ...
})
```

> ℹ️ The app objects within the root `apps` object should be in alphabetical.
> There's an ESLint rule that will check for this.

That's all there is to it. Run your updated code using `npm start`, and see if
it behaves how you would expect.

## Extras

### Private / Incognito Mode

Some browsers support opening in a _private_ or _incognito_ mode. Browserosaurus
can be set to open the given URL in private mode when holding the
<kbd>shift</kbd> key and clicking an app icon or using its hotkey. If you'd like
to support this with your added browser, you will need to find the
[command-line argument](https://en.wikipedia.org/wiki/Command-line_interface#Arguments)
that your browser uses when opening URLs from the command-line. In the case of
Firefox this is `--private-window`:

```ts
export const apps = typeApps({
  // ...
  Firefox: {
    privateArg: '--private-window',
  },
  // ...
})
```

### URL Template

If you're adding an app that uses a different protocol, where the URL is just a
parameter, you can use `convertUrl`. For example, the Pocket app is set like so:

```ts
export const apps = typeApps({
  // ...
  Pocket: {
    convertUrl: (url) => `pocket://add?url=${url}`,
  },
  // ...
})
```

## Testing

There are a few tests that will check the compatibility of your `apps.ts` file.
Run `npm test` and make sure all tests successfully pass. If any tests fail, and
you are unsure about the results, please submit your changes anyway and we can
discuss it on the pull request page.

## Submit your changes

Commit and push your changes to your GitHub fork of Browserosaurus, then open a
[pull request](https://github.com/will-stone/browserosaurus/pulls) to merge your
branch into Browserosaurus' `main` branch.
