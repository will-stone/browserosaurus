/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from 'react'

import { events } from '../../store'

const { mouseIn, mouseOut } = events

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
          mouseIn()
        }

        if (onMouseEnter) {
          onMouseEnter(event)
        }
      }}
      onMouseOver={(event) => {
        event.stopPropagation()

        if (!capture) {
          mouseOut()
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
