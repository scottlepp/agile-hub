import React from 'react';
import { BorderBox } from '@primer/components'
import Card from './Card';

function Column(props: any) {
  return (
    <BorderBox height={'calc(100vh - 122px)'} bg="gray.1" p={2}>
      Column {props.name}
      {props.cards.map((card: any) =>
        (<Card {...card}></Card>)
      )}
    </BorderBox>
  );
}

export default Column;
