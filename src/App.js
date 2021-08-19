import React, { useState } from "react";
import { v4 as uuid } from 'uuid';
import './assets/main.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import reactDom from "react-dom";
import { FaSortAmountUp, FaPlus } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import InlineEdit from "./components/inlineEdit";
import InlineEditTags from "./components/inlineEditTags";
import PriorityIcon from "./components/priorityIcon";
import TestFunction from "./components/testComponent";

const itemsDataList = [
  {id: uuid(), content: 'First task', priority:1},
  {id: uuid(), content: 'Second task', priority:2, tags:[]},
  {id: uuid(), content: 'Third task', priority:3, tags: []},
  {id: uuid(), content: 'Fourth task', priority:4, tags: ['this']},
  {id: uuid(), content: 'Fifth task', priority:5, tags: ['one','two']},
]

const columnsDataList = {
  [uuid()]: {
    name: 'Todo',
    items: itemsDataList,
    create: true
  },
  [uuid()]: {
    name: 'In progress',
    items: [],
    create: false
  },
  [uuid()]: {
    name: 'Done',
    items: [],
    create: false
  }
}

function createItemInColumn(e,id,columns,setColumns){
  e.preventDefault()
  const columnItems = columns[id].items
  const newItemEntry = {id: uuid(), content: '<Write text>', priority:3, tags:[]};
  
  const newColumnItems = [newItemEntry].concat(columnItems) 

  setColumns({
    ...columns,
    [id] : {
      ...columns[id],
      items: newColumnItems
    }
  })
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

  if (columnItems.length == 0) return;

  if(columnItems[0].priority >= 3 && columnItems[1].priority < columnItems[0].priority){
    console.log("first")
    sortedItems = columnItems.sort((a,b) => a.priority - b.priority)
  } else {
    console.log("second")
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
    <div>
      <div>

        my navbar


      </div>
    <div className="flex justify-center">

      <div className="grid grid-flow-col auto-cols-max sm:auto-cols-min">
      <DragDropContext onDragEnd={result => onDragEndFunction(result, columns, setColumns)}>
        {Object.entries(columns).map(([id, column ]) => {
          return (
            
            <div className="m-9 content-center">
            <div className="flex justify-between mb-5">

              <p className="block text-2xl">{column.name}</p>

              <div>

                {column.create &&                 
                  <button data-tip="Create task" className="pl-3" onClick={(e) => createItemInColumn(e, id,columns, setColumns)}>

                    <FaPlus />
                  </button>}

              <button data-tip="Sort Priority" className="pl-3" onClick={(e) => sortColumns(e, id,columns, setColumns)}>

                <FaSortAmountUp />
              </button>
              </div>

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
                                className="m-3 rounded-lg"
                                >

                                  <div className="box-border rounded-lg p-4 pb-2 ml-3 mr-3 flex justify-between">
                                    <InlineEdit text={item.content} 
                                  onSetText={text => setEditedText(columns,id,index,text, setColumns)}/>
                                  <PriorityIcon priority={item.priority}/>
                                  </div>

                                  <div className="p-4 pt-0 ml-3 mr-3">

                                  

                                  
                                  </div>

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
    </div>
  );
}
export default App;
