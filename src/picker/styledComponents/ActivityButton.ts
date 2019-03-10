import styled from 'styled-components'
import { animated } from 'react-spring/web.cjs'

export const ActivityButton = styled(animated.button)`
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 30px;
  background: transparent;
  border: none;
  opacity: 0.5;
  transition: opacity 300ms linear;
  text-align: center;
  flex-shrink: 0;
  position: relative;

  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: none;
  }
`
