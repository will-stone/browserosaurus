const getBrowsersDetails = (installedBrowsers, whiteListedBrowsers) =>
  installedBrowsers.map(name => ({
    name,
    key: whiteListedBrowsers[name].key,
    alias: whiteListedBrowsers[name].alias || null,
    enabled: true
  }))

export default getBrowsersDetails
