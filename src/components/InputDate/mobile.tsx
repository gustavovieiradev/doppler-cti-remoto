import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { FiCalendar } from 'react-icons/fi';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { format } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

interface InputDateProps {
  setDate?: (date: any) => void
}

export function InputDateMobile({setDate = () => {}}: InputDateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [maxDate, setMaxDate] = useState(zonedTimeToUtc(new Date(), 'America/Sao_Paulo'));
  const [currentDate, setCurrentDate] = useState(zonedTimeToUtc(new Date(), 'America/Sao_Paulo'));
  const handleChange = (e) => {
    setIsOpen(!isOpen);
    const customDateCti = zonedTimeToUtc(e, 'America/Sao_Paulo');
    setCurrentDate(customDateCti);
    setDate(customDateCti)
  };
  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <Flex direction="column">
      {isOpen && (<DatePicker inline onChange={handleChange} selected={currentDate} maxDate={maxDate}/>)}
      <Text textAlign="center">CTI do dia</Text>
      <HStack justify="space-between" onClick={handleClick} borderBottomWidth="2px" borderBottomStyle="dashed" borderBottomColor="black" py="5px">
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