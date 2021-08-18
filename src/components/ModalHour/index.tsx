import { Box, Flex, Image, Modal, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";

interface ModalFinishProps {
  isOpen: boolean;
  onOpen:() => void;
  onClose:() => void;
}

export function ModalHour({isOpen, onClose}: ModalFinishProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="46px" w="300px" h="300px" px="10px" py="15px">
        <Image src="/img/clock.svg" alt="finishmodal" />
        <Flex flexDir="column" align="center" justify="center">
          <Text fontWeight="bold" fontSize="24px" textAlign="center" mt="10px" lineHeight="28px" w="178px">Dúvida enviada fora do prazo</Text>
          <Text fontSize="14px" textAlign="center" lineHeight="16px" mt="5px">Lembre-se de enviar suas dúvidas até as 21h do mesmo dia do CTI.</Text>
        </Flex>
      </ModalContent>
    </Modal>
  )
}