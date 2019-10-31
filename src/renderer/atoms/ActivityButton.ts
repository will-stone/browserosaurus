import styled from 'styled-components'
import { opacity, OpacityProps, size, SizeProps } from 'styled-system'

interface Props extends SizeProps, OpacityProps {
  float: string
  transform: string
}

export const ActivityButton = styled.button<Props>`
  ${opacity}
  ${size}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  text-align: center;
  position: relative;
  cursor: default;
  color: white;
  float: ${props => props.float};
  transform: ${props => props.transform};
  transition: opacity 200ms ease-in-out;

  &:hover {
    background-color: #0080ff;
  }

  &:focus {
    outline: none;
  }
`

ActivityButton.defaultProps = {
  size: 100,
  role: 'button',
}
