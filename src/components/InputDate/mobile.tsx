import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { FiCalendar } from 'react-icons/fi';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { format } from "date-fns";

interface InputDateProps {
  setDate?: (date: any) => void
}

export function InputDateMobile({setDate = () => {}}: InputDateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const handleChange = (e) => {
    setIsOpen(!isOpen);
    setCurrentDate(e);
    setDate(e)
  };
  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <Flex direction="column">
      {isOpen && (<DatePicker inline onChange={handleChange} selected={currentDate}/>)}
      <HStack height="80px" justify="space-between" onClick={handleClick} borderBottomWidth="2px" borderBottomStyle="dashed" borderBottomColor="black">
        <Flex align="center" justify="center">
          <FiCalendar size={24}/>
        </Flex>
        <Flex flex=".8" align="center" justify="center">
          <Text fontSize="28px">{format(currentDate, "dd/MM/yyyy")}</Text>
        </Flex>
      </HStack>
    </Flex>
  )
}