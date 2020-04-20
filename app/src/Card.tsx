import React from 'react';
import { BorderBox } from '@primer/components'

function Card(props: any) {
  return (
    <BorderBox minHeight={100} bg="white" p={2} mt={2}>
      Card {props.name}
    </BorderBox>
  );
}

export default Card;