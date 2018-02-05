import { ipcRenderer } from 'electron'
// import { css } from 'emotion'
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
                this.props.browsers.map((item, index) => (
                  <Draggable
                    key={item.name}
                    draggableId={item.name}
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
                          <span {...provided.dragHandleProps}>
                            &#8942;&#8942;
                          </span>{' '}
                          <span>{item.name}</span>
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
