import { Box, Text, Flex, HStack, RadioGroup, Radio, VStack, useDisclosure, SimpleGrid, Select, Collapse } from "@chakra-ui/react";
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
import { format } from "date-fns";
import { useCallback } from "react";

interface Disciplina {
  id: number;
  dsc_disciplina: string;
  open?: boolean;
}

interface Conteudo {
  id: number;
  dsc_conteudo: string;
}

interface Questao {
  id: number;
  dsc_questao: number;
  idConteudo: number;
  idDisciplina: number;
  value?: number;
  open?: boolean;
}

export default function Home() {
  const [duvida, setDuvida] = useState("1");
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [disciplinasSelected, setDisciplinasSelected] = useState<Disciplina[]>([]);
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  // const { questoes } = useForm();
  const [idDisciplina, setIdDisciplina] = useState<number>();
  const [dateCti, setDateCti] = useState(new Date());
  const [questoes, setQuestoes] = useState<Questao[]>([]);

  useEffect(() => {

    async function loadDisciplinas() {
      const {data} = await api.get(`/api/public/disciplina/?ano_letivo=2021`);
      console.log(data);
      setDisciplinas(data);
    }
    loadDisciplinas();

  }, [])

  async function finishStep() {
    try {
      // const date = new Date('2021-07-26');
      // const {data} = await api.get(`/api/public/cti/?dsc_cti=&dat_cti=${date.toISOString()}&criador=&ano_letivo=2021`)
  
      // const lastItem = data[data.length - 1];
  
      const questionFilter = questoes.filter(q => !!q.value);

      for (let i = 0; i < questionFilter.length; i++) {
        await api.post('api/public/duvida/', {
          dsc_duvida: questionFilter[i].value,
          aluno: user.id,
          questao: questionFilter[i].id,
          cti: 1153
        });
      }

      // const response = await api.post('api/public/duvida/', {
      //   dsc_duvida: 2,
      //   aluno: 172,
      //   questao: 24508,
      //   cti: 1153
      // });

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
 
  useEffect(() => {
    async function loadConteudos() {
      const {data} = await api.get(`/api/public/conteudo/?ano_letivo=2021&disciplina=${idDisciplina}`)
      setConteudos(data);
    }

    if (idDisciplina) {
      loadConteudos();
    }
  }, [idDisciplina])

  async function selectedConteudo(idConteudo: number) {
    const {data} = await api.get(`/api/public/questao/?ano_letivo=2021&conteudo=${idConteudo}`);
    
    const disciplinaExists = disciplinasSelected.find(d => d.id === idDisciplina)

    if (!disciplinaExists) {
      const disciplina = disciplinas.find(d => d.id === idDisciplina)
      setDisciplinasSelected([...disciplinasSelected, disciplina])
    }

    const questExists = questoes.filter(q => q.idConteudo === idConteudo);

    if (questExists.length === 0) {
      const questaoConst = data.map(d => {
        return {
          ...d,
          idConteudo,
          idDisciplina
        }
      })
      setQuestoes([...questoes, ...questaoConst]);
    }
  }

  const selectedOptions = useCallback((ev, ix) => {
    let newArray = [...questoes];
    newArray[ix].value = Number(ev);
    setQuestoes(newArray);
  }, [questoes])

  const openDisciplina = useCallback((ix) => {
    let newArray = [...disciplinasSelected];
    newArray[ix].open = !disciplinasSelected[ix].open ? true : false
    console.log(newArray[ix].open)
    setDisciplinasSelected(newArray);
  }, [disciplinasSelected])

  const openQuestao = useCallback((ix) => {
    let newArray = [...questoes];
    newArray[ix].open = !questoes[ix].open ? true : false
    console.log(newArray[ix].open)
    setQuestoes(newArray);
  }, [questoes])


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
                <InputDate setDate={setDateCti} />
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
              <Text fontWeight="bold">{format(dateCti, 'dd/MM/yyyy')}</Text>
            </Text>
            <Text ml="60px" mt="95px" fontSize="28px" fontWeight="bold">Em quais exercícios você teve dúvidas?</Text>

            <SimpleGrid columns={2} spacing={10} ml="60px" mt="50px" mr="60px">
              <Select placeholder="Selecione a disciplina" onChange={(ev) => setIdDisciplina(Number(ev.target.value))}>
                {disciplinas?.map(disciplina => (
                  <option value={disciplina.id} key={disciplina.id}>{disciplina.dsc_disciplina}</option>
                ))}
              </Select>
              <Select placeholder="Selecione conteúdo" onChange={(ev) => selectedConteudo(Number(ev.target.value))}>
                {conteudos?.map(conteudo => (
                  <option value={conteudo.id} key={conteudo.id}>{conteudo.dsc_conteudo}</option>
                ))}
              </Select>
            </SimpleGrid>

            {disciplinasSelected.length > 0 && disciplinasSelected.map((item, exD) => (
              <div key={item.id}>
                <Box px="80px" onClick={() => openDisciplina(exD)} cursor="pointer">
                  <Flex borderBottom="1px solid #60C7AF" mt="48px" pb="10px" justify="space-between" align="center">
                    <Text fontSize="24px" fontWeight="bold">{item.dsc_disciplina}</Text>
                    <BsChevronCompactDown size={30}/>
                  </Flex>
                </Box>
                <Collapse in={item.open}>
                  {questoes?.length > 0 && questoes.filter(q => q.idDisciplina === item.id).map((questM, ix) => (
                    <Box border="2px solid #E5E5E5" p="25px" mt="25px" ml="90px" mr="90px" key={questM.id}>
                      <Flex justify="space-between" align="center" onClick={() => openQuestao(ix)} cursor="pointer">
                        <Text fontSize="28px" fontWeight="bold">{questM.dsc_questao}</Text>
                        <BsChevronCompactDown size={30}/>
                      </Flex>
                      <Collapse in={questM.open}>
                        <RadioGroup ml="80px" mt="50px" onChange={(ev) => selectedOptions(ev, ix)}>
                          <VStack align="center" justify="center" mt="20px">
                            <Flex bg={questM.value === 1 ? 'rgba(96, 199, 175, 0.1)' : ''} border={questM.value === 1 ? "1px solid #60C7AF" : '1px solid #E5E5E5'} h="80px" align="center" px="20px" width="710px" >
                              <Radio colorScheme="teal" value="1" size="lg">
                                <Text fontSize="28px">Foram sanadas</Text>
                              </Radio>
                            </Flex>
                            <Flex bg={questM.value === 2 ? 'rgba(96, 199, 175, 0.1)' : ''} border={questM.value === 2 ? "1px solid #60C7AF" : '1px solid #E5E5E5'} h="80px" align="center" px="20px" w="100%" width="710px">
                              <Radio colorScheme="teal" value="2" fontSize="28px" size="lg">
                                <Text fontSize="28px">Acionei a monitoria mas continuo em dúvida</Text>
                              </Radio>
                            </Flex>
                            <Flex bg={questM.value === 3 ? 'rgba(96, 199, 175, 0.1)' : ''} border={questM.value === 3 ? "1px solid #60C7AF" : '1px solid #E5E5E5'} h="80px" align="center" px="20px" w="100%" width="710px">
                              <Radio colorScheme="teal" value="3" fontSize="28px" size="lg">
                                <Text fontSize="28px">Não consegui resolver o exercício</Text>
                              </Radio>
                            </Flex>
                          </VStack>
                        </RadioGroup>
                      </Collapse>
                    </Box>
                  ))}
                </Collapse> 
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
      {/* <ModalConteudo isOpen={IsOpenConteudo} onClose={onCloseConteudo} conteudos={conteudos} idDisciplina={idDisciplina} /> */}
    </Box>
  )
}