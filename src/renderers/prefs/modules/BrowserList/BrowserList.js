import { Checkbox } from '@blueprintjs/core'
import React, { Fragment } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import BrowserLogoName from '../../../components/BrowserLogoName'

const BrowserList = ({ browsers, onBrowserToggle, onDragEnd }) => {
  return (
    <Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} style={{ marginBottom: '1rem' }}>
              {browsers &&
                browsers.map((browser, index) => (
                  <Draggable
                    key={browser.name}
                    draggableId={browser.name}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div style={{ opacity: !browser.enabled && 0.5 }}>
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            // some basic styles to make the items look a bit nicer
                            userSelect: 'none',
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',

                            // change background colour if dragging
                            background: snapshot.isDragging
                              ? '#11151B'
                              : '#21252B',

                            // styles we need to apply on draggables
                            ...provided.draggableProps.style
                          }}
                        >
                          <span
                            {...provided.dragHandleProps}
                            style={{ opacity: 0.5 }}
                          >
                            &#8942;&#8942;
                          </span>

                          <BrowserLogoName name={browser.name} />

                          <Checkbox
                            checked={browser.enabled}
                            onChange={() =>
                              onBrowserToggle(browser.name, !browser.enabled)
                            }
                            className="pt-large"
                            inline={true}
                            style={{ marginBottom: 0 }}
                          />

                          <kbd className="pt-key pt-modifier-key">
                            {browser.key}
                          </kbd>
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Fragment>
  )
}

export default BrowserList
