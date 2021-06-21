import React from 'react'
import { useDispatch } from 'react-redux'

import {
  clickedRescanApps,
  clickedSetAsDefaultBrowserButton,
  clickedUpdateButton,
  clickedUpdateRestartButton,
} from '../../../../shared/state/actions'
import { useSelector } from '../../../../shared/state/hooks'
import Button from '../../../shared/components/atoms/button'
import { Pane } from '../molecules/pane'

interface RowProps {
  children: React.ReactNode
}

const Row = ({ children }: RowProps): JSX.Element => (
  <div className="grid grid-cols-12 gap-8">{children}</div>
)

interface LeftProps {
  children: React.ReactNode
}

const Left = ({ children }: LeftProps): JSX.Element => (
  <div className="text-right col-span-5">{children}</div>
)

interface RightProps {
  children: React.ReactNode
}

const Right = ({ children }: RightProps): JSX.Element => (
  <div className="col-span-7">{children}</div>
)

export const GeneralPane = (): JSX.Element => {
  const dispatch = useDispatch()

  const isDefaultProtocolClient = useSelector(
    (state) => state.data.isDefaultProtocolClient,
  )
  const updateStatus = useSelector((state) => state.data.updateStatus)

  const numberOfApps = useSelector((state) => state.apps.length)

  return (
    <Pane className="space-y-8" pane="general">
      <Row>
        <Left>Default web browser:</Left>
        <Right>
          {isDefaultProtocolClient ? (
            'Browserosaurus is the default web browser'
          ) : (
            <Button
              onClick={() => dispatch(clickedSetAsDefaultBrowserButton())}
            >
              Set As Default Browser
            </Button>
          )}
          <p className="text-sm mt-2 opacity-70">
            Setting Browserosaurus as your default web browser means links
            clicked outside of web browsers will open the picker window. This is
            the primary design of Browserosaurus. However, you can also
            programmatically send URLs to Browserosaurus.
          </p>
        </Right>
      </Row>

      <Row>
        <Left>Find apps:</Left>
        <Right>
          <Button onClick={() => dispatch(clickedRescanApps())}>Rescan</Button>
          <p className="text-sm mt-2 opacity-70">
            {numberOfApps} compatible apps found. Rescan if you have added or
            removed a compatible app whilst Browserosaurus is running.
          </p>
        </Right>
      </Row>

      <Row>
        <Left>Update:</Left>
        <Right>
          {updateStatus === 'available' && (
            <Button onClick={() => dispatch(clickedUpdateButton())}>
              Download Update
            </Button>
          )}
          {updateStatus === 'downloading' && 'Downloading…'}
          {updateStatus === 'downloaded' && (
            <Button onClick={() => dispatch(clickedUpdateRestartButton())}>
              Restart & Update
            </Button>
          )}
          {updateStatus === 'no-update' && 'No update available'}
        </Right>
      </Row>
    </Pane>
  )
}
