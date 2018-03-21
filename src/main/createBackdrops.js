import { BrowserWindow, screen } from 'electron'

import emitter from './emitter'

let coverWindows = []

function createBackdrops() {
  return new Promise((resolve, reject) => {
    const displays = screen.getAllDisplays()

    displays.forEach(display => {
      const win = new BrowserWindow({
        frame: false,
        alwaysOnTop: true,
        show: false,
        transparent: true,
        resizable: false,
        movable: false,
        minimizable: false,
        maximizable: false,
        closable: false,
        focusable: false,
        acceptFirstMouse: true,
        hasShadow: false
      })

      coverWindows.push(win)

      win.setPosition(display.workArea.x, display.workArea.y, false)

      win.setSize(display.workArea.width, display.workArea.height, false)

      // win.setOpacity(0.4)

      win.loadURL(`file://${__dirname}/../renderers/cover/cover.html`)

      win.on('close', e => {
        e.preventDefault()
        win.hide()
      })

      win.once('ready-to-show', () => {
        // win.webContents.openDevTools()
        resolve()
      })

      emitter.on('incomingURL', () => {
        win.show()
      })
    })
  })
}

export default createBackdrops
