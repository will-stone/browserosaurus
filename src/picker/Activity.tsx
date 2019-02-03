import { Button, Tag, Tooltip } from '@blueprintjs/core'
import * as React from 'react'
import { IActivity } from '../model'

const ActivityComponent = ({ activity, onClick }: { activity: IActivity; onClick: () => void }) => {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'inline-flex',
        justifyContent: 'center',
        width: '20%',
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
          {activity.fav && (
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
              display: 'block',
              height: 40,
              width: 40,
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
