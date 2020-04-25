import React, {useState, useEffect} from 'react';
import { BorderBox, Box } from '@primer/components'
import Card from './Card';
import { Droppable } from 'react-beautiful-dnd';

function Column(props: any) {

  const [state, setState] = useState(props);

  useEffect(() => {
    setState(props);
  });

  return (
    <BorderBox height={'calc(100vh - 122px)'} bg="gray.1" p={2}>
      Column {props.name}
      <Droppable droppableId={props.id}>
        {(provided) => (
          <Box {...provided.droppableProps} ref={provided.innerRef}>
            {state.cards.map((card: any, index) =>
              (<Card {...card} index={index}></Card>)
            )}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </BorderBox>
  );
}

export default Column;
