import { faCircle } from '@fortawesome/pro-duotone-svg-icons/faCircle'
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock'
import { faLockOpen } from '@fortawesome/pro-solid-svg-icons/faLockOpen'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cc from 'classcat'
import React from 'react'

interface Props {
  className?: string
  urlProtocol?: string
}

const ProtocolIcon: React.FC<Props> = ({ className, urlProtocol }) => {
  if (!urlProtocol) {
    return (
      <FontAwesomeIcon
        className={cc([className, 'opacity-50'])}
        fixedWidth
        icon={faCircle}
      />
    )
  }

  return urlProtocol?.includes('s') ? (
    <FontAwesomeIcon className={className} fixedWidth icon={faLock} />
  ) : (
    <FontAwesomeIcon
      className={cc([className, 'opacity-50'])}
      fixedWidth
      icon={faLockOpen}
    />
  )
}

export default ProtocolIcon
