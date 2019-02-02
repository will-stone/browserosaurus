import { Tag, Tooltip, Button } from '@blueprintjs/core'
import { css } from 'emotion'
import React from 'react'

const ActivityComponent = ({ activity, onClick }) => {
  return (
    <Tooltip
      autoFocus={false}
      className={css`
        width: ${100 / 5}%;
        display: inline-block;
      `}
      content={activity.name}
      intent="primary"
      position="bottom"
      wrapperTagName="div"
      targetTagName="div"
    >
      <Button
        minimal
        intent="primary"
        style={{ position: 'relative', padding: '1rem' }}
        onClick={onClick}
      >
        {activity.favourite && (
          <Tag
            intent="primary"
            style={{ position: 'absolute', top: 5, left: 5, textAlign: 'center' }}
          >
            enter
          </Tag>
        )}
        <img
          src={`../images/activity-icons/${activity.name}.png`}
          alt={activity.name}
          style={{
            width: 40,
            height: 40,
            display: 'block',
          }}
        />
        <Tag minimal style={{ position: 'absolute', right: 5, bottom: 5, textAlign: 'center' }}>
          {activity.hotKey}
        </Tag>
      </Button>
    </Tooltip>
  )
}

export default ActivityComponent
