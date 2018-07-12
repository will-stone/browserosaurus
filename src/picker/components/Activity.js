import { Tooltip } from '@blueprintjs/core'
import React from 'react'
import { css } from 'emotion'
import ActivityIcon from '../../components/ActivityIcon'
import Kbd from '../../components/Kbd'

const Activity = ({
  activity,
  defaultActivity,
  isActive,
  isTooltipOpen,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <Tooltip
      autoFocus={false}
      className={css`
        display: inline-block;
        width: calc(100% / 3);
      `}
      content={activity.name}
      intent="primary"
      isOpen={isTooltipOpen}
      position="bottom"
      rootElementTag="div"
    >
      <div
        className={css`
          background-color: ${isActive && '#0d8050'};
          padding: 1rem;
          text-align: center;

          &:focus {
            outline: 0;
          }
        `}
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
      </div>
    </Tooltip>
  )
}

export default Activity
