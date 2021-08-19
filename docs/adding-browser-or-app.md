# Adding support for a browser or app

Adding and maintaining the available browsers and apps is now a community
effort; I have now added support for all the browsers that I use, so if you
would like a new app added (or there's an issue with a current app), please
follow these steps.

### Finding bundle identifier for an app

```sh
mdls -name kMDItemCFBundleIdentifier -r /Applications/Firefox.app
```

### Browser logos

The browser logos are provided by an excellent project by
[Cătălin Mariș](https://github.com/alrra):
https://github.com/alrra/browser-logos
