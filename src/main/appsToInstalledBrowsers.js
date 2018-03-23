const appsToInstalledBrowsers = (installedApps, whiteListedBrowsers) =>
  // TODO convert to reduce?
  Object.keys(whiteListedBrowsers)
    .map(name => {
      for (let i = 0; i < installedApps.length; i++) {
        if (name === installedApps[i]) {
          return name
        }
      }
      return null
    })
    .filter(x => x) // remove empties

export default appsToInstalledBrowsers
