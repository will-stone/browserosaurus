/**
 * Typed Object.keys
 */
export const getKeys = <T>(object: T): (keyof T)[] =>
  Object.keys(object) as (keyof T)[]
