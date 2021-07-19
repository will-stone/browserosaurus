import { app } from 'electron'
import { JSONFileSync, LowSync } from 'lowdb'
import path from 'path'

import type { Storage } from '../shared/state/reducer.storage'
import { defaultStorage } from '../shared/state/reducer.storage'

const keys = Object.keys as <T>(o: T) => Extract<keyof T, string>[]

const STORAGE_FILE = path.join(app.getPath('userData'), 'store.json')

const adapter = new JSONFileSync<Storage>(STORAGE_FILE)
const database = new LowSync<Storage>(adapter)

/**
 * Keyboard shortcuts
 */

export const storage = {
  get: <Key extends keyof Storage>(key: Key): Storage[Key] => {
    return storage.getAll()[key]
  },

  set: <Key extends keyof Storage>(key: Key, value: Storage[Key]): void => {
    database.read()

    if (database.data === null) {
      database.data = defaultStorage
    }

    database.data[key] = value
    database.write()
  },

  getAll: (): Storage => {
    database.read()

    if (database.data === null) {
      database.data = defaultStorage
      database.write()
      return defaultStorage
    }

    database.data = {
      ...defaultStorage,
      ...database.data,
    }

    // Removes unknown keys in storage
    for (const key of keys(database.data)) {
      if (typeof defaultStorage[key] === undefined) {
        delete database.data[key]
      }
    }

    return database.data
  },

  setAll: (value: Storage): void => {
    // Only keep data that is used by the app
    database.data = value
    database.write()
  },
}
