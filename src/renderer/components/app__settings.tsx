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
import { css } from 'emotion'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import { Store as MainStore } from '../../main/store'
import { useSelector, useShallowEqualSelector } from '../store'
import {
  clickedCloseMenuButton,
  clickedQuitButton,
  clickedReloadButton,
  clickedSetAsDefaultButton,
  clickedSponsorButton,
  clickedThemeButton,
  clickedUpdateButton,
  madeTileFav,
  toggledTileVisibility,
  updatedTileHotkey,
} from '../store/actions'
import { themes } from '../themes'
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
  const theme = useSelector((state) => state.mainStore.theme)
  const hiddenTileIds = useShallowEqualSelector(
    (state) => state.mainStore.hiddenTileIds,
  )
  const isDefaultProtocolClient = useSelector(
    (state) => state.ui.isDefaultProtocolClient,
  )
  const updateStatus = useSelector((state) => state.ui.updateStatus)
  const menu = useSelector((state) => state.ui.menu)
  const version = useSelector((state) => state.ui.version)

  const handleCloseButtonClick = useCallback(
    () => dispatch(clickedCloseMenuButton()),
    [dispatch],
  )

  const handleUpdateButtonClick = useCallback(
    () => dispatch(clickedUpdateButton()),
    [dispatch],
  )

  const handleSetAsDefaultButtonClick = useCallback(
    () => dispatch(clickedSetAsDefaultButton()),
    [dispatch],
  )

  const handleClickThemeButton = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
      dispatch(
        clickedThemeButton(event.currentTarget.value as MainStore['theme']),
      ),
    [dispatch],
  )

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      dispatch(
        updatedTileHotkey({
          appId: event.currentTarget.dataset.appId || '',
          value: event.currentTarget.value,
        }),
      ),
    [dispatch],
  )

  const handleFavClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
      dispatch(madeTileFav(event.currentTarget.dataset.appId || '')),
    [dispatch],
  )

  const handleVisibilityClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
      dispatch(toggledTileVisibility(event.currentTarget.dataset.appId || '')),
    [dispatch],
  )

  const handleSponsorClick = useCallback(
    () => dispatch(clickedSponsorButton()),
    [dispatch],
  )

  const handleReloadClick = useCallback(() => dispatch(clickedReloadButton()), [
    dispatch,
  ])

  const handleQuitClick = useCallback(() => dispatch(clickedQuitButton()), [
    dispatch,
  ])

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
          'absolute inset-0 rounded border-2 shadow-xl z-30 grid grid-cols-2',
          css({
            color: themes[theme].settings.text,
            backgroundColor: themes[theme].settings.bg,
            borderColor: themes[theme].settings.border,
          }),
        )}
      >
        <div
          className={clsx(
            'overflow-hidden flex flex-col border-r-2',
            css({ borderColor: themes[theme].settings.border }),
          )}
        >
          <div
            className={clsx(
              'flex-shrink-0 flex justify-between px-4 py-2 border-b-2',
              css({ borderColor: themes[theme].settings.border }),
            )}
          >
            <Button
              aria-label="Close menu"
              data-for="close"
              data-tip
              onClick={handleCloseButtonClick}
            >
              <FontAwesomeIcon fixedWidth icon={faTimes} />
              <ReactTooltip
                backgroundColor={themes[theme].tooltip.bg}
                delayShow={500}
                effect="solid"
                id="close"
                place="bottom"
              >
                <span className={css({ color: themes[theme].tooltip.text })}>
                  Close menu
                </span>
              </ReactTooltip>
            </Button>

            <div className="space-x-2">
              {!isDefaultProtocolClient && (
                <Button
                  aria-label="Set as default browser"
                  onClick={handleSetAsDefaultButtonClick}
                >
                  Set As Default Browser
                </Button>
              )}

              {updateStatus === 'downloaded' && (
                <Button
                  aria-label="Restart and update"
                  className="space-x-2"
                  onClick={handleUpdateButtonClick}
                  tone="primary"
                >
                  <FontAwesomeIcon icon={faGift} />
                  <span>Restart & Update</span>
                </Button>
              )}

              {updateStatus === 'available' && (
                <Button
                  aria-label="Downloading update"
                  className="space-x-2"
                  disabled
                  tone="primary"
                >
                  <FontAwesomeIcon icon={faGift} />
                  <span>Downloading update…</span>
                </Button>
              )}

              {updateStatus === 'no-update' && (
                <Button
                  aria-label="Reload"
                  data-for="reload"
                  data-tip
                  onClick={handleReloadClick}
                >
                  <FontAwesomeIcon fixedWidth icon={faSync} />
                  <ReactTooltip
                    backgroundColor={themes[theme].tooltip.bg}
                    delayShow={500}
                    effect="solid"
                    id="reload"
                    place="bottom"
                  >
                    <span
                      className={css({
                        color: themes[theme].tooltip.text,
                      })}
                    >
                      Reload Browserosaurus
                    </span>
                  </ReactTooltip>
                </Button>
              )}

              <Button
                aria-label="Quit"
                className="space-x-2"
                onClick={handleQuitClick}
              >
                <FontAwesomeIcon fixedWidth icon={faSignOutAlt} />
                <span>Quit</span>
              </Button>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            <div className="pt-4 px-4 pb-12">
              <p className="mb-4 font-medium">
                Maintaining open source projects takes a lot of time. With your
                support I can continue to maintain projects such as this one,
                which is free and always will be.
              </p>
              <Button
                aria-label="Sponsor"
                className="w-full mb-4"
                onClick={handleSponsorClick}
                size="md"
                tone="sponsor"
              >
                <FontAwesomeIcon fixedWidth icon={faHeart} />
                <span>Sponsor from $1 / month</span>
              </Button>

              <h3 className="mb-3 underline text-center">Theme</h3>
              <p className="flex flex-wrap gap-2 justify-center">
                {Object.entries(themes).map(([themeKey, themeInfo]) => {
                  return (
                    <Button
                      key={themeKey}
                      className="relative pr-8"
                      onClick={handleClickThemeButton}
                      value={themeKey}
                    >
                      <span>{themeKey}</span>
                      <span className="absolute top-0 right-0 bottom-0 flex flex-col h-full w-6">
                        <span
                          className={clsx(
                            'flex-grow',
                            css({
                              backgroundColor: themeInfo.sample.a,
                            }),
                          )}
                        />
                        <span
                          className={clsx(
                            'flex-grow',
                            css({
                              backgroundColor: themeInfo.sample.b,
                            }),
                          )}
                        />
                        <span
                          className={clsx(
                            'flex-grow',
                            css({
                              backgroundColor: themeInfo.sample.c,
                            }),
                          )}
                        />
                      </span>
                    </Button>
                  )
                })}
              </p>
            </div>
          </div>
          <div
            className={clsx(
              'text-xxs absolute bottom-0 left-0 pt-2 pr-2 pb-1 pl-1 rounded-tr',
              css({
                backgroundColor: themes[theme].settings.border,
              }),
            )}
          >
            {version}
          </div>
        </div>

        <div className="text-sm flex overflow-hidden">
          <div className="px-4 py-8 space-y-3 text-xs w-48">
            <div className="space-x-2">
              <FontAwesomeIcon
                className={css({ color: themes[theme].icons.star })}
                fixedWidth
                icon={faStar}
              />
              <span>
                Assign <Kbd>space</Kbd> key
              </span>
            </div>
            <div className="space-x-2">
              <FontAwesomeIcon
                className={css({ color: themes[theme].icons.eye })}
                fixedWidth
                icon={faEye}
              />
              <span>Show / hide</span>
            </div>
            <div className="flex items-center  space-x-2">
              <FontAwesomeIcon
                className={css({ color: themes[theme].icons.keyboard })}
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
                        className={css({
                          color: isFav
                            ? themes[theme].icons.star
                            : themes[theme].button.text.disabled,
                        })}
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
                        className={css({
                          color: isVisible
                            ? themes[theme].icons.eye
                            : themes[theme].button.text.disabled,
                        })}
                        fixedWidth
                        icon={isVisible ? faEye : faEyeSlash}
                      />
                    </button>

                    <div
                      className={clsx(
                        'flex-shrink-0 relative w-10 h-8 rounded-full',
                        css({
                          backgroundColor: themes[theme].button.bg,
                        }),
                      )}
                    >
                      {!hotkey && (
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                          <FontAwesomeIcon
                            className={css({
                              color: themes[theme].icons.keyboard,
                            })}
                            fixedWidth
                            icon={faKeyboard}
                          />
                        </div>
                      )}
                      <input
                        className={clsx(
                          'bg-transparent w-full h-full absolute z-10 text-center uppercase focus:outline-none',
                          css({
                            color: themes[theme].button.text.base,
                          }),
                        )}
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
