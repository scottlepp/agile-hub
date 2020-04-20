import React from 'react';
import { Box, Grid } from '@primer/components'
import Column from './Column';

function Board(props: any) {
  const columns = [
    {key:'1', name: 'col1', cards:[
      {key: 1, name: 'card1'},
      {key: 2, name: 'card2'}
    ]}, 
    {key: '2', name:'col2', cards:[
      {key: 2, name: 'card2'}
    ]}
  ]
  return (
    <Box>
      Board {props.name}
      <Grid gridTemplateColumns="repeat(2, auto)" gridGap={3}>
          {columns.map(col =>
            (<Column {...col}></Column>)
          )}
      </Grid>
    </Box>
  );
}

export default Board;
