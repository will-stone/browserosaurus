/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { foundMouse, lostMouse } from '../../store/actions'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  capture?: boolean
}

const MouseDiv: React.FC<Props> = ({
  capture,
  onMouseEnter,
  onMouseOver,
  ...rest
}) => {
  const dispatch = useDispatch()

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation()

      if (capture) {
        dispatch(foundMouse())
      }

      if (onMouseEnter) {
        onMouseEnter(event)
      }
    },
    [dispatch, capture, onMouseEnter],
  )

  const handleMouseOver = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation()

      if (!capture) {
        dispatch(lostMouse())
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
