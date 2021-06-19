import electronIsDev from 'electron-is-dev'

const blue = (string: string) => `\u001B[34m${string}\u001B[0m`
const dim = (string: string) => `\u001B[2m${string}\u001B[0m`

export function logger(domain: string, message: string): void {
  if (electronIsDev) {
    // eslint-disable-next-line no-console
    console.log(`${blue(domain)} ${dim('›')}`, message)
  }
}
