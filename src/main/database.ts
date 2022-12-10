import { app } from 'electron'
import { JSONFileSync, LowSync } from 'lowdb'
import path from 'path'

import type { Storage } from '../shared/state/reducer.storage'
import { defaultStorage } from '../shared/state/reducer.storage'

const keys = Object.keys as <T>(o: T) => Extract<keyof T, string>[]

const STORAGE_FILE = path.join(app.getPath('userData'), 'store.json')

const adapter = new JSONFileSync<Storage>(STORAGE_FILE)
const lowdb = new LowSync<Storage>(adapter)
lowdb.read()
lowdb.data ||= defaultStorage
lowdb.write()

export const database = {
  get: <Key extends keyof Storage>(key: Key): Storage[Key] => {
    return database.getAll()[key]
  },

  set: <Key extends keyof Storage>(key: Key, value: Storage[Key]): void => {
    lowdb.read()

    if (lowdb.data === null) {
      lowdb.data = defaultStorage
    }

    lowdb.data[key] = value
    lowdb.write()
  },

  getAll: (): Storage => {
    lowdb.read()

    if (lowdb.data === null) {
      return defaultStorage
    }

    // Removes unknown keys in storage
    for (const key of keys(lowdb.data)) {
      if (typeof defaultStorage[key] === 'undefined') {
        delete lowdb.data[key]
      }
    }

    // Remove old, id-based apps
    if (Array.isArray(lowdb.data.apps)) {
      lowdb.data.apps = lowdb.data.apps.filter((storedApp) =>
        Boolean(storedApp.name),
      )
    }

    return {
      ...defaultStorage,
      ...lowdb.data,
    }
  },

  setAll: (value: Storage): void => {
    lowdb.data = value
    lowdb.write()
  },
}
