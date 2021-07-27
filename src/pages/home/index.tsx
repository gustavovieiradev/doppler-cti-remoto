import { Box, Text, Flex, HStack, RadioGroup, Radio, VStack, useDisclosure } from "@chakra-ui/react";
import { BsChevronCompactDown } from 'react-icons/bs';
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { InputDate } from "../../components/InputDate";
import { Footer } from "../../components/Footer";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ModalFinish } from "../../components/ModalFinish";
import { useEffect } from "react";
import { api } from "../../services/api";
import { ModalConteudo } from "../../components/ModalConteudo/ModalConteudo";
import { FormProvider, useForm } from "../../contexts/FormContext";
import { AxiosError } from "axios";

interface Disciplina {
  id: number;
  dsc_disciplina: string;
}

interface Conteudo {
  id: number;
  dsc_conteudo: string;
}

export default function Home() {
  const [duvida, setDuvida] = useState("1");
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: IsOpenConteudo, onOpen: onOpenConteudo, onClose: onCloseConteudo } = useDisclosure();
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  const { questoes } = useForm();
  const [idDisciplina, setIdDisciplina] = useState<number>();

  console.log(user?.id);


  useEffect(() => {
    async function loadAreas() {
      const {data} = await api.get('/api/public/disciplina/?ano_letivo=2021');
      setDisciplinas(data);
    }

    loadAreas();
  }, [])

  useEffect(() => {
    console.log(11111, questoes);
  }, [questoes])

  async function finishStep() {
    try {
      const date = new Date('2021-07-26');
      const {data} = await api.get(`/api/public/cti/?dsc_cti=&dat_cti=${date.toISOString()}&criador=&ano_letivo=2021`)
  
      const lastItem = data[data.length - 1];
  
      const params = new URLSearchParams()
      params.append('dsc_duvida', '2')
      params.append('aluno', '172')
      params.append('questao', '24508')
      params.append('cti', '1153')
  
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }
  
      const response = await api.post('api/public/duvida/', {
        dsc_duvida: 2,
        aluno: 172,
        questao: 24508,
        cti: 1153
      });
      // console.log(response);
      onOpen();
      setStep(1);
    } catch(err) {
      console.log(err);
    }
  }

  function nextStep() {
    if (step === 1 && duvida === '2') {
      onOpen();
      return;
    }

    setStep(step+1)
  }

  function changeOption(ev) {
    console.log(ev);
  }
 
  async function getConteudo(idDisciplina: number) {
    const {data} = await api.get(`/api/public/conteudo/?ano_letivo=2021&disciplina=${idDisciplina}`)
    setIdDisciplina(idDisciplina);
    setConteudos(data);
    onOpenConteudo();
  }

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
                  bg={duvida === '1' ? 'rgba(96, 199, 175, 0.1)' : ''} 
                  border={duvida === '1' ? "1px solid #60C7AF" : '1px solid #E5E5E5'}
                  h="80px" 
                  align="center" 
                  px="20px"
                >
                  <Radio colorScheme="teal" value="1" size="lg" name="" w="100%">
                    <Text fontSize="28px">Tive Dúvidas</Text>
                  </Radio>
                </Flex>
                <Flex  
                  flex=".5" 
                  bg={duvida === '2' ? 'rgba(96, 199, 175, 0.1)' : ''} 
                  border={duvida === '2' ? "1px solid #60C7AF" : '1px solid #E5E5E5'}
                  h="80px" 
                  align="center" 
                  px="20px"
                >
                  <Radio colorScheme="teal" value="2" fontSize="28px" size="lg" w="100%">
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

            {disciplinas.length > 0 && disciplinas.map(item => (
              <div key={item.id}>
                <Box px="80px" onClick={() => getConteudo(item.id)}>
                  <Flex borderBottom="1px solid #60C7AF" mt="48px" pb="10px" justify="space-between" align="center">
                    <Text fontSize="24px" fontWeight="bold">{item.dsc_disciplina}</Text>
                    <BsChevronCompactDown size={30}/>
                  </Flex>
                </Box>
                {questoes?.idDisciplina === item.id && questoes?.questoes?.length > 0 && questoes.questoes.map(questM => (
                  <Box border="2px solid #E5E5E5" p="25px" mt="25px" ml="90px" mr="90px" key={questM.id}>
                    <Flex justify="space-between" align="center">
                      <Text fontSize="28px" fontWeight="bold">{questM.dsc_questao}</Text>
                      <BsChevronCompactDown size={30}/>
                    </Flex>
                    <RadioGroup ml="80px" mt="50px" onChange={(ev) => changeOption(ev)}>
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
                          <Radio colorScheme="teal" value="3" fontSize="28px" size="lg">
                            <Text fontSize="28px">Não consegui resolver o exercício</Text>
                          </Radio>
                        </Flex>
                      </VStack>
                    </RadioGroup>
                  </Box>
                ))}
              </div>
            ))}

            

          </Box>
        )}
        {step === 3 && (
          <div>3</div>
        )}
      </Layout>
      <Footer step={step} firstStep={1} lastStep={2} nextStep={nextStep} previousStep={() => setStep(step-1)} finishStep={finishStep} />
      <ModalFinish isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
      <ModalConteudo isOpen={IsOpenConteudo} onClose={onCloseConteudo} conteudos={conteudos} idDisciplina={idDisciplina} />
    </Box>
  )
}