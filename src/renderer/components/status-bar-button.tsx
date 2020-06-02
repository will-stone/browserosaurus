import cc from 'classcat'
import React from 'react'

interface Props extends React.ComponentPropsWithoutRef<'button'> {
  tone?: 'primary'
}

const StatusBarButton: React.FC<Props> = ({
  disabled,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- type is hardcoded
  type,
  className,
  tone,
  ...restProperties
}) => {
  return (
    <button
      className={cc([
        className,
        'border border-grey-900 rounded active:shadow-none focus:outline-none',
        'text-xs font-bold',
        'py-2 px-3',
        'space-x-2',
        'cursor-default',
        {
          'text-blue-400 active:text-blue-200': !disabled && tone === 'primary',
        },
        { 'text-grey-300 active:text-grey-200': !disabled && !tone },
        { 'bg-grey-600 shadow-md': !disabled },
        { 'bg-grey-700 text-grey-500': disabled },
      ])}
      disabled={disabled}
      type="button"
      {...restProperties}
    />
  )
}

export default StatusBarButton
