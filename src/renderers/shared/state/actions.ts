import { actionNamespacer } from '../../../shared/utils/action-namespacer'

const cA = actionNamespacer('renderer')

const gotKeyLayoutMap = cA<Record<string, string>>(`gotKeyLayoutMap`)

export { gotKeyLayoutMap }
