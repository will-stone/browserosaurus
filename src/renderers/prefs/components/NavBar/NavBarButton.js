import { css } from 'emotion'
import React from 'react'

class NavBarButton extends React.Component {
  handleOnClick = () => {
    this.props.onClick(this.props.id)
  }

  render() {
    const { active, children } = this.props

    return (
      <li
        className={css`
          cursor: default;
          opacity: ${active ? 1 : 0.5};
          padding: 0 1rem;

          &:hover {
            opacity: 1;
          }
        `}
        onClick={this.handleOnClick}
      >
        {children}
      </li>
    )
  }
}

export default NavBarButton
