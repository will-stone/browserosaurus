const valuesWithKey = (obj, keyName) =>
  Object.keys(obj).map(key => ({ [keyName]: key, ...obj[key] }))

export default valuesWithKey
