import { MenuItem } from '@blueprintjs/core'
import React from 'react'
import styled from 'styled-components'
import ActivityIcon from '../../components/ActivityIcon'
import Kbd from '../../components/Kbd'

const StyledMenuItem = styled(MenuItem)`
  padding: 1rem;
  align-items: center;

  &:hover,
  &.is-active {
    background-color: #0d8050 !important;
  }
`

const Activity = ({ active, activity, defaultActivity, onClick }) => {
  return (
    <StyledMenuItem
      icon={<ActivityIcon name={activity.name} />}
      text={activity.name}
      onClick={onClick}
      className={active && 'is-active'}
      label={<Kbd isDefault={defaultActivity} hotKey={activity.hotKey} />}
    />
  )
}

export default Activity
