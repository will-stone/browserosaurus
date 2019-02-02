import { Tooltip } from '@blueprintjs/core'
import React from 'react'
import { css } from 'emotion'
import ActivityIcon from '../../../components/ActivityIcon'

const ActivityComponent = ({
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
        width: ${100 / 5}%;
        display: inline-block;
      `}
      content={activity.name}
      intent="primary"
      isOpen={isTooltipOpen}
      position="bottom"
      wrapperTagName="div"
      targetTagName="div"
    >
      <div
        className={css`
          background-color: ${isActive && '#0d8050'};
          padding: 0.5rem;
          text-align: center;
          border-radius: 0.5rem;
          position: relative;

          &:focus {
            outline: 0;
          }
        `}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <ActivityIcon name={activity.name} style={{ marginBottom: '1rem' }} />
        <kbd className="bp3-key" style={{ position: 'absolute', right: 0, bottom: 0 }}>
          {activity.hotKey}
        </kbd>
      </div>
    </Tooltip>
  )
}

export default ActivityComponent
