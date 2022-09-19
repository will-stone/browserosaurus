/**
 * Typed Object.keys
 */
export const getKeys = <T extends object>(object: T): (keyof T)[] =>
  Object.keys(object) as (keyof T)[]
