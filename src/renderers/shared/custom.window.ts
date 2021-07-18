interface CustomWindow extends Window {
  api: any
}

export const customWindow = window as unknown as CustomWindow
