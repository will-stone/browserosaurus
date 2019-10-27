import styled from 'styled-components'
import { opacity, OpacityProps } from 'styled-system'

interface Props extends OpacityProps {
  transform?: string
}

export const Topbar = styled.div<Props>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #0080ff;
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.55);
  color: white;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif;
  font-size: 20px;
  line-height: 1.5;
  text-align: center;
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  cursor: copy;

  will-change: transform, opacity;
  transform: ${props => props.transform || 'none'};
  transform-origin: center top;
  transition: transform 200ms ease-in-out, opacity 200ms ease-in-out;

  ${opacity}
`
