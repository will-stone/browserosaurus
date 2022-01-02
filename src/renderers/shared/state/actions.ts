import { actionNamespacer } from '../../../shared/utils/action-namespacer'

const renderer = actionNamespacer('renderer')

const gotKeyLayoutMap = renderer<Record<string, string>>(`got-key-layout-map`)

export { gotKeyLayoutMap }
