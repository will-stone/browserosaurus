import React, { Fragment } from 'react'
import styled from 'styled-components'

import ActivityIconAndName from '../../components/ActivityIconAndName'

const Div = styled.div`
  padding: 1rem 1rem 1rem 0;
  display: flex;
  align-items: center;

  &:hover,
  &.is-active {
    background-color: #0d8050;
  }
`

const Activity = ({ active, activity, defaultActivity, onClick }) => {
  return (
    <Div onClick={onClick} className={active && 'is-active'}>
      <ActivityIconAndName name={activity.name} />

      <span>
        {defaultActivity && (
          <Fragment>
            <kbd className="pt-key">enter</kbd>
            <span style={{ margin: '0 0.5rem' }} className="pt-text-muted">
              /
            </span>
          </Fragment>
        )}

        <kbd className="pt-key" style={{ marginLeft: 'auto' }}>
          {activity.hotKey}
        </kbd>
      </span>
    </Div>
  )
}

export default Activity
