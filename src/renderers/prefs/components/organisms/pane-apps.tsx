import ArrowSmDownIcon from '@heroicons/react/solid/ArrowSmDownIcon'
import ArrowSmUpIcon from '@heroicons/react/solid/ArrowSmUpIcon'
import SwitchVerticalIcon from '@heroicons/react/solid/SwitchVerticalIcon'
import clsx from 'clsx'
import React from 'react'
import type { DropResult } from 'react-beautiful-dnd'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'

import Input from '../../../shared/components/atoms/input'
import { Spinner } from '../../../shared/components/atoms/spinner'
import { useInstalledApps, useKeyCodeMap } from '../../../shared/state/hooks'
import { reorderedApp, updatedHotCode } from '../../state/actions'
import { Pane } from '../molecules/pane'

interface DragDirectionArrowProps {
  currentIndex: number
  endIndex: number
  className: string
}

const DragDirectionArrow = ({
  currentIndex,
  endIndex,
  className,
}: DragDirectionArrowProps) => {
  if (currentIndex === 0) {
    return <ArrowSmDownIcon className={className} />
  }

  if (currentIndex === endIndex) {
    return <ArrowSmUpIcon className={className} />
  }

  return <SwitchVerticalIcon className={className} />
}

export function AppsPane(): JSX.Element {
  const dispatch = useDispatch()

  const installedApps = useInstalledApps()

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    dispatch(
      reorderedApp({
        sourceId: installedApps[result.source.index].id,
        destinationId: installedApps[result.destination.index].id,
      }),
    )
  }

  const keyCodeMap = useKeyCodeMap()

  return (
    <Pane pane="apps">
      {installedApps.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              className="overflow-y-auto p-2"
              {...droppableProvided.droppableProps}
            >
              {installedApps.map(({ id, name, hotCode, icon }, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(draggableProvided, draggableSnapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      className={clsx(
                        'flex',
                        'bg-black dark:bg-white bg-opacity-5 dark:bg-opacity-5 shadow',
                        'rounded-xl mb-4',
                        'focus-visible:outline-none focus-visible:bg-white dark:focus-visible:bg-black focus-visible:bg-opacity-70 focus-visible:shadow-xl focus-visible:ring-1 focus-visible:ring-gray-500',
                        draggableSnapshot.isDragging &&
                          'focus-visible:ring-2 dark:focus-visible:ring-gray-100 focus-visible:ring-gray-900',
                      )}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      <div className="flex items-center justify-center pl-4">
                        <DragDirectionArrow
                          className={clsx(
                            'h-4',
                            draggableSnapshot.isDragging
                              ? 'text-black dark:text-white'
                              : 'opacity-30',
                          )}
                          currentIndex={index}
                          endIndex={installedApps.length - 1}
                        />
                      </div>
                      <div className="flex items-center justify-center p-4 w-16">
                        {index + 1}
                      </div>
                      <div className="flex-grow flex items-center p-4">
                        <img alt="" className="h-8 w-8 mr-4" src={icon} />
                        <span>{name}</span>
                      </div>
                      <div className="p-4 flex items-center justify-center">
                        <Input
                          aria-label={`${name} hotkey`}
                          className="h-8 w-12"
                          data-app-id={id}
                          maxLength={1}
                          minLength={0}
                          onFocus={(event) => {
                            event.target.select()
                          }}
                          onKeyPress={(event) => {
                            dispatch(
                              updatedHotCode({
                                appId: id,
                                value: event.code,
                              }),
                            )
                          }}
                          placeholder="Key"
                          type="text"
                          value={keyCodeMap[hotCode || ''] || ''}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Pane>
  )
}
