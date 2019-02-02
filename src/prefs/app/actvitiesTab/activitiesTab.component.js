import { Button, Checkbox } from '@blueprintjs/core'
import React, { Fragment } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import ActivityIcon from '../../../components/ActivityIcon'
import Kbd from '../../../components/Kbd'
import WithActivities from '../../../utils/WithActivities'

const ActivitiesTabComponent = () => {
  return (
    <WithActivities>
      {({ activities, state }, { onRescan, onDragEnd, onActivityToggle }) => (
        <Fragment>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {provided => (
                <div ref={provided.innerRef} style={{ marginBottom: '1rem' }}>
                  {activities &&
                    activities.map((activity, index) => {
                      const enabledActivities = activities.filter(a => a.enabled)

                      const defaultActivityName =
                        enabledActivities.length > 0 ? enabledActivities[0].name : null

                      return (
                        <Draggable key={activity.name} draggableId={activity.name} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={{
                                opacity: !activity.enabled && 0.5,
                                // some basic styles to make the items look a bit nicer
                                userSelect: 'none',
                                padding: '0.5rem 1rem',
                                display: 'flex',
                                alignItems: 'center',

                                // change background colour if dragging
                                background: snapshot.isDragging ? '#11151B' : '#21252B',

                                // styles we need to apply on draggables
                                ...provided.draggableProps.style,
                              }}
                            >
                              <span {...provided.dragHandleProps} style={{ opacity: 0.5 }}>
                                &#8942;&#8942;
                              </span>

                              <ActivityIcon name={activity.name} style={{ margin: '0 0.5rem' }} />

                              {activity.name}

                              <Kbd
                                isDefault={activity.name === defaultActivityName}
                                hotKey={activity.hotKey}
                              />

                              <Checkbox
                                checked={activity.enabled}
                                onChange={() => onActivityToggle(activity.name, !activity.enabled)}
                                style={{ margin: '0 0 0 1rem' }}
                                inline
                                // large - TODO: put back when fixed https://github.com/palantir/blueprint/issues/2685
                              />
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <p style={{ textAlign: 'center' }}>
            <Button
              onClick={onRescan}
              text="Rescan apps"
              loading={state === 'pending' || state === 'idle'}
              className="bp3-minimal"
              intent="primary"
            />
          </p>
        </Fragment>
      )}
    </WithActivities>
  )
}

export default ActivitiesTabComponent
