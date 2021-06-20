import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { logos } from '../../../config/logos'
import { prefsStarted } from '../../../shared/state/actions'
import { useApps, useSelector } from '../../../shared/state/hooks'
import Button from '../../shared/components/atoms/button'
import { EyeIcon, StarIcon } from '../../shared/components/atoms/icons'
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
      <div className="flex-grow overflow-y-auto">
        <div className="p-8">
          <table className="table-fixed w-10/12 mx-auto">
            <thead>
              <tr>
                <th className="p-4 text-left border-b border-gray-500 border-opacity-25 w-1/3">
                  App
                </th>
                <th className="p-4 border-b border-gray-500 border-opacity-25">
                  Favourite
                </th>
                <th className="p-4 border-b border-gray-500 border-opacity-25">
                  Visibility
                </th>
                <th className="p-4 border-b border-gray-500 border-opacity-25">
                  Hotkey
                </th>
              </tr>
            </thead>
            <tbody>
              {apps.map(({ id, name }) => (
                <tr key={id}>
                  <td className="p-4 text-left border-b border-gray-500 border-opacity-25">
                    <div className="flex items-center">
                      <img alt="" className="h-8 w-8 mr-4" src={logos[id]} />
                      <span>{name}</span>
                    </div>
                  </td>
                  <td className="p-4 border-b border-gray-500 border-opacity-25 text-center">
                    <Button>
                      <StarIcon className="h-5 w-5" />
                    </Button>
                  </td>
                  <td className="p-4 border-b border-gray-500 border-opacity-25 text-center">
                    <Button>
                      <EyeIcon className="h-5 w-5" />
                    </Button>
                  </td>
                  <td className="p-4 border-b border-gray-500 border-opacity-25 text-center">
                    F
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
