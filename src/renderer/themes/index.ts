import { Store as MainStore } from '../../main/store'
import { Theme } from './_model'
import { dark } from './dark'
import { dracula } from './dracula'
import { light } from './light'

export const themes: { [key in MainStore['theme']]: Theme } = {
  light,
  dark,
  dracula,
}
