// Immer uses direct reassignement, so it's useful to turn this error off.
/* eslint-disable no-param-reassign */

import { createReducer } from '@reduxjs/toolkit'

import { Browser } from '../../config/browsers'
import { appLoaded, browsersReceived } from './actions'

/**
 * APP REDUCER
 */

interface AppState {
  isLoaded: boolean
}

const appIntialState: AppState = {
  isLoaded: false,
}

const app = createReducer(appIntialState, (builder) =>
  builder.addCase(appLoaded, (state) => {
    state.isLoaded = true
  }),
)

/**
 * Browsers
 */

type BrowsersState = Browser[]

const browsersIntialState: BrowsersState = []

const browsers = createReducer(browsersIntialState, (builder) =>
  builder.addCase(browsersReceived, (_, action) => action.payload),
)

export { app, browsers }
