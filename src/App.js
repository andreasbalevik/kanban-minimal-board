import React, { useState } from "react";
import { v4 as uuid } from 'uuid';
import './assets/main.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import reactDom from "react-dom";
import { FaAngleDoubleUp, FaAngleDoubleDown, FaGenderless } from 'react-icons/fa';

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

const PriorityIcon = ({priority}) => {

  if(priority > 3){
    return (
      <FaAngleDoubleUp/>
    )
  } else if (priority < 3){
    return (
      <FaAngleDoubleDown/>
    )
  } else {
    return (
      <label></label>
    )
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
    
    <div class="grid grid-flow-col auto-cols-max md:auto-cols-min">
    <DragDropContext onDragEnd={result => onDragEndFunction(result, columns, setColumns)}>
      {Object.entries(columns).map(([id, column ]) => {
        return (
          
          <div class="m-9 content-center">
          <button class="box-border" onClick={(e) => sortColumns(e, id,columns, setColumns)}>  Sort after priority </button>
          
          <p class="text-2xl">{column.name}</p>

          <div >
          <Droppable droppableId={id} key={id}>
            {(provided, snapshot) => {
              return (

                // THIS IS COLUMN
                <div class=""
                {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver ? 'pink' : 'lightgray',
                    minWidth: '200px',
                    minHeight: '500px',
                    height: '100%',
                    overflow: 'hidden'
                  }}
                >
                  {column.items.map((item, index) => {
                    return (


                      // THIS IS ITEM
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => {
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: 'none',
                                backgroundColor: snapshot.isDragging ? 'black':'white',
                                ...provided.draggableProps.style
                              }}
                              class="box-border p-4 m-3"
                              >
                                {item.content}
                                <PriorityIcon priority={item.priority}/>
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
