import { Tooltip } from '@blueprintjs/core'
import React from 'react'
import styled, { css } from 'react-emotion'
import ActivityIcon from '../../components/ActivityIcon'
import Kbd from '../../components/Kbd'

const toolTipCSS = css`
  display: inline-block;
  width: calc(100% / 3);
`

const StyledTile = styled('div')`
  text-align: center;
  padding: 1rem;

  &.is-active {
    background-color: #0d8050 !important;
  }

  &:focus {
    outline: 0;
  }
`

const Activity = ({
  active,
  activity,
  defaultActivity,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <Tooltip
      autoFocus={false}
      className={toolTipCSS}
      content={activity.name}
      intent="primary"
      isOpen={active}
      position="bottom"
      rootElementTag="div"
    >
      <StyledTile
        className={active && 'is-active'}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <ActivityIcon
          name={activity.name}
          style={{ marginBottom: '1rem' }}
          large
        />
        <div>
          <Kbd isDefault={defaultActivity} hotKey={activity.hotKey} />
        </div>
      </StyledTile>
    </Tooltip>
  )
}

export default Activity
