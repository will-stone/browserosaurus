import { ipcRenderer } from 'electron'
import * as mousetrap from 'mousetrap'
import { useEffect, useState } from 'react'

import { BrowserName, browsers } from '../../config/browsers'
import { BROWSER_RUN, BROWSERS_SET, FAV_SET } from '../../config/events'

export const useBrowsers = (): BrowserName[] => {
  const [browserNames, setBrowserNames] = useState<BrowserName[]>([])
  const [favName, setFavName] = useState<BrowserName>('Safari')

  useEffect(() => {
    ipcRenderer.on(FAV_SET, (_: unknown, name: BrowserName) => {
      setFavName(name)
      mousetrap.unbind(['enter', 'option+enter', 'space', 'option+space'])
      name &&
        mousetrap.bind(
          ['enter', 'option+enter', 'space', 'option+space'],
          e => {
            // When a browser has been selected with the mouse, it gets (invisible) focus.
            // This means when enter is pressed next, it will activate the focused browser AND fire
            // this key binding, causing two identical tabs to open in the selected browser.
            // This fixes that.
            e.preventDefault()
            ipcRenderer.send(BROWSER_RUN, name)
          },
        )
    })

    return function cleanup() {
      ipcRenderer.removeAllListeners(FAV_SET)
    }
  }, [])

  useEffect(() => {
    ipcRenderer.on(
      BROWSERS_SET,
      (_: unknown, installedBrowserNames: BrowserName[]) => {
        // setup hotkeys
        installedBrowserNames.forEach(browserName => {
          const browser = browsers[browserName]
          if (browser && browser.hotKey) {
            mousetrap.bind([browser.hotKey, 'option+' + browser.hotKey], e => {
              e.preventDefault()
              ipcRenderer.send(BROWSER_RUN, browserName)
            })
          }
        })
        setBrowserNames(installedBrowserNames)
      },
    )

    return function cleanup() {
      ipcRenderer.removeAllListeners(BROWSERS_SET)
    }
  }, [])

  return [favName, ...browserNames.filter(name => name !== favName)]
}
