export function shallowEqualArrays(
  arrayA: unknown[],
  arrayB: unknown[],
): boolean {
  if (arrayA === arrayB) {
    return true
  }

  if (!arrayA || !arrayB) {
    return false
  }

  const length_ = arrayA.length

  if (arrayB.length !== length_) {
    return false
  }

  for (let index = 0; index < length_; index = index + 1) {
    if (arrayA[index] !== arrayB[index]) {
      return false
    }
  }

  return true
}

type UnknownObject = { [key: string]: unknown }

export function shallowEqualObjects(
  objectA: UnknownObject,
  objectB: UnknownObject,
): boolean {
  if (objectA === objectB) {
    return true
  }

  if (!objectA || !objectB) {
    return false
  }

  const aKeys = Object.keys(objectA)
  const bKeys = Object.keys(objectB)
  const length_ = aKeys.length

  if (bKeys.length !== length_) {
    return false
  }

  for (let index = 0; index < length_; index = index + 1) {
    const key = aKeys[index]

    if (
      objectA[key] !== objectB[key] ||
      !Object.prototype.hasOwnProperty.call(objectB, key)
    ) {
      return false
    }
  }

  return true
}
