import styled from 'styled-components'
import { animated } from 'react-spring/web.cjs'

export const Window = styled(animated.div)`
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 100px;
`
