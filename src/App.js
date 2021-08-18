import React, { useState } from "react";
import { v4 as uuid } from 'uuid';
import './assets/main.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import reactDom from "react-dom";
import { FaAngleDoubleUp, FaAngleDoubleDown, FaSortAmountUp } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import InlineEdit from "./components/inlineEdit";

const itemsDataList = [
  {id: uuid(), content: 'Deploy code to ver1 and add some styling and something backendish', priority:1},
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
    items: [],
  }
}

const PriorityIcon = ({priority}) => {

  if(priority > 3){
    return (
      <i style={{color: 'green'}}>
        <FaAngleDoubleUp/>
      </i>
    )
  } else if (priority < 3){
    return (
      <i style={{color:'red'}}>
        <FaAngleDoubleDown/>
      </i>
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
  let sortedItems = []

  if(columnItems[0].priority >= 3){
    sortedItems = columnItems.sort((a,b) => a.priority - b.priority)
  } else {
    sortedItems = columnItems.sort((a,b) => b.priority - a.priority)
  }

  setColumns({
    ...columns,
    [id] : {
      ...columns[id],
      items: sortedItems
    }
  })

}

function setEditedText(columns,id,itemIndex,text,setColumns){

  var columnItems = columns[id].items
  columnItems[itemIndex].content = text;
  
  setColumns({
    ...columns,
    [id] : {
      ...columns[id],
      items: columnItems
    }
  })
}


function App() {

  const [columns, setColumns] = useState(columnsDataList)
  return (
    <div className="flex justify-center">

      <div className="grid grid-flow-col auto-cols-max sm:auto-cols-min">
      <DragDropContext onDragEnd={result => onDragEndFunction(result, columns, setColumns)}>
        {Object.entries(columns).map(([id, column ]) => {
          return (
            
            <div className="m-9 content-center">
            <div className="flex justify-between">

              <p className="block text-2xl">{column.name}</p>

              <button data-tip="Sort Priority" className="block" onClick={(e) => sortColumns(e, id,columns, setColumns)}>

                <FaSortAmountUp />
              </button>

            </div>
            

            <div>
            <Droppable droppableId={id} key={id}>
              {(provided, snapshot) => {
                return (

                  // THIS IS COLUMN
                  <div
                  {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: snapshot.isDraggingOver ? 'gray' : 'lightgray',
                      minWidth: '400px',
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
                                  backgroundColor: snapshot.isDragging ? 'white':'white',
                                  ...provided.draggableProps.style
                                }}
                                className="box-border rounded-lg p-4 m-3 flex justify-between"
                                >


                                <InlineEdit text={item.content} 
                                onSetText={text => setEditedText(columns,id,index,text, setColumns)}/>
  
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
      <ReactTooltip />
    </div>
  );
}
export default App;
