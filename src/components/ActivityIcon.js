import React from 'react'

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

export default ActivityIcon
