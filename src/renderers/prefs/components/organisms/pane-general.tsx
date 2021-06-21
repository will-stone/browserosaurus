import React from 'react'
import { useDispatch } from 'react-redux'

import { clickedSetAsDefaultBrowserButton } from '../../../../shared/state/actions'
import { useSelector } from '../../../../shared/state/hooks'
import Button from '../../../shared/components/atoms/button'
import { Pane } from '../molecules/pane'

interface RowProps {
  children: React.ReactNode
}

const Row = ({ children }: RowProps): JSX.Element => (
  <div className="grid grid-cols-12 gap-4 items-center">{children}</div>
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

  return (
    <Pane pane="general">
      <Row>
        <Left>Default browser:</Left>
        <Right>
          {isDefaultProtocolClient ? (
            'Browserosaurus is the default browser'
          ) : (
            <Button
              onClick={() => dispatch(clickedSetAsDefaultBrowserButton())}
            >
              Set As Default Browser
            </Button>
          )}
        </Right>
      </Row>
    </Pane>
  )
}
