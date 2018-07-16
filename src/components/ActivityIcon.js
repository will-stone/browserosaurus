import React from 'react'
import { string, object } from 'prop-types'

const ActivityIcon = ({ large, name, style, ...rest }) => {
  return (
    <img
      src={`../images/activity-icons/${name}.png`}
      alt="activity"
      style={{
        ...style,
        width: large ? 48 : 32,
        height: large ? 48 : 32,
        verticalAlign: 'middle',
      }}
      {...rest}
    />
  )
}

ActivityIcon.propTypes = {
  name: string.isRequired,
  style: object,
}

export default ActivityIcon
