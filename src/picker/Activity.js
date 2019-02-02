import { Button, Tag, Tooltip } from '@blueprintjs/core'
import React from 'react'

const ActivityComponent = ({ activity, onClick }) => {
  return (
    <div
      style={{
        width: '20%',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Tooltip
        autoFocus={false}
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
    </div>
  )
}

export default ActivityComponent
