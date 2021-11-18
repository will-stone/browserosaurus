import {
  ArrowSmDownIcon,
  ArrowSmUpIcon,
  StarIcon,
  SwitchVerticalIcon,
} from '@heroicons/react/solid'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import type { DropResult } from 'react-beautiful-dnd'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'

import { apps } from '../../../../config/apps'
import { changedHotkey, reorderedApps } from '../../../../shared/state/actions'
import { useInstalledApps } from '../../../../shared/state/hooks'
import Input from '../../../shared/components/atoms/input'
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

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return
      }

      if (result.destination.index === result.source.index) {
        return
      }

      dispatch(
        reorderedApps({
          source: result.source.index,
          destination: result.destination.index,
        }),
      )
    },
    [dispatch],
  )

  return (
    <Pane pane="apps">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              className="overflow-y-auto p-2"
              {...droppableProvided.droppableProps}
            >
              {installedApps.map(({ id, name, hotkey }, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(draggableProvided, draggableSnapshop) => (
                    <div
                      ref={draggableProvided.innerRef}
                      className={clsx(
                        'flex',
                        'bg-black dark:bg-white bg-opacity-5 dark:bg-opacity-5 shadow',
                        'rounded-xl mb-4',
                        'focus-visible:outline-none focus-visible:bg-white dark:focus-visible:bg-black focus-visible:bg-opacity-70 focus-visible:shadow-xl focus-visible:ring-1 focus-visible:ring-gray-500',
                        draggableSnapshop.isDragging &&
                          'focus-visible:ring-2 dark:focus-visible:ring-gray-100 focus-visible:ring-gray-900',
                      )}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      <div className="flex items-center justify-center pl-4">
                        <DragDirectionArrow
                          className={clsx(
                            'h-4',
                            draggableSnapshop.isDragging
                              ? 'text-black dark:text-white'
                              : 'opacity-30',
                          )}
                          currentIndex={index}
                          endIndex={installedApps.length - 1}
                        />
                      </div>
                      <div className="flex items-center justify-center p-4 w-16">
                        {index === 0 ? (
                          <StarIcon className="text-yellow-600 dark:text-yellow-400 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-grow flex items-center p-4">
                        <img
                          alt=""
                          className="h-8 w-8 mr-4"
                          src={apps[id].logo}
                        />
                        <span>{name}</span>
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
