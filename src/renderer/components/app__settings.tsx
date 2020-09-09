import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faGift } from '@fortawesome/free-solid-svg-icons/faGift'
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition } from '@tailwindui/react'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import { quit, reload, setAsDefaultBrowser, updateRestart } from '../sendToMain'
import { useSelector, useShallowEqualSelector } from '../store'
import {
  clickedCloseMenuButton,
  clickedSponsorButton,
  madeTileFav,
  toggledTileVisibility,
  updatedTileHotkey,
} from '../store/actions'
import Button from './atoms/button'
import Kbd from './atoms/kbd'
import MouseDiv from './organisms/mouse-div'

function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
  event.target.select()
}

const Settings: React.FC = () => {
  const dispatch = useDispatch()
  const apps = useShallowEqualSelector((state) => state.apps)
  const hotkeys = useShallowEqualSelector((state) => state.mainStore.hotkeys)
  const favAppId = useSelector((state) => state.mainStore.fav)
  const hiddenTileIds = useShallowEqualSelector(
    (state) => state.mainStore.hiddenTileIds,
  )
  const isDefaultProtocolClient = useSelector(
    (state) => state.ui.isDefaultProtocolClient,
  )
  const updateStatus = useSelector((state) => state.ui.updateStatus)
  const menu = useSelector((state) => state.ui.menu)
  const version = useSelector((state) => state.ui.version)

  const handleCloseButtonClick = useCallback(() => {
    dispatch(clickedCloseMenuButton())
  }, [dispatch])

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { appId = '' } = event.currentTarget.dataset
      dispatch(
        updatedTileHotkey({
          appId,
          value: event.currentTarget.value,
        }),
      )
    },
    [dispatch],
  )

  const handleFavClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const { appId = '' } = event.currentTarget.dataset
      dispatch(madeTileFav(appId))
    },
    [dispatch],
  )

  const handleVisibilityClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const { appId = '' } = event.currentTarget.dataset
      dispatch(toggledTileVisibility(appId))
    },
    [dispatch],
  )

  const handleSponsorClick = useCallback(() => {
    dispatch(clickedSponsorButton())
  }, [dispatch])

  return (
    <Transition
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      show={menu === 'tiles'}
    >
      <MouseDiv
        capture
        className={clsx(
          'absolute bg-grey-800 rounded border-4 border-grey-600 shadow-xl z-30 grid grid-cols-2 divide-x-2 divide-grey-600',
        )}
        style={{ top: '0', right: '0', bottom: '0', left: '0' }}
      >
        <div className="overflow-hidden flex flex-col">
          <div className="flex-shrink-0 flex justify-between p-2 border-b-2 border-grey-600">
            <Button
              aria-label="Close menu"
              data-for="close"
              data-tip
              onClick={handleCloseButtonClick}
            >
              <FontAwesomeIcon fixedWidth icon={faTimes} />
              <ReactTooltip
                backgroundColor="#0D1117"
                delayShow={500}
                effect="solid"
                id="close"
                place="bottom"
              >
                <span className="font-bold text-grey-200">Close menu</span>
              </ReactTooltip>
            </Button>

            <div className="space-x-2">
              {!isDefaultProtocolClient && (
                <Button onClick={setAsDefaultBrowser}>
                  Set As Default Browser
                </Button>
              )}

              {updateStatus === 'downloaded' && (
                <Button
                  className="space-x-2"
                  onClick={updateRestart}
                  tone="primary"
                >
                  <FontAwesomeIcon icon={faGift} />
                  <span>Restart & Update</span>
                </Button>
              )}

              {updateStatus === 'available' && (
                <Button className="space-x-2" disabled tone="primary">
                  <FontAwesomeIcon icon={faGift} />
                  <span>Downloading update…</span>
                </Button>
              )}

              {updateStatus === 'no-update' && (
                <Button data-for="reload" data-tip onClick={reload}>
                  <FontAwesomeIcon fixedWidth icon={faSync} />
                  <ReactTooltip
                    backgroundColor="#0D1117"
                    delayShow={500}
                    effect="solid"
                    id="reload"
                    place="bottom"
                  >
                    <span className="font-bold text-grey-200">
                      Reload Browserosaurus
                    </span>
                  </ReactTooltip>
                </Button>
              )}

              <Button className="space-x-2" onClick={quit}>
                <FontAwesomeIcon fixedWidth icon={faSignOutAlt} />
                <span>Quit</span>
              </Button>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            <div className="p-4">
              <p className="mb-4 font-medium">
                Maintaining open source projects takes a lot of time. With your
                support I can continue to maintain projects such as this one,
                which is free and always will be.
              </p>
              <Button
                className="w-full mb-4"
                onClick={handleSponsorClick}
                size="md"
                tone="sponsor"
              >
                <FontAwesomeIcon fixedWidth icon={faHeart} />
                <span>Sponsor from $1 / month</span>
              </Button>
              <div className="text-xxs font-bold text-grey-600">{version}</div>
            </div>
          </div>
        </div>

        <div className="font-bold text-sm flex overflow-hidden">
          <div className="px-4 py-8 space-y-3 text-xs w-48 bg-grey-700">
            <div className="space-x-2">
              <FontAwesomeIcon
                className="text-yellow-400"
                fixedWidth
                icon={faStar}
              />
              <span>
                Assign <Kbd>space</Kbd> key
              </span>
            </div>
            <div className="space-x-2">
              <FontAwesomeIcon
                className="text-purple-500"
                fixedWidth
                icon={faEye}
              />
              <span>Show / hide</span>
            </div>
            <div className="flex items-center  space-x-2">
              <FontAwesomeIcon
                className="text-blue-400"
                fixedWidth
                icon={faKeyboard}
              />
              <span>Assign single letters or numbers as hotkeys</span>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto">
            <div className="p-4 space-y-2">
              {apps.map((app) => {
                const hotkey =
                  Object.keys(hotkeys).find((key) => hotkeys[key] === app.id) ||
                  ''
                const isFav = favAppId === app.id
                const isVisible = !hiddenTileIds.includes(app.id)
                return (
                  <div key={app.id} className="space-x-3 flex items-center">
                    <span className="inline-block mr-auto">{app.name}</span>

                    <button
                      aria-label={`Favourite ${app.name}`}
                      className="flex-shrink-0 focus:outline-none"
                      data-app-id={app.id}
                      onClick={handleFavClick}
                      tabIndex={-1}
                      type="button"
                    >
                      <FontAwesomeIcon
                        className={isFav ? 'text-yellow-400' : 'text-grey-500'}
                        fixedWidth
                        icon={faStar}
                      />
                    </button>

                    <button
                      aria-label={`Toggle Visibility ${app.name}`}
                      className="flex-shrink-0 focus:outline-none"
                      data-app-id={app.id}
                      onClick={handleVisibilityClick}
                      tabIndex={-1}
                      type="button"
                    >
                      <FontAwesomeIcon
                        className={
                          isVisible ? 'text-purple-500' : 'text-grey-500'
                        }
                        fixedWidth
                        icon={isVisible ? faEye : faEyeSlash}
                      />
                    </button>

                    <div className="flex-shrink-0 relative w-10 h-8 bg-grey-600 rounded-full">
                      {!hotkey && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                          <FontAwesomeIcon
                            className="text-blue-400"
                            fixedWidth
                            icon={faKeyboard}
                          />
                        </div>
                      )}
                      <input
                        className="bg-transparent w-full h-full absolute z-10 text-grey-200 text-center uppercase font-bold focus:outline-none"
                        data-app-id={app.id}
                        maxLength={1}
                        minLength={0}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        type="text"
                        value={hotkey}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </MouseDiv>
    </Transition>
  )
}

export default Settings
