import clsx from 'clsx'

interface Props {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const Kbd = ({ children, className, style }: Props): JSX.Element => {
  return (
    <kbd
      className={clsx(
        className,
        'uppercase rounded text-center text-xs font-bold',
        'bg-black bg-opacity-5 dark:bg-opacity-30 py-1 px-2 border border-gray-400 dark:border-black',
      )}
      style={style}
    >
      {children}
    </kbd>
  )
}

export default Kbd
