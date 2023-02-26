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
import { useDispatch } from 'react-redux'

import type { AppName } from '../../../../config/apps'
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
  id: InstalledApp['name']
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
        'bg-black/5 shadow dark:bg-white/5',
        'mb-4 rounded-xl',
        'focus-visible:bg-white/70 focus-visible:shadow-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 dark:focus-visible:bg-black',
        isDragging &&
          'focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-100',
      )}
    >
      <div className="flex w-16 items-center justify-center p-4">
        {index + 1}
      </div>
      <div className="flex grow items-center p-4">
        <img
          alt=""
          className={clsx('mr-4 h-8 w-8', !icon && 'hidden')}
          src={icon}
        />
        <span>{name}</span>
      </div>
      <div className="flex items-center justify-center p-4">
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
                appName: id,
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

  const installedApps = useInstalledApps().map((installedApp) => ({
    ...installedApp,
    id: installedApp.name,
  }))

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
          destinationName: over?.id as AppName,
          sourceName: active.id as AppName,
        }),
      )
    }
  }

  const icons = useDeepEqualSelector((state) => state.data.icons)

  const keyCodeMap = useKeyCodeMap()

  return (
    <Pane pane="apps">
      {installedApps.length === 0 && (
        <div className="flex h-full items-center justify-center">
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
      {installedApps.length > 1 && (
        <p className="mt-2 text-sm opacity-70">
          Drag and drop to sort the list of apps.
        </p>
      )}
    </Pane>
  )
}
