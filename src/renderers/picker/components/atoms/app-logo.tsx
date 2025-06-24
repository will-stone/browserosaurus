import clsx from 'clsx'
import { useEffect, useState } from 'react'

import type { InstalledApp } from '../../../shared/state/hooks.js'

type Props = React.ComponentPropsWithoutRef<'img'> & {
  readonly app: InstalledApp
  readonly className?: string
  readonly icon: string | undefined
}

const AppLogo = ({ app, className, icon }: Props): JSX.Element => {
  const [iconSrc, setIconSrc] = useState<string>('')
  
  useEffect(() => {
    if (icon === 'cached') {
      // Fetch icon via IPC
      window.electron.getIcon(app.name).then(setIconSrc).catch(() => setIconSrc(''))
    } else {
      setIconSrc(icon || '')
    }
  }, [app.name, icon])
  
  return (
    <img
      alt=""
      className={clsx(className, 'no-drag', !iconSrc && 'hidden')}
      data-testid={app.name}
      src={iconSrc}
    />
  )
}

export default AppLogo
