import * as React from 'react'

import { LockIcon } from '../atoms/LockIcon'
import { Text } from '../atoms/Text'
import { Topbar } from '../atoms/Topbar'
import { useUrl } from '../hooks/useUrl'

interface Props {
  isVisible: boolean
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const Bluebar: React.FC<Props> = ({ isVisible, onClick }) => {
  const u = useUrl()

  return (
    <Topbar
      transform={isVisible ? 'scaleY(1)' : 'scaleY(0)'}
      opacity={isVisible ? 1 : 0}
      onClick={onClick}
    >
      <Text ellipsize>
        <Text opacity={0.7}>
          {u.protocol && u.protocol.includes('s') && (
            <LockIcon marginRight={10} />
          )}
        </Text>
        <Text fontWeight="bold">{u.hostname}</Text>
        <Text opacity={0.7}>{u.port && ':' + u.port}</Text>
        <Text opacity={0.7}>{u.pathname}</Text>
        <Text opacity={0.7}>{u.search}</Text>
        <Text opacity={0.7}>{u.hash}</Text>
      </Text>
    </Topbar>
  )
}
