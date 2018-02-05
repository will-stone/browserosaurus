import { ipcRenderer } from 'electron'
import { css } from 'emotion'
import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

// import Checkbox from '../Checkbox'
// import Th from '../Th'
// import Td from '../Td'

// a little function to help us with reordering the result
// const reorder = (list, startIndex, endIndex) => {
//   const result = Array.from(list)
//   const [removed] = result.splice(startIndex, 1)
//   result.splice(endIndex, 0, removed)

//   return result
// }

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: '1rem',
  margin: `0 0 0.5rem 0`,
  display: 'flex',
  alignItems: 'center',

  // change background colour if dragging
  background: isDragging ? '#11151B' : '#21252B',

  // styles we need to apply on draggables
  ...draggableStyle
})

const getListStyle = isDraggingOver => ({
  // background: isDraggingOver ? 'lightblue' : 'lightgrey'
})

class Browsers extends React.Component {
  constructor(props) {
    super(props)
    // this.state = {
    //   items: []
    // }
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     items: nextProps.browsers
  //   })
  // }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    // const items = reorder(
    //   this.state.items,
    //   result.source.index,
    //   result.destination.index
    // )

    // this.setState({
    //   items
    // })

    this.sortBrowser(result.source.index, result.destination.index)
  }

  /**
   * Sort Browser
   *
   * Sends the sort-browser event to main.js. This allows browsers to be
   * reordered.
   * @param {number} oldIndex index of browser being moved from.
   * @param {number} newIndex index of place browser is being moved to.
   */
  sortBrowser(oldIndex, newIndex) {
    ipcRenderer.send('sort-browser', { oldIndex, newIndex })
  }

  render() {
    // const { onBrowserToggle } = this.props

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.props.browsers &&
                this.props.browsers.map((browser, index) => (
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
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <span
                            {...provided.dragHandleProps}
                            className={css`
                              opacity: 0.5;
                            `}
                          >
                            &#8942;&#8942;
                          </span>
                          <img
                            src={`../../images/browser-logos/${
                              browser.name
                            }.png`}
                            alt=""
                            className={css`
                              width: 32px;
                              height: 32px;
                              vertical-align: middle;
                              margin-left: 1rem;
                              margin-right: 1rem;
                            `}
                          />
                          <span>{browser.name}</span>
                          <div
                            className="pretty p-svg"
                            style={{ marginLeft: 'auto' }}
                          >
                            <input type="checkbox" checked={browser.enabled} />
                            <div className="state p-success">
                              <svg class="svg svg-icon" viewBox="0 0 20 20">
                                <path
                                  d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
                                  style={{ stroke: 'white', fill: 'white' }}
                                />
                              </svg>
                              <label />
                            </div>
                          </div>
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
}

export default Browsers
