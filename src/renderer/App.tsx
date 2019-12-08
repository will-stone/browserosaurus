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
import { Bluebar } from './features/Bluebar'
import { Picker } from './features/Picker'

const { useEffect, useCallback, useState } = React

const App: React.FC = () => {
  const [pickerPosition, setPickerPosition] = useState<[number, number]>([0, 0])
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [mouseTarget, setMouseTarget] = useState<string>()

  const handleCloseWindow = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => ipcRenderer.send(CLOSE_WINDOW), 200)
  }, [])

  // Set-up event listeners
  useEffect(() => {
    /**
     * Global keyboard shortcuts
     */
    mousetrap.bind('esc', e => {
      e.preventDefault()
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
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!isVisible) {
        setPickerPosition([e.clientX, e.clientY])
        setIsVisible(true)
      }
    },
    [isVisible],
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
      setMouseTarget((e.target as Element).id),
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
      onClick={handleCloseWindow}
      id="window"
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
    >
      <Bluebar isVisible={isVisible} />
      <Picker
        x={pickerPosition[0]}
        y={pickerPosition[1]}
        isVisible={isVisible}
      />
    </div>
  )
}

export default App
