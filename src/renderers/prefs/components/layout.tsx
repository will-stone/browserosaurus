import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { logos } from '../../../config/logos'
import {
  changedHotkey,
  clickedEyeButton,
  clickedFavButton,
  prefsStarted,
} from '../../../shared/state/actions'
import { useApps, useSelector } from '../../../shared/state/hooks'
import Button from '../../shared/components/atoms/button'
import {
  EyeIcon,
  EyeOffIcon,
  StarIcon,
} from '../../shared/components/atoms/icons'
import { HeaderBar } from './organisms/header-bar'

const useAppStarted = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(prefsStarted())
  }, [dispatch])
}

const Layout = (): JSX.Element => {
  /**
   * Tell main that renderer is available
   */
  useAppStarted()

  const dispatch = useDispatch()

  const apps = useApps()
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

  return (
    <div
      className={clsx(
        'flex flex-col max-h-screen',
        isDarkMode ? 'text-gray-400' : 'text-gray-700',
      )}
    >
      <HeaderBar className="flex-shrink-0" />
      <div className="flex-grow overflow-hidden p-8 flex">
        <div
          className={clsx(
            isDarkMode ? 'bg-white border-white' : 'bg-black border-black',
            'bg-opacity-5 mx-auto overflow-y-auto pb-8 rounded border border-opacity-10',
          )}
        >
          <table className="table-fixed w-full">
            <thead>
              <tr>
                <th
                  className={clsx(
                    'sticky top-0 z-10 p-4 text-left w-1/3',
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-300',
                  )}
                >
                  Tile
                </th>
                <th
                  className={clsx(
                    'sticky top-0 z-10 p-4',
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-300',
                  )}
                >
                  Favourite
                </th>
                <th
                  className={clsx(
                    'sticky top-0 z-10 p-4',
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-300',
                  )}
                >
                  Visibility
                </th>
                <th
                  className={clsx(
                    'sticky top-0 z-10 p-4',
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-300',
                  )}
                >
                  Hotkey
                </th>
              </tr>
            </thead>
            <tbody>
              {apps.map(({ id, name, isVisible, isFav, hotkey }) => (
                <tr key={id}>
                  <td className="p-4 text-left border-b border-gray-500 border-opacity-25">
                    <div
                      className={clsx(
                        'flex items-center',
                        !isVisible && 'opacity-50',
                      )}
                    >
                      <img alt="" className="h-8 w-8 mr-4" src={logos[id]} />
                      <span>{name}</span>
                    </div>
                  </td>
                  <td className="p-4 border-b border-gray-500 border-opacity-25 text-center">
                    <Button onClick={() => dispatch(clickedFavButton(id))}>
                      <StarIcon
                        className={clsx(
                          'h-6 w-6',
                          isFav ? 'text-yellow-500' : 'opacity-50',
                        )}
                      />
                    </Button>
                  </td>
                  <td className="p-4 border-b border-gray-500 border-opacity-25 text-center">
                    <Button onClick={() => dispatch(clickedEyeButton(id))}>
                      {isVisible ? (
                        <EyeIcon className="h-6 w-6 text-blue-500" />
                      ) : (
                        <EyeOffIcon className="h-6 w-6 opacity-50" />
                      )}
                    </Button>
                  </td>
                  <td className="p-4 border-b border-gray-500 border-opacity-25 text-center">
                    <input
                      aria-label={`${name} hotkey`}
                      className={clsx(
                        'uppercase focus:outline-none min-w-0 w-full text-center rounded',
                        'shadow bg-opacity-50',
                        isDarkMode
                          ? 'text-white bg-black'
                          : 'text-black bg-white',
                      )}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Layout
