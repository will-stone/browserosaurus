import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import CheckBox from '../../components/Checkbox'

const BrowserList = ({ browsers, onBrowserToggle, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={
              {
                // background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey'
              }
            }
          >
            {browsers &&
              browsers.map((browser, index) => (
                <Draggable
                  key={browser.name}
                  draggableId={browser.name}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          // some basic styles to make the items look a bit nicer
                          userSelect: 'none',
                          padding: '1rem',
                          margin: `0 0 0.5rem 0`,
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
                        <img
                          src={`../../images/browser-logos/${browser.name}.png`}
                          alt=""
                          style={{
                            width: 32,
                            height: 32,
                            verticalAlign: 'middle',
                            marginLeft: '1rem',
                            marginRight: '1rem'
                          }}
                        />
                        <span style={{ marginRight: 'auto' }}>
                          {browser.name}
                        </span>
                        <CheckBox
                          checked={browser.enabled}
                          onChange={() =>
                            onBrowserToggle(browser.name, !browser.enabled)
                          }
                        />
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
  )
}

export default BrowserList
