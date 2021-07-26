import { Box, Text, Flex, HStack, RadioGroup, Radio, VStack, useDisclosure, Button } from "@chakra-ui/react";
import { BsChevronCompactDown } from 'react-icons/bs';
import { Header } from "../components/Header";
import { Layout } from "../components/Layout";
import { InputDate } from "../components/InputDate";
import { Footer } from "../components/Footer";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ModalFinish } from "../components/ModalFinish";

export default function Home() {
  const [duvida, setDuvida] = useState("1");
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box h="100vh">
      <Header />
      <Layout>
        {step === 1 && (
          <Box>
            <Text fontSize="28px" ml="40px" mt="35px">Olá {user?.dsc_nome_completo}, bem vindo!</Text>
            <Flex justify="space-between" align="center" ml="60px" mt="95px" alignItems="flex-start">
              <Box flex=".5">
                <Text fontSize="28px">Conta pra gente, como foi seu dia?</Text>
              </Box>
              <Box flex=".5">
                <InputDate />
              </Box>
            </Flex>
            <RadioGroup ml="80px" mt="50px" onChange={setDuvida} value={duvida}>
              <HStack align="center">
                <Flex 
                  flex=".5" 
                  bg={duvida ? 'rgba(96, 199, 175, 0.1)' : ''} 
                  border={duvida ? "1px solid #60C7AF" : '1px solid #E5E5E5'}
                  h="80px" 
                  align="center" 
                  px="20px"
                >
                  <Radio colorScheme="teal" value="1" size="lg" name="">
                    <Text fontSize="28px">Tive Dúvidas</Text>
                  </Radio>
                </Flex>
                <Flex 
                  flex=".5" 
                  bg={!duvida ? 'rgba(96, 199, 175, 0.1)' : ''} 
                  border={!duvida ? "1px solid #60C7AF" : '1px solid #E5E5E5'}
                  h="80px" 
                  align="center" 
                  px="20px"
                >
                  <Radio colorScheme="teal" value="2" fontSize="28px" size="lg">
                    <Text fontSize="28px">Não tive Dúvidas</Text>
                  </Radio>
                </Flex>
              </HStack>
            </RadioGroup>
          </Box>
        )}
        {step === 2 && (
          <Box>
            <Text fontSize="28px" ml="40px" mt="35px">
              Você selecionou 
              <Text>o CTI do dia </Text>
              <Text fontWeight="bold">27/06/2021</Text>
            </Text>
            <Text ml="60px" mt="95px" fontSize="28px" fontWeight="bold">Em quais exercícios você teve dúvidas?</Text>

            <Box px="80px">
              <Flex borderBottom="1px solid #60C7AF" mt="48px" pb="10px" justify="space-between" align="center">
                <Text fontSize="24px" fontWeight="bold">Língua Portuguesa V</Text>
                <BsChevronCompactDown size={30}/>
              
              </Flex>
            </Box>

            <Box border="2px solid #E5E5E5" p="25px" mt="25px" ml="90px" mr="90px">
              <Flex justify="space-between" align="center">
                <Text fontSize="28px" fontWeight="bold">Página 10, Exercício nº 24</Text>
                <BsChevronCompactDown size={30}/>
              </Flex>

              <VStack align="center" justify="center" mt="20px">
                <Flex bg=" rgba(96, 199, 175, 0.1)" border="1px solid #60C7AF" h="80px" align="center" px="20px" width="710px">
                  <Radio colorScheme="teal" value="1" size="lg">
                    <Text fontSize="28px">Foram sanadas</Text>
                  </Radio>
                </Flex>
                <Flex border="1px solid #E5E5E5" h="80px" align="center" px="20px" w="100%" width="710px">
                  <Radio colorScheme="teal" value="2" fontSize="28px" size="lg">
                    <Text fontSize="28px">Acionei a monitoria mas continuo em dúvida</Text>
                  </Radio>
                </Flex>
                <Flex border="1px solid #E5E5E5" h="80px" align="center" px="20px" w="100%" width="710px">
                  <Radio colorScheme="teal" value="2" fontSize="28px" size="lg">
                    <Text fontSize="28px">Não consegui resolver o exercício</Text>
                  </Radio>
                </Flex>
              </VStack>

            </Box>

          </Box>
        )}
        {step === 3 && (
          <div>3</div>
        )}
      </Layout>
      <Footer step={step} firstStep={1} lastStep={2} nextStep={() => setStep(step+1)} previousStep={() => setStep(step-1)} finishStep={() => setStep(step+1)} />
      <ModalFinish isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
    </Box>
  )
}