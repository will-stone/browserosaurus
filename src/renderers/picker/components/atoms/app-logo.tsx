import clsx from 'clsx'

import type { InstalledApp } from '../../../shared/state/hooks'

interface Props extends React.ComponentPropsWithoutRef<'img'> {
  app: InstalledApp
  className?: string
  icon: string | undefined
}

const AppLogo = ({ app, className, icon }: Props): JSX.Element => {
  return (
    <img
      alt=""
      className={clsx(className, 'no-drag', !icon && 'hidden')}
      data-testid={app.name}
      src={icon || ''}
    />
  )
}

export default AppLogo
