import React from 'react'

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

export default ActivityIcon
