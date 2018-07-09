import { Tooltip } from '@blueprintjs/core'
import React from 'react'
import styled, { css } from 'react-emotion'
import ActivityIcon from '../../components/ActivityIcon'
import Kbd from '../../components/Kbd'

const StyledTile = styled('div')`
  display: inline-block;
  width: calc(100% / 3);
  text-align: center;

  &:hover,
  &.is-active {
    background-color: #0d8050 !important;
  }
`

const Activity = ({ active, activity, defaultActivity, onClick }) => {
  return (
    <StyledTile onClick={onClick} className={active && 'is-active'}>
      <Tooltip
        content={activity.name}
        position="bottom"
        intent="primary"
        rootElementTag="div"
        className={css`
          display: block;
        `}
      >
        <div
          className={css`
            padding: 1rem;
          `}
        >
          <ActivityIcon
            name={activity.name}
            style={{ marginBottom: '1rem' }}
            large
          />
          <div>
            <Kbd isDefault={defaultActivity} hotKey={activity.hotKey} />
          </div>
        </div>
      </Tooltip>
    </StyledTile>
  )
}

export default Activity
