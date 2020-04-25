import React from 'react';
import { BorderBox } from '@primer/components';
import { Draggable } from 'react-beautiful-dnd';

function Card(props: any) {
  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided) => (
        <BorderBox 
          minHeight={100} 
          bg="white" 
          p={2} 
          mt={2}
          {...provided.draggableProps} 
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          Card {props.name}
        </BorderBox>
      )}
    </Draggable>
  );
}

export default Card;