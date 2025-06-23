import path from 'node:path'

import { app } from 'electron'
import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'

import type { Storage } from '../shared/state/reducer.storage.js'
import { defaultStorage } from '../shared/state/reducer.storage.js'

const keys = Object.keys as <T>(o: T) => Extract<keyof T, string>[]

const STORAGE_FILE = path.join(app.getPath('userData'), 'store.json')

const adapter = new JSONFileSync<Storage>(STORAGE_FILE)
const lowdb = new LowSync<Storage>(adapter, defaultStorage)

// Debouncing for database writes
let writeTimeout: NodeJS.Timeout | null = null
let pendingChanges = false

// 100ms debounce delay
const WRITE_DELAY = 100

const debouncedWrite = () => {
  if (writeTimeout) {
    clearTimeout(writeTimeout)
  }
  
  writeTimeout = setTimeout(() => {
    if (pendingChanges) {
      lowdb.write()
      pendingChanges = false
    }
    writeTimeout = null
  }, WRITE_DELAY)
}

const immediateWrite = () => {
  if (writeTimeout) {
    clearTimeout(writeTimeout)
    writeTimeout = null
  }
  lowdb.write()
  pendingChanges = false
}

export const database = {
  get: <Key extends keyof Storage>(key: Key): Storage[Key] => {
    return database.getAll()[key]
  },

  set: <Key extends keyof Storage>(key: Key, value: Storage[Key], immediate = false): void => {
    lowdb.read()

    if (lowdb.data === null) {
      lowdb.data = defaultStorage
    }

    lowdb.data[key] = value
    pendingChanges = true
    
    if (immediate) {
      immediateWrite()
    } else {
      debouncedWrite()
    }
  },

  getAll: (): Storage => {
    lowdb.read()

    if (lowdb.data === null) {
      return defaultStorage
    }

    // Removes unknown keys in storage
    for (const key of keys(lowdb.data)) {
      if (defaultStorage[key] === undefined) {
        delete lowdb.data[key]
      }
    }

    // Remove old, id-based apps
    if (Array.isArray(lowdb.data.apps)) {
      lowdb.data = {
        ...lowdb.data,
        apps: lowdb.data.apps.filter((storedApp) => Boolean(storedApp.name)),
      }
    }

    return {
      ...defaultStorage,
      ...lowdb.data,
    }
  },

  setAll: (value: Storage, immediate = false): void => {
    lowdb.data = value
    pendingChanges = true
    
    if (immediate) {
      immediateWrite()
    } else {
      debouncedWrite()
    }
  },

  // Force immediate write (useful for critical operations like app shutdown)
  flush: (): void => {
    immediateWrite()
  },
}
