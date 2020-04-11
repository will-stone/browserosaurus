import { ipcRenderer } from 'electron'
import * as mousetrap from 'mousetrap'
import { useEffect, useState } from 'react'

import { BrowserProfile, browsers } from '../../config/browsers'
import { BROWSER_RUN, BROWSERS_SET, FAV_SET } from '../../config/events'

const useBrowsers = (): BrowserProfile[] => {
  const [browserProfiles, setBrowserProfiles] = useState<BrowserProfile[]>([])
  const [favProfile, setFav] = useState<BrowserProfile>({ browserName: 'Safari' })

  useEffect(() => {
    ipcRenderer.on(FAV_SET, (_: unknown, fav: BrowserProfile) => {
      setFav(fav)
      mousetrap.unbind(['enter', 'option+enter', 'space', 'option+space'])
      if (fav.browserName) {
        mousetrap.bind(
          ['enter', 'option+enter', 'space', 'option+space'],
          (evt) => {
            // When a browser has been selected with the mouse, it gets (invisible) focus.
            // This means when enter is pressed next, it will activate the focused browser AND fire
            // this key binding, causing two identical tabs to open in the selected browser.
            // This fixes that.
            evt.preventDefault()
            ipcRenderer.send(BROWSER_RUN, fav)
          },
        )
      }
    })

    return function cleanup() {
      ipcRenderer.removeAllListeners(FAV_SET)
    }
  }, [])

  useEffect(() => {
    ipcRenderer.on(
      BROWSERS_SET,
      (_: unknown, installedBrowserProfiles: BrowserProfile[]) => {
        // setup hotkeys
        installedBrowserProfiles.forEach((browserProfile) => {
          const browser = browsers[browserProfile.browserName]
          if (browser.hotKey) {
            mousetrap.bind(
              [browser.hotKey, `option+${browser.hotKey}`],
              (evt) => {
                evt.preventDefault()
                ipcRenderer.send(BROWSER_RUN, browserProfile)
              },
            )
          }
        })
        setBrowserProfiles(installedBrowserProfiles)
      },
    )

    return function cleanup() {
      ipcRenderer.removeAllListeners(BROWSERS_SET)
    }
  }, [])

  return [favProfile, ...browserProfiles.filter((browser) =>
    browser.browserName !== favProfile.browserName && browser.profile !== favProfile.profile
  )]
}

export default useBrowsers
