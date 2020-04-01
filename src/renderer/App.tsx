/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import './App.css'

import cc from 'classcat'
import { ipcRenderer } from 'electron'
import * as mousetrap from 'mousetrap'
import * as React from 'react'

import {
  CLOSE_WINDOW,
  MOUSE_THROUGH_DISABLE,
  MOUSE_THROUGH_ENABLE,
  WINDOW_BLUR,
} from '../config/events'
import Bluebar from './features/Bluebar'
import Picker from './features/Picker'

const { useEffect, useCallback, useState } = React

const App: React.FC = () => {
  const [pickerPosition, setPickerPosition] = useState<[number, number]>([0, 0])
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [mouseTarget, setMouseTarget] = useState<string>()

  const handleCloseWindow = useCallback(() => {
    setIsVisible(false)
    const timeout = 200
    setTimeout(() => ipcRenderer.send(CLOSE_WINDOW), timeout)
  }, [])

  // Set-up event listeners
  useEffect(() => {
    /**
     * Global keyboard shortcuts
     */
    mousetrap.bind('esc', (evt) => {
      evt.preventDefault()
      handleCloseWindow()
    })

    /**
     * Events from main process
     */
    ipcRenderer.on(WINDOW_BLUR, handleCloseWindow)

    return function cleanup() {
      ipcRenderer.removeAllListeners(WINDOW_BLUR)
    }
  }, [handleCloseWindow])

  const onMouseEnter = useCallback(
    (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!isVisible) {
        setPickerPosition([evt.clientX, evt.clientY])
        setIsVisible(true)
      }
    },
    [isVisible],
  )

  const onMouseMove = useCallback(
    (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
      setMouseTarget((evt.target as Element).id),
    [],
  )

  /**
   * Allows clicking through the window so that the window underneath gets
   * full focus.
   */
  useEffect(() => {
    if (mouseTarget === 'window') {
      ipcRenderer.send(MOUSE_THROUGH_ENABLE)
    } else {
      ipcRenderer.send(MOUSE_THROUGH_DISABLE)
    }
  }, [mouseTarget])

  return (
    <div
      className={cc(['App', { 'App--visible': isVisible }])}
      id="window"
      onClick={handleCloseWindow}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
    >
      <Bluebar />
      <Picker x={pickerPosition[0]} y={pickerPosition[1]} />
    </div>
  )
}

export default App
