import { createAction as cA } from '@reduxjs/toolkit'

const gotKeyLayoutMap = cA<Record<string, string>>(`gotKeyLayoutMap`)

export { gotKeyLayoutMap }
