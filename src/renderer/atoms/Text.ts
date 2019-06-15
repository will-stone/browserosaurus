import styled from 'styled-components'
import {
  fontWeight,
  FontWeightProps,
  opacity,
  OpacityProps,
} from 'styled-system'

interface Props extends FontWeightProps, OpacityProps {
  ellipsize?: boolean
}

export const Text = styled.span<Props>`
  white-space: ${props => (props.ellipsize ? 'nowrap' : 'normal')};
  overflow: ${props => (props.ellipsize ? 'hidden' : 'visible')};
  text-overflow: ${props => (props.ellipsize ? 'ellipsis' : 'clip')};

  ${fontWeight}
  ${opacity}
`
