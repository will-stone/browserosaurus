import cc from 'classcat'
import React from 'react'

interface Props {
  className?: string
  urlProtocol?: string
}

const ProtocolIcon: React.FC<Props> = ({ className, urlProtocol }) => {
  return urlProtocol?.includes('s') ? (
    <svg
      aria-hidden="true"
      className={cc(['w-4 h-4', className])}
      focusable="false"
      role="img"
      viewBox="0 0 448 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zM264 392c0 22.1-17.9 40-40 40s-40-17.9-40-40v-48c0-22.1 17.9-40 40-40s40 17.9 40 40v48zm32-168H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"
        fill="currentColor"
      />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      className={cc(['w-4 h-4 opacity-25', className])}
      focusable="false"
      role="img"
      viewBox="0 0 576 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M423.5 0C339.5.3 272 69.5 272 153.5V224H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48h-48v-71.1c0-39.6 31.7-72.5 71.3-72.9 40-.4 72.7 32.1 72.7 72v80c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24v-80C576 68 507.5-.3 423.5 0z"
        fill="currentColor"
      />
    </svg>
  )
}

export default ProtocolIcon
