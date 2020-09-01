/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-multi-comp */

import clsx from 'clsx'
import React from 'react'

type BaseButtonProps = React.ComponentPropsWithoutRef<'button'>

const BaseButton: React.FC<BaseButtonProps> = ({
  className,
  disabled,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- type is hardcoded
  type,
  ...restProperties
}) => {
  return (
    <button
      className={clsx(
        className,
        'border border-grey-900 rounded active:shadow-none focus:outline-none',
        'text-xs font-bold leading-none',
        !disabled && 'shadow-md',
      )}
      disabled={disabled}
      type="button"
      {...restProperties}
    />
  )
}

interface LightButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  tone?: 'primary' | 'sponsor'
}

export const LightButton: React.FC<LightButtonProps> = ({
  className,
  disabled,
  tone,
  ...restProperties
}) => {
  return (
    <BaseButton
      className={clsx(
        className,
        'py-2 px-3',
        'space-x-2',
        !disabled && tone === 'primary' && 'text-blue-400 active:text-blue-300',
        !disabled && tone === 'sponsor' && 'text-pink-400 active:text-pink-300',
        !disabled && !tone && 'text-grey-300 active:text-grey-200',
        disabled ? 'bg-grey-700 text-grey-500' : 'bg-grey-600',
      )}
      disabled={disabled}
      {...restProperties}
    />
  )
}

type NewLightButton = React.ComponentPropsWithoutRef<'button'>

export const NewLightButton: React.FC<NewLightButton> = ({
  className,
  disabled,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- type is hardcoded
  type,
  ...restProperties
}) => {
  return (
    <button
      className={clsx(
        className,
        'bg-grey-600',
        'px-3 py-2',
        'rounded-md',
        'text-xs font-bold leading-none focus:outline-none',
        disabled ? 'text-grey-500' : 'text-grey-200 active:text-white',
      )}
      disabled={disabled}
      type="button"
      {...restProperties}
    />
  )
}

interface NewDarkButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  tone?: 'primary' | 'sponsor'
}

export const NewDarkButton: React.FC<NewDarkButtonProps> = ({
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
        'px-2 py-1',
        'rounded-md',
        'text-xs font-bold',
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
