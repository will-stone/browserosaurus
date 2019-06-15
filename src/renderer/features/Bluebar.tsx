import * as React from 'react'
import { Topbar } from '../atoms/Topbar'
import { Text } from '../atoms/Text'
import { LockIcon } from '../atoms/LockIcon'
import * as Url from 'url'

interface Props {
  isVisible: boolean
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  url: string | null
}

export const Bluebar: React.FC<Props> = ({ isVisible, onClick, url }) => {
  // TODO: should this parsing go in the main process?
  const u = React.useMemo(() => Url.parse(url || ''), [url])

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
