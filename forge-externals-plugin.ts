import { PluginBase } from '@electron-forge/plugin-base'
import {
  type ForgeHookMap,
  type ForgeMutatingHookFn,
} from '@electron-forge/shared-types'

interface Options {
  externals: string[]
}

/**
 * Required until @timfish/forge-externals-plugin updates to support getHooks
 */
class ForgeExternalsPlugin extends PluginBase<Options> {
  public name = 'ForgeExternalsPlugin'

  public externals: string[] = []

  public constructor(options: Options) {
    super(options)
    this.externals = options.externals
    this.getHooks = this.getHooks.bind(this)
  }

  public getHooks(): ForgeHookMap {
    return {
      resolveForgeConfig: this.resolveForgeConfig,
    }
  }

  // eslint-disable-next-line require-await
  private resolveForgeConfig: ForgeMutatingHookFn<'resolveForgeConfig'> =
    async (forgeConfig) => {
      const foundModules = new Set(this.externals)

      // The webpack plugin already sets the ignore function.
      const existingIgnoreFunction = forgeConfig.packagerConfig.ignore

      // We override it and ensure we include external modules too
      forgeConfig.packagerConfig.ignore = (file) => {
        if (
          typeof existingIgnoreFunction === 'function' &&
          existingIgnoreFunction(file) === false
        ) {
          return false
        }

        if (file === '/node_modules') {
          return false
        }

        for (const module of foundModules) {
          if (
            file.startsWith(`/node_modules/${module}`) ||
            file.startsWith(`/node_modules/${module.split('/')[0]}`)
          ) {
            return false
          }
        }

        return true
      }

      return forgeConfig
    }
}

export default ForgeExternalsPlugin
