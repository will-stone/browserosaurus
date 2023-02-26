import type { PayloadActionCreator } from '@reduxjs/toolkit'
import { createAction } from '@reduxjs/toolkit'

/**
 * Prefixes action creator types with a string
 */
export function actionNamespacer<Namespace extends string>(
  namespace: Namespace,
) {
  return <Payload = never | void, Type extends string = string>(
    type: Type,
  ): PayloadActionCreator<Payload, `${Namespace}/${Type}`> =>
    createAction(`${namespace}/${type}`)
}
