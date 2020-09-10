import { ipcRenderer } from 'electron'
import ReactTooltip from 'react-tooltip'

import { App } from '../config/types'
import { Hotkeys } from '../main/store'

export const APP_SELECTED = 'APP_SELECTED'
export interface OpenAppArguments {
  url: string
  appId: App['id'] | undefined
  isAlt: boolean
}
export function selectApp(arguments_: OpenAppArguments): void {
  ipcRenderer.send(APP_SELECTED, arguments_)
}

export const COPY_TO_CLIPBOARD = 'COPY_TO_CLIPBOARD'
export const copyUrl = (url: string): void =>
  ipcRenderer.send(COPY_TO_CLIPBOARD, url)

export const FAV_SELECTED = 'FAV_SELECTED'
export const selectFav = (id: App['id']): void =>
  ipcRenderer.send(FAV_SELECTED, id)

export const HOTKEYS_UPDATED = 'HOTKEYS_UPDATED'
export const updateHotkeys = (hotkeys: Hotkeys): void =>
  ipcRenderer.send(HOTKEYS_UPDATED, hotkeys)

export const HIDE_WINDOW = 'HIDE_WINDOW'
export const hideWindow = (): void => {
  ReactTooltip.hide()
  ipcRenderer.send(HIDE_WINDOW)
}

export const MAIN_LOG = 'MAIN_LOG'
export const mainLog = (string: string): void =>
  ipcRenderer.send(MAIN_LOG, string)

export const UPDATE_RESTART = 'UPDATE_RESTART'
export const updateRestart = (): void => ipcRenderer.send(UPDATE_RESTART)

export const QUIT = 'QUIT'
export const quit = (): void => ipcRenderer.send(QUIT)

export const SET_AS_DEFAULT_BROWSER = 'SET_AS_DEFAULT_BROWSER'
export const setAsDefaultBrowser = (): void =>
  ipcRenderer.send(SET_AS_DEFAULT_BROWSER)

export const RELOAD = 'RELOAD'
export const reload = (): void => ipcRenderer.send(RELOAD)

export const UPDATE_HIDDEN_TILE_IDS = 'UPDATE_HIDDEN_TILE_IDS'
export const updateHiddenTileIds = (tileIds: string[]): void =>
  ipcRenderer.send(UPDATE_HIDDEN_TILE_IDS, tileIds)

export const RENDERER_STARTED = 'RENDERER_STARTED'
export const startRenderer = (): void => ipcRenderer.send(RENDERER_STARTED)

export const CATCH_MOUSE = 'CATCH_MOUSE'
export const catchMouse = (): void => ipcRenderer.send(CATCH_MOUSE)

export const RELEASE_MOUSE = 'RELEASE_MOUSE'
export const releaseMouse = (): void => ipcRenderer.send(RELEASE_MOUSE)
