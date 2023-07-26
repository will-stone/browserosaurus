import clsx from 'clsx'

type Props = {
  readonly children: React.ReactNode
  readonly className?: string
  readonly style?: React.CSSProperties
}

const Kbd = ({ children, className, style }: Props): JSX.Element => {
  return (
    <kbd
      className={clsx(
        className,
        'rounded text-center text-xs font-bold uppercase',
        'border border-gray-400 bg-black/5 px-2 py-0.5 dark:border-black dark:bg-black/30',
      )}
      style={style}
    >
      {children}
    </kbd>
  )
}

export default Kbd
