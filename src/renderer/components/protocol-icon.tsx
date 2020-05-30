import cc from 'classcat'
import React from 'react'

import Icon from './icon'

interface Props {
  className?: string
  urlProtocol?: string
}

const ProtocolIcon: React.FC<Props> = ({ className, urlProtocol }) => {
  return urlProtocol?.includes('s') ? (
    <Icon className={className} icon="lock" />
  ) : (
    <Icon className={cc([className, 'opacity-50'])} icon="unlock" />
  )
}

export default ProtocolIcon
