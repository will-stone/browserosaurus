import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faGift } from '@fortawesome/free-solid-svg-icons/faGift'
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition } from '@tailwindui/react'
import clsx from 'clsx'
import { css } from 'emotion'
import React from 'react'
import { useDispatch } from 'react-redux'

import { Store as MainStore } from '../../../main/store'
import {
  quit,
  reload,
  setAsDefaultBrowser,
  updateRestart,
} from '../../sendToMain'
import { useSelector } from '../../store'
import {
  changedHotkey,
  clickedCloseMenuButton,
  clickedEyeButton,
  clickedFavButton,
  clickedSetAsDefaultButton,
  clickedSponsorButton,
  clickedThemeButton,
  clickedVersionButton,
} from '../../store/actions'
import { useApps, useTheme } from '../../store/selector-hooks'
import { themes } from '../../themes'
import Button from '../atoms/button'
import Kbd from '../atoms/kbd'

const Settings: React.FC = () => {
  const dispatch = useDispatch()
  const apps = useApps()
  const theme = useTheme()
  const isDefaultProtocolClient = useSelector(
    (state) => state.ui.isDefaultProtocolClient,
  )
  const updateStatus = useSelector((state) => state.ui.updateStatus)
  const menu = useSelector((state) => state.ui.menu)
  const version = useSelector((state) => state.ui.version)

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
      <div
        className={clsx(
          'absolute inset-0 rounded shadow-xl z-30 flex flex-col',
          css({
            color: themes[theme].settings.text,
            backgroundColor: themes[theme].bg,
          }),
        )}
      >
        <div
          className={clsx(
            'flex-shrink-0',
            'w-full',
            'flex items-center justify-between',
            'pl-20 pr-1',
            css({ backgroundColor: themes[theme].titleBarBg }),
          )}
          style={{ height: '39px' }}
        >
          <Button
            aria-label="Sponsor"
            className="space-x-2"
            onClick={() => dispatch(clickedSponsorButton())}
            tone="sponsor"
          >
            <FontAwesomeIcon icon={faHeart} />
            <span>Sponsor</span>
          </Button>

          <div className="flex-grow flex items-center justify-end space-x-4">
            {!isDefaultProtocolClient && (
              <Button
                aria-label="Set as default browser"
                onClick={() => {
                  dispatch(clickedSetAsDefaultButton())
                  setAsDefaultBrowser()
                }}
              >
                Set As Default Browser
              </Button>
            )}

            {updateStatus === 'downloaded' && (
              <Button
                aria-label="Restart and update"
                className="space-x-2"
                onClick={updateRestart}
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
                onClick={reload}
                title="Reload Browserosaurus"
              >
                <FontAwesomeIcon fixedWidth icon={faSync} />
              </Button>
            )}

            <Button aria-label="Quit" className="space-x-2" onClick={quit}>
              <FontAwesomeIcon fixedWidth icon={faSignOutAlt} />
              <span>Quit</span>
            </Button>

            <Button
              aria-label="Close menu"
              onClick={() => dispatch(clickedCloseMenuButton())}
              title="Close menu"
            >
              <FontAwesomeIcon fixedWidth icon={faTimes} />
            </Button>
          </div>
        </div>

        <div className={clsx('overflow-y-auto')}>
          <div className="p-4 space-x-8 text-xs flex justify-center">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon
                className={css({ color: themes[theme].icons.star })}
                icon={faStar}
              />
              <span>
                Assign <Kbd>space</Kbd> key
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon
                className={css({ color: themes[theme].icons.eye })}
                icon={faEye}
              />
              <span>Show / hide</span>
            </div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon
                className={css({ color: themes[theme].icons.keyboard })}
                icon={faKeyboard}
              />
              <span>Assign single letters or numbers as hotkeys</span>
            </div>
          </div>

          <div className="p-4 text-sm space-y-2">
            {apps.map((app) => (
              <div
                key={app.id}
                className="space-x-3 flex items-center justify-end"
              >
                <span className="inline-block">{app.name}</span>

                <button
                  aria-label={`Favourite ${app.name}`}
                  className="flex-shrink-0 focus:outline-none"
                  data-app-id={app.id}
                  onClick={(event) =>
                    dispatch(
                      clickedFavButton(event.currentTarget.dataset.appId || ''),
                    )
                  }
                  tabIndex={-1}
                  type="button"
                >
                  <FontAwesomeIcon
                    className={css({
                      color: app.isFav
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
                  onClick={(event) =>
                    dispatch(
                      clickedEyeButton(event.currentTarget.dataset.appId || ''),
                    )
                  }
                  tabIndex={-1}
                  type="button"
                >
                  <FontAwesomeIcon
                    className={css({
                      color: app.isVisible
                        ? themes[theme].icons.eye
                        : themes[theme].button.text.disabled,
                    })}
                    fixedWidth
                    icon={app.isVisible ? faEye : faEyeSlash}
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
                  {!app.hotkey && (
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
                    aria-label={`${app.name} hotkey`}
                    className={clsx(
                      'bg-transparent w-full h-full absolute z-10 text-center uppercase focus:outline-none',
                      css({
                        color: themes[theme].button.text.base,
                      }),
                    )}
                    data-app-id={app.id}
                    maxLength={1}
                    minLength={0}
                    onChange={(event) => {
                      dispatch(
                        changedHotkey({
                          appId: event.currentTarget.dataset.appId || '',
                          value: event.currentTarget.value,
                        }),
                      )
                    }}
                    onFocus={(event) => {
                      event.target.select()
                    }}
                    type="text"
                    value={app.hotkey || ''}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4">
            <p className="mb-4 font-medium">
              Maintaining open source projects takes a lot of time. With your
              support I can continue to maintain projects such as this one,
              which is free and always will be.
            </p>
            <p className="flex flex-wrap gap-2 justify-center">
              {Object.entries(themes).map(([themeKey, themeInfo]) => {
                return (
                  <Button
                    key={themeKey}
                    className="relative pr-8"
                    onClick={(event) =>
                      dispatch(
                        clickedThemeButton(
                          event.currentTarget.value as MainStore['theme'],
                        ),
                      )
                    }
                    value={themeKey}
                  >
                    <span>{themeKey.toUpperCase()}</span>
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

          <button
            className={clsx(
              'text-xxs pt-2 pr-2 pb-1 pl-1 rounded-tr',
              'active:shadow-none focus:outline-none active:opacity-75',
              css({
                backgroundColor: themes[theme].settings.border,
              }),
            )}
            onClick={() => dispatch(clickedVersionButton())}
            type="button"
          >
            {version}
          </button>
        </div>
      </div>
    </Transition>
  )
}

export default Settings
