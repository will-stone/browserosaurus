import styled from 'styled-components'
import {
  position,
  PositionProps,
  WidthProps,
  HeightProps,
  width,
  height,
} from 'styled-system'

interface Props extends PositionProps, WidthProps, HeightProps {
  transform?: string
}

export const Div = styled.div<Props>`
  ${position};
  ${width};
  ${height};
  transform: ${props => props.transform};
  overflow: hidden;
`
