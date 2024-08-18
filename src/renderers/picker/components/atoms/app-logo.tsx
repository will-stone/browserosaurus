import clsx from 'clsx'

import type { InstalledApp } from '../../../shared/state/hooks'

type Props = React.ComponentPropsWithoutRef<'img'> & {
  readonly app: InstalledApp
  readonly className?: string
  readonly icon: string | undefined
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
