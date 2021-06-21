import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'

import { logos } from '../../../../config/logos'
import {
  changedHotkey,
  clickedEyeButton,
  clickedFavButton,
} from '../../../../shared/state/actions'
import { useApps } from '../../../../shared/state/hooks'
import Button from '../../../shared/components/atoms/button'
import {
  EyeIcon,
  EyeOffIcon,
  StarIcon,
} from '../../../shared/components/atoms/icons'
import Input from '../../../shared/components/atoms/input'
import { Pane } from '../molecules/pane'

export function AppsPane(): JSX.Element {
  const dispatch = useDispatch()

  const apps = useApps()

  return (
    <Pane
      className="border border-opacity-10 dark:border-opacity-10 border-black dark:border-white rounded"
      pane="tiles"
    >
      <div className="grid grid-cols-4 bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10">
        <div className="p-4">Tile</div>
        <div className="p-4 text-center">Favourite</div>
        <div className="p-4 text-center">Visibility</div>
        <div className="p-4 text-center">Hotkey</div>
      </div>
      <div className="overflow-y-auto">
        {apps.map(({ id, name, isVisible, isFav, hotkey }, index) => {
          const isOdd = index % 2 !== 0
          return (
            <div
              key={id}
              className={clsx(
                'grid grid-cols-4',
                isOdd && 'bg-black dark:bg-white',
                'bg-opacity-5 dark:bg-opacity-5',
              )}
            >
              <div
                className={clsx(
                  'flex items-center p-4',
                  !isVisible && 'opacity-50',
                )}
              >
                <img alt="" className="h-8 w-8 mr-4" src={logos[id]} />
                <span>{name}</span>
              </div>
              <div className="p-4 flex items-center justify-center">
                <Button onClick={() => dispatch(clickedFavButton(id))}>
                  <StarIcon
                    className={clsx(
                      'h-6 w-6',
                      isFav
                        ? 'text-yellow-500 dark:text-yellow-400'
                        : 'opacity-50',
                    )}
                  />
                </Button>
              </div>
              <div className="p-4 flex items-center justify-center">
                <Button onClick={() => dispatch(clickedEyeButton(id))}>
                  {isVisible ? (
                    <EyeIcon className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                  ) : (
                    <EyeOffIcon className="h-6 w-6 opacity-40" />
                  )}
                </Button>
              </div>
              <div className="p-4 flex items-center justify-center">
                <Input
                  aria-label={`${name} hotkey`}
                  className="h-8 w-12"
                  data-app-id={id}
                  maxLength={1}
                  minLength={0}
                  onChange={(event) => {
                    dispatch(
                      changedHotkey({
                        appId: id,
                        value: event.currentTarget.value,
                      }),
                    )
                  }}
                  onFocus={(event) => {
                    event.target.select()
                  }}
                  placeholder="Key"
                  type="text"
                  value={hotkey || ''}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Pane>
  )
}
