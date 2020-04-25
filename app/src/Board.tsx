import React, {useEffect, useState} from 'react';
import { Box, Grid } from '@primer/components'
import Column from './Column';
import { DragDropContext } from 'react-beautiful-dnd';

function Board(props: any) {

  // debugger;
  const columns = [
    {id:"col1", key:'1', name: 'col1', cards:[
      {key: 1, name: 'card1', id: "card1"},
      {key: 2, name: 'card2', id: "card2"}
    ]}, 
    {id:"col2", key: '2', name:'col2', cards:[
      {key: 3, name: 'card3', id: "card3"}
    ]},
    {id:"col3", key: '3', name:'col3', cards:[
      {key: 4, name: 'card4', id: "card4"}
    ]}
  ]

  const [state, setState] = useState({columns});

  const cols = columns.length;
  const percent = (100 / cols - 1).toFixed(0);
  const grid = `repeat(${cols}, ${percent}%)`

  const onDragEnd = (result) => {
    // debugger;
    console.log('drag end')
    const {destination, source, draggableId} = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      // same column - just reorder the card in this column
      const columns = state.columns;
      const column = columns.find(column => column.id === source.droppableId);
      const cards = column.cards;
      const card = cards.find(card => card.id === draggableId);
      
      cards.splice(source.index, 1);
      cards.splice(destination.index, 0, card);

      setState({columns});
    } else {
      // different column
      const columns = state.columns;

      const fromColumn = columns.find(column => column.id === source.droppableId);
      const toColumn = columns.find(column => column.id === destination.droppableId);

      const fromCards = fromColumn.cards;
      const fromCard = fromCards.find(card => card.id === draggableId);
      fromCards.splice(source.index, 1);
      const toCards = toColumn.cards;
      toCards.splice(destination.index, 0, fromCard);

      setState({columns});
    }
  }

  return (
    <Box>
      { console.log(state.columns) }
      Board {props.name}
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid gridTemplateColumns={grid} gridGap={3}>
          {state.columns.map(col =>
            (<Column {...col}></Column>)
          )}
        </Grid>
      </DragDropContext>
    </Box>
  );
}

export default Board;
