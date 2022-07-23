import type { DragEndEvent } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'

import type { AppId } from '../../../../config/apps'
import Input from '../../../shared/components/atoms/input'
import { Spinner } from '../../../shared/components/atoms/spinner'
import type { InstalledApp } from '../../../shared/state/hooks'
import {
  useDeepEqualSelector,
  useInstalledApps,
  useKeyCodeMap,
} from '../../../shared/state/hooks'
import { reorderedApp, updatedHotCode } from '../../state/actions'
import { Pane } from '../molecules/pane'

interface SortableItemProps {
  id: InstalledApp['id']
  name: InstalledApp['name']
  index: number
  icon?: string
  keyCode?: string
}

const SortableItem = ({
  id,
  name,
  keyCode = '',
  index,
  icon = '',
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const dispatch = useDispatch()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        'flex',
        'bg-black dark:bg-white bg-opacity-5 dark:bg-opacity-5 shadow',
        'rounded-xl mb-4',
        'focus-visible:outline-none focus-visible:bg-white dark:focus-visible:bg-black focus-visible:bg-opacity-70 focus-visible:shadow-xl focus-visible:ring-1 focus-visible:ring-gray-500',
        isDragging &&
          'focus-visible:ring-2 dark:focus-visible:ring-gray-100 focus-visible:ring-gray-900',
      )}
    >
      <div className="flex items-center justify-center p-4 w-16">
        {index + 1}
      </div>
      <div className="flex-grow flex items-center p-4">
        <img
          alt=""
          className={clsx('h-8 w-8 mr-4', !icon && 'hidden')}
          src={icon}
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
          onChange={(event) => event.preventDefault()}
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
          value={keyCode}
        />
      </div>
    </div>
  )
}

export function AppsPane(): JSX.Element {
  const dispatch = useDispatch()

  const installedApps = useInstalledApps()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      dispatch(
        reorderedApp({
          sourceId: active.id as AppId,
          destinationId: over?.id as AppId,
        }),
      )
    }
  }

  const icons = useDeepEqualSelector((state) => state.data.icons)

  const keyCodeMap = useKeyCodeMap()

  return (
    <Pane pane="apps">
      {installedApps.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      )}

      <div className="overflow-y-auto p-2">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={installedApps}
            strategy={verticalListSortingStrategy}
          >
            {installedApps.map(({ id, name, hotCode }, index) => (
              <SortableItem
                key={id}
                icon={icons[id]}
                id={id}
                index={index}
                keyCode={keyCodeMap[hotCode || '']}
                name={name}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </Pane>
  )
}
