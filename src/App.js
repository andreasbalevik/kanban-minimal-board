import React, { useState } from "react";
import { v4 as uuid } from 'uuid';
import './assets/main.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import reactDom from "react-dom";

const itemsDataList = [
  {id: uuid(), content: 'First task', priority:1},
  {id: uuid(), content: 'Second task', priority:2},
  {id: uuid(), content: 'Third task', priority:3},
  {id: uuid(), content: 'Third task', priority:4},
  {id: uuid(), content: 'Third task', priority:5},
]

const columnsDataList = {
  [uuid()]: {
    name: 'Todo',
    items: itemsDataList
  },
  [uuid()]: {
    name: 'In progress',
    items: []
  },
  [uuid()]: {
    name: 'Done',
    items: []
  }
}

const onDragEndFunction = (result, columns, setColumns) => {

  if(!result.destination) return;

  const { source, destination} = result;

  if( source.droppableId !== destination.droppableId){
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1)
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    })
  } else {
    const { source, destination } = result;
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1)
    copiedItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    })
  }
}

function sortColumns(e,id,columns,setColumns) {
  e.preventDefault()

  const columnItems = columns[id].items

  setColumns({
    ...columns,
    [id] : {
      ...columns[id],
      items: columnItems.sort((a,b) => b.priority - a.priority)
    }
  })

}


function App() {
  const [columns, setColumns] = useState(columnsDataList)
  return (
    
    <div style={{ display:'flex', justifContent: 'center', height: '100%'}}>
    <DragDropContext onDragEnd={result => onDragEndFunction(result, columns, setColumns)}>
      {Object.entries(columns).map(([id, column ]) => {
        return (
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <button onClick={(e) => sortColumns(e, id,columns, setColumns)}>  Sort after priority </button>
          
          <h2>{column.name}</h2>

          <div style={{margin: '8px'}}>
          <Droppable droppableId={id} key={id}>
            {(provided, snapshot) => {
              return (
                <div
                {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                    padding: 4,
                    width: 250,
                    minHeight:500
                  }}
                >
                  {column.items.map((item, index) => {
                    return (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => {
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: 'none',
                                padding: 16,
                                margin: '0 0 8px 0',
                                minHeight: '50px',
                                backgroundColor: snapshot.isDragging ? 'black':'red',
                                color: 'white',
                                ...provided.draggableProps.style
                              }}
                              >
                                {item.content}
                                <label>Priority: {item.priority}</label>
                              </div>
                          );
                        }}
                            
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </div>
              )
            }}
          </Droppable>
          </div>
          </div>
        )
      })}
    </DragDropContext>
    </div>
  );
}
export default App;
