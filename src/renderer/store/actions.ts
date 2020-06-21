import { createAction } from '@reduxjs/toolkit'

import { Store as MainStore } from '../../main/store'

const receivedStore = createAction<MainStore>('mainStore/received')

const updateFavClicked = createAction<string>('fav/updateClicked')

export { receivedStore, updateFavClicked }
