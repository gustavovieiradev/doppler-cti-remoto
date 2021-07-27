import { Button, Image, Modal, ModalContent, ModalOverlay, Select, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "../../contexts/FormContext";

interface Conteudo {
  id: number;
  dsc_conteudo: string;
}

interface ModalConteudoProps {
  isOpen: boolean;
  onClose:() => void;
  conteudos: Conteudo[];
  idDisciplina: number;
}

export function ModalConteudo({isOpen, onClose, conteudos, idDisciplina}: ModalConteudoProps) {
  const [id, setId] = useState<string>();
  const { closeModalConteudo } = useForm();

  async function selectConteudo() {
    await closeModalConteudo(Number(id), idDisciplina);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="46px" w="343px" h="343px" alignItems="center" justifyContent="center" p="20px">
        <VStack spacing="4">
          <Select placeholder="Selecione o conteúdo" onChange={(ev) => setId(ev.target.value)}>
            {conteudos?.map(conteudo => (
              <option value={conteudo.id} key={conteudo.id}>{conteudo.dsc_conteudo}</option>
            ))}
          </Select>
          <Button type="button" colorScheme="teal" onClick={selectConteudo}>Selecionar</Button>
        </VStack>
      </ModalContent>
    </Modal>
  )
}