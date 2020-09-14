import produce from 'immer'
import create, { StateCreator } from 'zustand'

import { DEFAULT_URL, SPONSOR_URL } from '../config/CONSTANTS'
import { App } from '../config/types'
import { Store as MainStore } from '../main/store'
import { alterHotkeys } from '../utils/alterHotkeys'
import { backspaceUrlParse } from '../utils/backspaceUrlParse'
import {
  catchMouse,
  changeTheme,
  copyUrl,
  hideWindow,
  quit,
  releaseMouse,
  reload,
  selectApp,
  selectFav,
  setAsDefaultBrowser,
  startRenderer,
  updateHiddenTileIds,
  updateHotkeys,
  updateRestart,
} from './sendToMain'

interface UiState {
  menu: false | 'tiles'
  url: string
  version: string
  updateStatus: 'no-update' | 'available' | 'downloaded'
  isDefaultProtocolClient: boolean
}

interface Events {
  appStarted: () => void

  receivedApps: (payload: App[]) => void
  receivedStore: (payload: MainStore) => void
  receivedUrl: (payload: string) => void
  receivedVersion: (payload: string) => void
  receivedUpdateAvailable: () => void
  receivedUpdateDownloaded: () => void
  receivedDefaultProtocolClientStatus: (payload: boolean) => void

  mouseIn: () => void
  mouseOut: () => void

  clickedCloseMenuButton: () => void
  clickedCopyButton: () => void
  clickedEyeButton: (payload: string) => void
  clickedFavButton: (payload: string) => void
  clickedQuitButton: () => void
  clickedReloadButton: () => void
  clickedSetAsDefaultButton: () => void
  clickedSettingsButton: () => void
  clickedSponsorButton: () => void
  clickedThemeButton: (payload: MainStore['theme']) => void
  clickedTileButton: (payload: { appId: string; isAlt: boolean }) => void
  clickedUpdateButton: () => void
  clickedUrlBackspaceButton: () => void

  changedHotkey: (payload: { appId: string; value: string }) => void

  pressedAppKey: (payload: { key: string; isAlt: boolean }) => void
  pressedBackspaceKey: () => void
  pressedCopyKey: () => void
  pressedEscapeKey: () => void
}

export type State = {
  apps: App[]
  mainStore: MainStore
  ui: UiState
  events: Events
}

const withImmer = <T extends State>(
  config: StateCreator<T, (fn: (state: T) => void) => void>,
): StateCreator<T> => (set, get, api) =>
  config((fn) => set(produce(fn) as (state: T) => T), get, api)

export const useStore = create<State>(
  withImmer((set, get) => ({
    apps: [],
    mainStore: {
      fav: '',
      hiddenTileIds: [],
      hotkeys: {},
      theme: 'dark',
    },
    ui: {
      menu: false,
      version: '',
      updateStatus: 'no-update',
      isDefaultProtocolClient: true,
      url: DEFAULT_URL,
    },

    // EVENTS
    events: {
      appStarted: () => {
        startRenderer()
      },

      receivedApps: (payload) =>
        set((state) => {
          state.apps = payload
        }),
      receivedStore: (payload) =>
        set((state) => {
          state.mainStore = payload
        }),
      receivedUrl: (payload) =>
        set((state) => {
          state.ui.menu = false
          state.ui.url = payload
        }),
      receivedVersion: (payload) =>
        set((state) => {
          state.ui.version = payload
        }),
      receivedUpdateAvailable: () =>
        set((state) => {
          state.ui.updateStatus = 'available'
        }),
      receivedUpdateDownloaded: () =>
        set((state) => {
          state.ui.updateStatus = 'downloaded'
        }),
      receivedDefaultProtocolClientStatus: (payload) =>
        set((state) => {
          state.ui.isDefaultProtocolClient = payload
        }),

      mouseIn: () => {
        catchMouse()
      },
      mouseOut: () => {
        releaseMouse()
      },

      clickedCloseMenuButton: () =>
        set((state) => {
          state.ui.menu = false
        }),
      clickedCopyButton: () => {
        const { url } = get().ui
        if (url) {
          copyUrl(url)
          hideWindow()
        }
      },
      clickedEyeButton: (payload) =>
        set((state) => {
          const { hiddenTileIds } = get().mainStore
          // Remove the id if it exists in the array
          const updatedHiddenTileIds = hiddenTileIds.filter(
            (id) => id !== payload,
          )

          // If no id was removed, it didn't exist to begin with and should be added
          if (updatedHiddenTileIds.length === hiddenTileIds.length) {
            updatedHiddenTileIds.push(payload)
          }

          state.mainStore.hiddenTileIds = updatedHiddenTileIds
          updateHiddenTileIds(updatedHiddenTileIds)
        }),
      clickedFavButton: (payload) =>
        set((state) => {
          state.mainStore.fav = payload
          selectFav(payload)
        }),
      clickedQuitButton: () => {
        quit()
      },
      clickedReloadButton: () => {
        reload()
      },
      clickedSetAsDefaultButton: () => {
        setAsDefaultBrowser()
      },
      clickedSettingsButton: () =>
        set((state) => {
          if (state.ui.menu) {
            state.ui.menu = false
          } else {
            state.ui.menu = 'tiles'
          }
        }),
      clickedSponsorButton: () =>
        set((state) => {
          state.ui.url = SPONSOR_URL
          state.ui.menu = false
        }),
      clickedThemeButton: (payload) =>
        set((state) => {
          state.mainStore.theme = payload
          changeTheme(payload)
        }),
      clickedTileButton: ({ appId, isAlt }) => {
        const { url } = get().ui
        selectApp({ url, appId, isAlt })
        hideWindow()
      },
      clickedUpdateButton: () => {
        updateRestart()
      },
      clickedUrlBackspaceButton: () =>
        set((state) => {
          state.ui.url = backspaceUrlParse(get().ui.url)
        }),

      changedHotkey: ({ appId, value }) =>
        set((state) => {
          const updatedHotkeys = alterHotkeys(
            get().mainStore.hotkeys,
            appId,
            value,
          )
          state.mainStore.hotkeys = updatedHotkeys
          updateHotkeys(updatedHotkeys)
        }),

      pressedAppKey: ({ key, isAlt }) => {
        const { url } = get().ui

        // Favourite
        if (key === 'Space' || key === 'Enter') {
          const { fav } = get().mainStore
          selectApp({ url, appId: fav, isAlt })
          hideWindow()
        }
        // Hotkey
        else {
          const { hotkeys } = get().mainStore
          const appId = hotkeys[key]
          if (appId) {
            selectApp({ url, appId, isAlt })
            hideWindow()
          }
        }
      },
      pressedBackspaceKey: () =>
        set((state) => {
          state.ui.url = backspaceUrlParse(get().ui.url)
        }),
      pressedCopyKey: () => {
        const { url } = get().ui
        if (url) {
          copyUrl(url)
          hideWindow()
        }
      },
      pressedEscapeKey: () =>
        set((state) => {
          if (!get().ui.menu) {
            hideWindow()
          }

          state.ui.menu = false
        }),
    },
  })),
)

export const { events } = useStore.getState()

// SELECTORS

const useTilesSelector = (state: State): App[] =>
  state.apps.filter((b) => !state.mainStore.hiddenTileIds.includes(b.id))

export const useFavTileSelector = (state: State): App | undefined => {
  const tiles = useTilesSelector(state)
  const favTile = tiles.find((a) => a.id === state.mainStore.fav)
  return favTile
}

export const useNormalTilesSelector = (state: State): App[] => {
  const tiles = useTilesSelector(state)
  const normalTiles = tiles.filter((a) => a.id !== state.mainStore.fav)
  return normalTiles
}
