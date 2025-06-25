declare module '*.png'
declare module '*.svg'
declare module '*.css'

declare global {
  interface Window {
    electron: {
      getIcon: (appName: string) => Promise<string>
      receive: (channel: any, callback: (...args: unknown[]) => void) => void
      send: (channel: any, action: unknown) => void
    }
  }
}
