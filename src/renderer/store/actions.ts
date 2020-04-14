import { createAction } from '@reduxjs/toolkit'

import { Browser } from '../../config/browsers'

/**
 * App
 */
const appLoaded = createAction('app/loaded')

/**
 * Browsers
 */
const browsersReceived = createAction<Browser[]>('browsers/received')

/**
 * Browser
 */
const browserClicked = createAction<{ id: string; isAlt: boolean }>(
  'browser/clicked',
)

/**
 * Keyboard
 */
const keyPress = createAction<KeyboardEvent>('keyboard/key-press')

export { appLoaded, browsersReceived, keyPress, browserClicked }
