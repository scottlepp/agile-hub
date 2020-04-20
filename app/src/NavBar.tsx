import React from 'react';
import './App.scss';
import '@primer/components'
import './Github.css';

import { Box, Heading, Sticky, StyledOcticon, Flex, Text } from '@primer/components'
import { MarkGithub } from '@primer/octicons-react'

function NavBar() {
  return (
    <Sticky top={0} bg="gray.8" p={3}>
      <Box bg="gray.8" width={[1, 1, 1/2]}>
        <Flex flexWrap="nowrap">
          <Heading color="white" textAlign="left" fontSize={3}>
            <StyledOcticon icon={MarkGithub} size={32} color="white" mr={2} />
          </Heading>
          <Box color="white">
            <Text as='p' mb={0} fontSize={3} fontWeight={500} lineHeight={"36px"}>SprintHub</Text>
          </Box>
        </Flex>
      </Box>
    </Sticky>
  );
}

export default NavBar;
