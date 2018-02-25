import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const NavBarButton = styled(NavLink)`
  cursor: default;
  opacity: 0.5;
  padding: 0 2rem;
  color: white;
  text-decoration: none;

  &:hover {
    opacity: 1;
  }

  &.active {
    opacity: 1;
  }
`

export default NavBarButton
