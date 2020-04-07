import { ipcRenderer } from 'electron'
import * as mousetrap from 'mousetrap'
import { useEffect, useState } from 'react'

import { Browser } from '../../config/browsers'
import { BROWSERS_SET } from '../../config/events'
import { runBrowser } from '../sendToMain'

const useBrowsers = (): Browser[] => {
  const [browsers, setBrowsers] = useState<Browser[]>([])

  useEffect(() => {
    ipcRenderer.on(BROWSERS_SET, (_: unknown, installedBrowsers: Browser[]) => {
      // setup hotkeys
      installedBrowsers.forEach((browser, i) => {
        if (i === 0) {
          mousetrap.unbind(['enter', 'option+enter', 'space', 'option+space'])
          mousetrap.bind(
            ['enter', 'option+enter', 'space', 'option+space'],
            (evt) => {
              // When a browser has been selected with the mouse, it gets (invisible) focus.
              // This means when enter is pressed next, it will activate the focused browser AND fire
              // this key binding, causing two identical tabs to open in the selected browser.
              // This fixes that.
              evt.preventDefault()
              runBrowser(browser.id)
            },
          )
        }

        if (browser.hotKey) {
          mousetrap.bind(
            [browser.hotKey, `option+${browser.hotKey}`],
            (evt) => {
              evt.preventDefault()
              runBrowser(browser.id)
            },
          )
        }
      })
      setBrowsers(installedBrowsers)
    })

    return function cleanup() {
      ipcRenderer.removeAllListeners(BROWSERS_SET)
    }
  }, [])

  return browsers
}

export default useBrowsers
