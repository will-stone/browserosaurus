export interface App {
  name: string
  id: string
  urlTemplate?: string
  privateArg?: string
}

export interface Profile {
  appId: string
  profileName: string
}
