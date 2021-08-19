import { Box, Text, Flex, HStack, RadioGroup, Radio, VStack, useDisclosure, SimpleGrid, Select, Collapse, useBreakpointValue, FormControl, FormLabel, Stack, Button, InputGroup, InputLeftElement, InputRightElement, Input, Spinner, useToast } from "@chakra-ui/react";
import { BsChevronCompactDown, BsChevronCompactRight } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { Header } from "../../components/Header";
import { Layout } from "../../components/Layout";
import { InputDate } from "../../components/InputDate";
import { InputDateMobile } from "../../components/InputDate/mobile";
import { Footer } from "../../components/Footer";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ModalFinish } from "../../components/ModalFinish";
import { useEffect } from "react";
import { api } from "../../services/api";
import { ModalConteudo } from "../../components/ModalConteudo/ModalConteudo";
import { FormProvider, useForm } from "../../contexts/FormContext";
import { AxiosError } from "axios";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { useCallback } from "react";
import { zonedTimeToUtc } from 'date-fns-tz';
import { ModalHour } from "../../components/ModalHour";

interface Disciplina {
  id: number;
  dsc_disciplina: string;
  open?: boolean;
}

interface Conteudo {
  id: number;
  dsc_conteudo: string;
  disciplina: number;
  open?: boolean;
}

interface Questao {
  id: number;
  dsc_questao: string;
  idConteudo: number;
  idDisciplina: number;
  value?: number;
  open?: boolean;
}

export default function Home() {
  const [messageModal, setMessageModal] = useState('Incrível, Parabéns!');
  const [duvida, setDuvida] = useState("1");
  const [step, setStep] = useState(1);
  const { user, setUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenHour, onOpen: onOpenHour, onClose: onCloseHour } = useDisclosure();
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [disciplinasSelected, setDisciplinasSelected] = useState<Disciplina[]>([]);
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  // const { questoes } = useForm();
  const [idDisciplina, setIdDisciplina] = useState<number>();
  const [loadingFiltros, setLoadingFiltros] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [idConteudo, setIdConteudo] = useState<number>();
  const [dateCti, setDateCti] = useState(new Date());
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [questoesOriginal, setQuestoesOriginal] = useState<Questao[]>([]);
  const [conteudosSelecionado, setConteudosSelecionados] = useState<Conteudo[]>([]);
  const [conteudosSelecionadoOriginal, setConteudosSelecionadosOriginal] = useState<Conteudo[]>([]);
  const [conteudosFiltro, setConteudosFiltro] = useState<string[]>([]);
  const toast = useToast();
  

  const isWideVersion: boolean = useBreakpointValue({
    base: false,
    lg: true,
    md: true,
  })

  useEffect(() => {
    const localUser = localStorage.getItem('nextauth.user');
    const userParse = JSON.parse(localUser);
    setUser(userParse);
    
    async function loadDisciplinas() {
      const {data} = await api.get(`/api/public/disciplina/?ano_letivo=2021`);
      console.log(data);
      setDisciplinas(data);
    }
    loadDisciplinas();

  }, [])

  function closeModal() {
    onClose()
    setMessageModal('Incrível, Parabéns!')
  }

  async function finishStep() {
    try {
      setLoadingSave(true);
      const today = new Date();
      const dateBefore =  new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      const dateNine = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 21, 0, 0);
      const customDateCti = zonedTimeToUtc(dateCti, 'America/Sao_Paulo');
      
      const formatCustomDateCti = format(customDateCti, "yyyy-MM-dd'T'00:00:00.000'Z'");

      const {data} = await api.get(`/api/public/cti/?dsc_cti=&dat_cti=${formatCustomDateCti}&criador=&ano_letivo=2021`)

      let ctiId = 0;

      if (!data.length) {
        const cti = await api.post(`/api/public/cti/`, {
          criador: 1,
          dsc_cti: 'CTI 01',
          dat_cti: formatCustomDateCti
        })
        ctiId = cti.data.id
      } else {
        const lastItem = data[data.length - 1];
        ctiId = lastItem.id;
      }
  
      const questionFilter = questoes.filter(q => !!q.value);

      for (let i = 0; i < questionFilter.length; i++) {
        await api.post('api/public/duvida/', {
          dsc_duvida: questionFilter[i].value,
          aluno: user.id,
          questao: questionFilter[i].id,
          cti: ctiId
        });
      }

      // const response = await api.post('api/public/duvida/', {
      //   dsc_duvida: 2,
      //   aluno: 172,
      //   questao: 24508,
      //   cti: 1153
      // });

      // console.log(response);

      // onOpen();

      setStep(1);
      clearData();
      setLoadingSave(false);
      const dt = zonedTimeToUtc(new Date(), 'America/Sao_Paulo');
      setDateCti(dt)
      if (isAfter(customDateCti, dateNine)) {
        console.log(customDateCti)
        onOpenHour();
        return;  
      }
      if (isBefore(customDateCti, dateBefore)) {
        console.log(2222)
        onOpenHour();
        return;  
      }
      setMessageModal('Dúvidas enviadas!')
      onCloseHour();
      onOpen();
    } catch(err) {
      setLoadingSave(false);
      toast({
        title: 'Atenção!',
        description: 'Ocorreu um erro ao enviar dúvidas',
        status: 'warning',
        duration: 9000,
        isClosable: true
      })
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

  function clearData() {
    setDisciplinasSelected([]);
    setConteudosSelecionados([])
    setConteudosSelecionadosOriginal([])
    setConteudosFiltro([])
    setQuestoes([]);
    setQuestoesOriginal([]);
    setIdDisciplina(null);
    setIdConteudo(null);
  }

  async function selectedConteudo() {
    setLoadingFiltros(true);
    const {data} = await api.get(`/api/public/questao/?ano_letivo=2021&conteudo=${idConteudo}`);

    if (!data.length) {
      toast({
        title: 'Atenção!',
        description: 'Nenhuma questão cadastrada para esse conteúdo',
        status: 'warning',
        duration: 9000,
        isClosable: true
      })
      setLoadingFiltros(false)
      return;
    }
    
    const disciplinaExists = disciplinasSelected.find(d => d.id === idDisciplina)

    if (!disciplinaExists) {
      const disciplina = disciplinas.find(d => d.id === idDisciplina)
      setDisciplinasSelected([...disciplinasSelected, disciplina])
    }

    const conteudosExists = conteudosSelecionado.find(c => c.id === idConteudo)

    if (!conteudosExists) {
      const conteudo = conteudos.find(d => d.id === idConteudo)
      setConteudosSelecionados([...conteudosSelecionado, {...conteudo, disciplina: idDisciplina}])
      setConteudosSelecionadosOriginal([...conteudosSelecionadoOriginal, {...conteudo, disciplina: idDisciplina}])
      setConteudosFiltro([...conteudosFiltro, conteudo.dsc_conteudo])
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
      setQuestoesOriginal([...questoes, ...questaoConst]);
    }

    setLoadingFiltros(false);
  }

  const selectedOptions = useCallback((ev, question) => {
    let newArray = [...questoes];
    const ix = questoes.findIndex(c => question.id === c.id)
    newArray[ix].value = Number(ev);
    setQuestoes(newArray);
    setQuestoesOriginal(newArray);
  }, [questoes])

  const openDisciplina = useCallback((ix) => {
    let newArray = [...disciplinasSelected];
    newArray[ix].open = !disciplinasSelected[ix].open ? true : false
    setDisciplinasSelected(newArray);
  }, [disciplinasSelected])

  const openQuestao = useCallback((question) => {
    let newArray = [...questoes];
    const ix = questoes.findIndex(c => question.id === c.id)
    newArray[ix].open = !questoes[ix].open ? true : false
    console.log(newArray[ix].open)
    setQuestoes(newArray);
    setQuestoesOriginal(newArray);
  }, [questoes])

  const openConteudo = useCallback((cc) => {
    let newArray = [...conteudosSelecionado];
    const ix = conteudosSelecionado.findIndex(c => cc.id === c.id)
    newArray[ix].open = !conteudosSelecionado[ix].open ? true : false
    console.log(newArray[ix].open)
    console.log(ix);
    setConteudosSelecionados(newArray);
  }, [conteudosSelecionado])

  const changeSearch = useCallback((search: string) => {
    setLoadingSearch(true);
    if (!search.length) {
      setQuestoes(questoesOriginal)
      setLoadingSearch(false);
    }
    
    let questaoSearch = questoesOriginal.filter(item => item.dsc_questao.toLowerCase().indexOf(search.toLowerCase()) > -1);
    setTimeout(() => {
      setQuestoes(questaoSearch)
      setLoadingSearch(false);
    }, 300)

  }, [questoesOriginal])



  return (
    <Box bg={isWideVersion ? '#E5E5E5' : '#fff' }>
      {isWideVersion && <Header />}
      
      <Layout isWideVersion={isWideVersion}>
        {step === 1 && (
          <Box>
            <Text fontSize="28px" ml={["13px", "40px"]} mt={["16px", "35px"]} >Olá {user?.dsc_nome_completo}, bem vindo!</Text>
            <Flex>
              <SimpleGrid columns={[1,2, 2]} ml={["32px", "60px"]} mt={["35px", "95px"]} w={['226px', "100%"]}>
                <Text fontSize="28px">Conta pra gente, como foi seu dia?</Text>
                {isWideVersion && (
                    <InputDate setDate={setDateCti} />
                )}
              </SimpleGrid>
            </Flex>
            <RadioGroup ml={["35px", "80px"]} mt="50px" onChange={setDuvida} value={duvida} mr={['35px', '0', '0']} mb="50px">
              <SimpleGrid columns={[1,2,2]}  spacing={["18px", "0", "0"]}>
                <Flex 
                  bg={duvida === '1' ? 'rgba(96, 199, 175, 0.1)' : ''} 
                  border={duvida === '1' ? "1px solid #60C7AF" : '1px solid #E5E5E5'}
                  h="80px" 
                  align="center" 
                  px="20px"
                  mr={["0", "0", "50px"]}
                >
                  <Radio colorScheme="teal" value="1" size="lg" name="" w="100%">
                    <Text fontSize="28px">Tive Dúvidas</Text>
                  </Radio>
                </Flex>
                <Flex  
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
              </SimpleGrid>
            </RadioGroup>
            {!isWideVersion && (
              <Flex align="center" justify="center">
                <InputDateMobile setDate={setDateCti} />
              </Flex>
            )}
          </Box>
        )}
        {step === 2 && (
          <Box>
            <Text fontSize="28px" ml={["15px", "40px"]} mt={["15px", "35px"]}>
              Você selecionou 
              <Text>o CTI do dia </Text>
              <Text fontWeight="bold">{format(dateCti, 'dd/MM/yyyy')}</Text>
            </Text>
            <Text ml={["15px", "60px"]} mt={["15px", "95px"]} fontSize="28px" fontWeight="bold">Em quais exercícios você teve dúvidas?</Text>

            <Stack direction={["column", "row", "row"]} ml={["24px", "60px"]} mt="50px" mr={["24px", "60px"]}>
              <FormControl>
                <FormLabel>Disciplina</FormLabel>
                <Select placeholder="Selecione a disciplina" onChange={(ev) => setIdDisciplina(Number(ev.target.value))} focusBorderColor="teal.500">
                  {disciplinas?.map(disciplina => (
                    <option value={disciplina.id} key={disciplina.id}>{disciplina.dsc_disciplina}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Conteúdo</FormLabel>
                <Select placeholder="Selecione conteúdo" onChange={(ev) => setIdConteudo(Number(ev.target.value))} disabled={!idDisciplina} focusBorderColor="teal.500">
                  {conteudos?.map(conteudo => (
                    <option value={conteudo.id} key={conteudo.id}>{conteudo.dsc_conteudo}</option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Flex align="center" justify="center" mt="20px" flexDirection="column">
              {conteudosFiltro.length > 0 && (
                <Text>Conteúdos selecionados: {conteudosFiltro.join()}</Text>
              )}
              <Button type="button" colorScheme="teal" onClick={selectedConteudo} disabled={!idDisciplina || !idConteudo} isLoading={loadingFiltros}>FILTRAR</Button>
            </Flex>

            {disciplinasSelected.length > 0 && disciplinasSelected.map((item, exD) => (
              <div key={item.id}>
                <Box px={["24px", "80px"]} onClick={() => openDisciplina(exD)} cursor="pointer">
                  <Flex borderBottom="1px solid #60C7AF" mt="48px" pb="10px" justify="space-between" align="center">
                    <Text fontSize="24px" fontWeight="bold">{item.dsc_disciplina}</Text>
                    {item?.open ? <BsChevronCompactDown size={30}/> : <BsChevronCompactRight size={30}/>}
                    
                  </Flex>
                </Box>
                <Collapse in={item.open}>
                  <Box px={["24px", "80px"]} mt="10px">
                    <InputGroup>
                      <InputRightElement
                        pointerEvents="none"
                        color="gray.300"
                        fontSize="1.2em"
                      >
                        {loadingSearch ? <Spinner /> : <BiSearch color="gray.500" />}
                      </InputRightElement>
                      <Input placeholder="Pesquise por conteúdo ou questão" onChange={(ev) => changeSearch(ev.target.value)} />
                    </InputGroup>
                  </Box>
                  {conteudosSelecionado?.length > 0 && conteudosSelecionado.filter(c => c.disciplina === item.id).map((cc, ixC) => (
                    <div key={cc.id}>
                      <Box ml={["24px", "90px"]} mr={["24px", "90px"]} onClick={() => openConteudo(cc)} cursor="pointer">
                        <Flex mt="48px" pb="10px" justify="space-between" align="center">
                          <Text fontSize="20px" fontWeight="bold">Conteúdo: {cc.dsc_conteudo}</Text>
                          {cc?.open ? <BsChevronCompactDown size={30}/> : <BsChevronCompactRight size={30}/>}
                        </Flex>
                      </Box>
                      <Collapse in={cc.open}>  
                        {questoes?.length > 0 && questoes.filter(q => q.idConteudo == cc.id).map((questM, ix) => (
                          <Box border="2px solid #E5E5E5" p="25px" mt="25px" ml={["24px", "90px"]} mr={["24px", "90px"]} key={questM.id}>
                            <Flex justify="space-between" align="center" onClick={() => openQuestao(questM)} cursor="pointer">
                              <Text fontSize="28px" fontWeight="bold">{questM.dsc_questao}</Text>
                              {questM?.open ? <BsChevronCompactDown size={30}/> : <BsChevronCompactRight size={30}/>}
                            </Flex>
                            <Collapse in={questM.open}>
                              <RadioGroup mt="50px" onChange={(ev) => selectedOptions(ev, questM)} value={String(questM.value)}>
                                <VStack align="center" justify="center" mt="20px">
                                  <Flex bg={questM.value === 1 ? 'rgba(96, 199, 175, 0.1)' : ''} border={questM.value === 1 ? "1px solid #60C7AF" : '1px solid #E5E5E5'} h="80px" align="center" px="20px" w="100%" >
                                    <Radio colorScheme="teal" value="1" size="lg">
                                      <Text fontSize={["16px", "28px"]}>Foram sanadas</Text>
                                    </Radio>
                                  </Flex>
                                  <Flex bg={questM.value === 2 ? 'rgba(96, 199, 175, 0.1)' : ''} border={questM.value === 2 ? "1px solid #60C7AF" : '1px solid #E5E5E5'} h="80px" align="center" px="20px" w="100%">
                                    <Radio colorScheme="teal" value="2" fontSize="28px" size="lg">
                                      <Text fontSize={["16px", "28px"]} lineHeight="21px">Acionei a monitoria mas continuo em dúvida</Text>
                                    </Radio>
                                  </Flex>
                                  <Flex bg={questM.value === 3 ? 'rgba(96, 199, 175, 0.1)' : ''} border={questM.value === 3 ? "1px solid #60C7AF" : '1px solid #E5E5E5'} h="80px" align="center" px="20px" w="100%" >
                                    <Radio colorScheme="teal" value="3" fontSize="28px" size="lg">
                                      <Text fontSize={["16px", "28px"]} lineHeight="21px">Não consegui resolver o exercício</Text>
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
                </Collapse> 
              </div>
            ))}

            

          </Box>
        )}
        {step === 3 && (
          <div>3</div>
        )}
      </Layout>
      <Footer step={step} firstStep={1} lastStep={2} nextStep={nextStep} previousStep={() => setStep(step-1)} finishStep={finishStep} loading={loadingSave} />
      <ModalFinish isOpen={isOpen} onClose={closeModal} onOpen={onOpen} message={messageModal} />
      <ModalHour isOpen={isOpenHour} onClose={onCloseHour} onOpen={onOpenHour} />
      {/* <ModalConteudo isOpen={IsOpenConteudo} onClose={onCloseConteudo} conteudos={conteudos} idDisciplina={idDisciplina} /> */}
    </Box>
  )
}