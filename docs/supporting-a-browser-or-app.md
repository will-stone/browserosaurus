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

### Finding bundle identifier for an app

When Browserosaurus loads, it looks for which apps you have installed based on
an
[allowed list](https://github.com/will-stone/browserosaurus/blob/master/src/config/apps.ts)
of bundle identifiers. To find the ID of the app you'd like added, open your
Terminal.app and run the following:

```sh
mdls -name kMDItemCFBundleIdentifier -r /PATH/TO/APP.app
```

For example, most apps are installed to `/Applications`:

```sh
mdls -name kMDItemCFBundleIdentifier -r /Applications/Firefox.app
```

In this case, you should receive an identifier that looks something like this:

```
org.mozilla.firefox
```

### Adding the entry to Browserosaurus

Using your text editor (I recommend
[Visual Studio Code](https://code.visualstudio.com/)), open the
`/src/config/apps.ts` file. After all the import statements, you'll see an
`apps` object that contains all of the apps that Browserosaurus can find on a
user's system. The key to each app object is the bundle identifier, so start by
adding your new app to the list, and give it a name:

```ts
export const apps = {
  // ...
  'org.mozilla.firefox': {
    name: 'Firefox',
  },
  // ...
} as const
```

> ℹ️ The app objects within the root `apps` object should be in alphabetical
> order by the `name` key. There's a test that will check for this. We'll
> discuss running tests below.

### Adding a logo

All apps must have a logo, that you will no doubt have seen displayed in the
tiles window, when Browserosaurus shows. Most browser logos can be installed
from an excellent project that contains
[almost all browser logos](https://github.com/alrra/browser-logos) by
[Cătălin Mariș](https://github.com/alrra).

Following our example of using Firefox, the command to add the Firefox logo
would be:

```sh
npm i @browser-logos/firefox
```

If you find the browser you'd like to add is not supported by Cătălin's project,
or you're not adding a browser at all, you'll need to source the logo yourself.
Please find a suitable 128x128 pixel logo and place it in the `src/config/logos`
folder.

Import the browser from the location where you've installed it, and add it to a
`logo` key in your app's object:

```ts
import firefox from '@browser-logos/firefox/firefox_128x128.png'

export const apps = {
  // ...
  'org.mozilla.firefox': {
    name: 'Firefox',
    logo: firefox,
  },
  // ...
} as const
```

That's all there is to it. Run your updated code using `npm start`, and see if
it behaves how you would expect.

## Extras

### Private / Incognito Mode

Some browsers support opening in a _private_ or _incognito_ mode. Browserosaurus
can be set to open the given URL in private mode when holding the
<kbd>shift</kbd> key and clicking the tile or using the hotkey. If you'd like to
support this with your added browser, you will need to find the
[command-line argument](https://en.wikipedia.org/wiki/Command-line_interface#Arguments)
that your browser uses when opening URLs from the command-line. In the case of
Firefox this is `--private-window`:

```ts
export const apps = {
  // ...
  'org.mozilla.firefox': {
    name: 'Firefox',
    logo: firefox,
    privateArg: '--private-window',
  },
  // ...
} as const
```

### URL Template

If you're adding an app that uses a different protocol, where the URL is just a
parameter, you can use a URL template. The token `{{URL}}` in the string will be
replaced with the incoming URL. For example, the Pocket app is set like so:

```ts
export const apps = {
  // ...
  'com.readitlater.PocketMac': {
    name: 'Pocket',
    urlTemplate: 'pocket://add?url={{URL}}',
    logo: pocket,
  },
  // ...
} as const
```

## Testing

There are a few tests that will check the compatibility of your `apps.ts` file.
Run `npm test` and make sure all tests successfully pass. If any tests fail, and
you are unsure about the results, please submit your changes anyway and we can
discuss it on the pull request page.

## Submit your changes

Commit and push your changes to your GitHub fork of Browserosaurus, then open a
[pull request](https://github.com/will-stone/browserosaurus/pulls) to merge your
branch into Browserosaurus' `master` branch.
