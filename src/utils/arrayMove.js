import cloneDeep from 'lodash/cloneDeep'

/**
 * Array Move
 *
 * Utility function to move an array item to a specific spot in the array.
 * @param {array} array
 * @param {number} fromIndex
 * @param {number} toIndex
 * @returns {array}
 */
function arrayMove(array, fromIndex, toIndex) {
  const returnArray = cloneDeep(array)

  returnArray.splice(toIndex, 0, returnArray.splice(fromIndex, 1)[0])

  return returnArray
}

export default arrayMove
