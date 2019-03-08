export interface Activity {
  appId?: string
  name: string
  hotKey: string
  cmd: string
  fav?: boolean
}

export enum EAppState {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
}
