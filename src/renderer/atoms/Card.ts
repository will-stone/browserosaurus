import styled from 'styled-components'
import {
  height,
  HeightProps,
  left,
  LeftProps,
  opacity,
  OpacityProps,
  top,
  TopProps,
  width,
  WidthProps,
} from 'styled-system'

interface Props
  extends TopProps,
    LeftProps,
    WidthProps,
    HeightProps,
    OpacityProps {
  transformOrigin?: string
  transform?: string
}

export const Card = styled.div<Props>`
  position: absolute;
  background-color: #232323;
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.55);
  border-radius: 5px;
  overflow: hidden;
  will-change: transform, opacity;
  transition: transform 200ms ease-in-out, opacity 200ms ease-in-out;

  ${top};
  ${left};
  ${width};
  ${height};
  ${opacity};
  transform-origin: ${props => props.transformOrigin};
  transform: ${props => props.transform || 'scale(0)'};
`

Card.defaultProps = {
  opacity: 0,
}
