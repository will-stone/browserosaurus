/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-multi-comp */

import cc from 'classcat'
import React from 'react'

interface Props extends React.ComponentPropsWithoutRef<'button'> {
  tone?: 'primary'
}

const BaseButton: React.FC<Props> = ({
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
        'text-xs font-bold leading-none',
        'cursor-default',
        {
          'text-blue-400 active:text-blue-200': !disabled && tone === 'primary',
        },
        { 'active:text-grey-200': !disabled && !tone },
        { 'shadow-md': !disabled },
      ])}
      disabled={disabled}
      type="button"
      {...restProperties}
    />
  )
}

export const LightButton: React.FC<Props> = ({
  className,
  disabled,
  ...restProperties
}) => {
  return (
    <BaseButton
      className={cc([
        className,
        'py-2 px-3',
        'space-x-2',
        { 'bg-grey-600 text-grey-300': !disabled },
        { 'bg-grey-700 text-grey-500': disabled },
      ])}
      disabled={disabled}
      {...restProperties}
    />
  )
}

export const DarkButton: React.FC<Props> = ({
  className,
  disabled,
  ...restProperties
}) => {
  return (
    <BaseButton
      className={cc([
        className,
        'py-2 px-3',
        'space-x-2',
        { 'bg-grey-700 text-grey-300': !disabled },
        { 'bg-transparent text-grey-500': disabled },
      ])}
      disabled={disabled}
      {...restProperties}
    />
  )
}

export const LargeDarkButton: React.FC<Props> = ({
  className,
  disabled,
  ...restProperties
}) => {
  return (
    <BaseButton
      className={cc([
        className,
        'h-24 text-left p-3',
        { 'bg-grey-700': !disabled },
      ])}
      disabled={disabled}
      {...restProperties}
    />
  )
}
