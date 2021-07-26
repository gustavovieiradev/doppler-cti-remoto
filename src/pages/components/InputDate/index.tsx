import { Box, Flex } from "@chakra-ui/react";
import { FiCalendar } from 'react-icons/fi';


export function InputDate() {
  return (
    <Flex border="1px solid #E5E5E5;" bg="rgba(255, 255, 255, 0.1);" height="80px" justify="space-between">
      <Box flex=".8"></Box>
      <Flex w="80px" h="80px" bg="teal.500" align="center" justify="center">
        <FiCalendar size={40}/>
      </Flex>
    </Flex>
  )
}