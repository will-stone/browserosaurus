import React from 'react'
import { string, object } from 'prop-types'

const ActivityIcon = ({ name, style, ...rest }) => {
  return (
    <img
      src={`../images/activity-icons/${name}.png`}
      alt=""
      style={{
        ...style,
        width: 32,
        height: 32,
        verticalAlign: 'middle'
      }}
      {...rest}
    />
  )
}

ActivityIcon.propTypes = {
  name: string.isRequired,
  style: object
}

export default ActivityIcon
