import { Box, Flex, Text } from "@chakra-ui/react";
import { FiCalendar } from 'react-icons/fi';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { format } from "date-fns";


export function InputDate() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const handleChange = (e) => {
    setIsOpen(!isOpen);
    setCurrentDate(e);
  };
  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Flex border="1px solid #E5E5E5;" bg="rgba(255, 255, 255, 0.1);" height="80px" justify="space-between" onClick={handleClick}>
        <Flex flex=".8" align="center" justify="center">
          <Text fontSize="28px">{format(currentDate, "dd/MM/yyyy")}</Text>
        </Flex>
        <Flex w="80px" h="80px" bg="teal.500" align="center" justify="center">
          <FiCalendar size={40}/>
        </Flex>
      </Flex>
      {isOpen && <DatePicker inline onChange={handleChange} selected={currentDate} />}
    </>
  )
}