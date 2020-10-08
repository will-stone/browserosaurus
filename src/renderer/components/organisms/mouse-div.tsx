/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from 'react'

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
  return (
    <div
      onMouseEnter={(event) => {
        event.stopPropagation()

        if (capture) {
          catchMouse()
        }

        if (onMouseEnter) {
          onMouseEnter(event)
        }
      }}
      onMouseOver={(event) => {
        event.stopPropagation()

        if (!capture) {
          releaseMouse()
        }

        if (onMouseOver) {
          onMouseOver(event)
        }
      }}
      {...rest}
    />
  )
}

export default MouseDiv
