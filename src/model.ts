export interface IActivity {
  appId?: string
  name: string
  hotKey: string
  cmd: string
  favourite?: boolean
}

export enum EAppState {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
}
