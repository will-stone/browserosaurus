/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useCallback } from 'react'

import { catchMouse, releaseMouse } from '../../sendToMain'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  capture?: boolean
}

const MouseDiv: React.FC<Props> = ({
  capture,
  onMouseEnter,
  onMouseOver,
  ...rest
}) => {
  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation()

      if (capture) {
        catchMouse()
      }

      if (onMouseEnter) {
        onMouseEnter(event)
      }
    },
    [capture, onMouseEnter],
  )

  const handleMouseOver = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation()

      if (!capture) {
        releaseMouse()
      }

      if (onMouseOver) {
        onMouseOver(event)
      }
    },
    [capture, onMouseOver],
  )

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseOver={handleMouseOver}
      {...rest}
    />
  )
}

export default MouseDiv
