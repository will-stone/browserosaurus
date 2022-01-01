import { actionNamespacer } from '../../../shared/utils/action-namespacer'

const cA = actionNamespacer('renderer')

const gotKeyLayoutMap = cA<Record<string, string>>(`got-key-layout-map`)

export { gotKeyLayoutMap }
