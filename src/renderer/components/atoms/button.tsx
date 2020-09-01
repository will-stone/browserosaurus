/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-multi-comp */

import clsx from 'clsx'
import React from 'react'

interface LightButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  tone?: 'primary' | 'sponsor'
}

export const LightButton: React.FC<LightButtonProps> = ({
  className,
  disabled,
  tone,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- type is hardcoded
  type,
  ...restProperties
}) => {
  return (
    <button
      className={clsx(
        className,
        'active:shadow-none focus:outline-none',
        'bg-grey-600',
        'px-3 py-2',
        'rounded-md',
        'text-xs font-bold leading-none',
        !disabled && tone === 'primary' && 'text-blue-400 active:text-blue-300',
        !disabled && tone === 'sponsor' && 'text-pink-400 active:text-pink-300',
        !disabled && !tone && 'text-grey-300 active:text-grey-200',
        disabled ? 'bg-transparent text-grey-500' : 'bg-grey-700',
      )}
      disabled={disabled}
      type="button"
      {...restProperties}
    />
  )
}

interface DarkButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  tone?: 'primary' | 'sponsor'
}

export const DarkButton: React.FC<DarkButtonProps> = ({
  className,
  disabled,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- type is hardcoded
  type,
  tone,
  ...restProperties
}) => {
  return (
    <button
      className={clsx(
        className,
        'active:shadow-none focus:outline-none',
        'px-2 py-2',
        'rounded-md',
        'text-xxs font-bold',
        !disabled && tone === 'primary' && 'text-blue-400 active:text-blue-300',
        !disabled && tone === 'sponsor' && 'text-pink-400 active:text-pink-300',
        !disabled && !tone && 'text-grey-300 active:text-grey-200',
        disabled ? 'bg-transparent text-grey-500' : 'bg-grey-700',
      )}
      disabled={disabled}
      type="button"
      {...restProperties}
    />
  )
}
