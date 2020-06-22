import { createAction } from '@reduxjs/toolkit'

import { Store as MainStore } from '../../main/store'

const receivedStore = createAction<MainStore>('mainStore/received')

const madeTileFav = createAction<string>('tile/madeFav')
const toggledTileVisibility = createAction<string>('tile/visibilityToggled')

export { receivedStore, madeTileFav, toggledTileVisibility }
