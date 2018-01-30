import electron from 'electron'
/**
 * Update Window Height
 *
 * public method
 * Sets the window height to current scroll height
 */

const updateWindowHeight = () => {
  const window = electron.remote.getCurrentWindow()

  const height = Math.min(
    document.body.scrollHeight,
    document.body.clientHeight
  )
  const width = window.getSize()[0]

  window.setSize(width, height)

  return false
}

export default updateWindowHeight
