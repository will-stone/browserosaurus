declare module '*.png'
declare module '*.svg'
declare module '*.css'

declare global {
  interface Window {
    electron: {
      receive: (channel: string, callback: (...args: unknown[]) => void) => void
      send: (channel: string, action: unknown) => void
      getIcon: (appName: string) => Promise<string>
    }
  }
}
