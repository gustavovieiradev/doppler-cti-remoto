import { Image, Modal, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";

interface ModalFinishProps {
  isOpen: boolean;
  onOpen:() => void;
  onClose:() => void;
}

export function ModalFinish({isOpen, onClose, onOpen}: ModalFinishProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="46px" w="343px" h="343px" alignItems="center" justifyContent="center">
        <Image src="/img/finish-modal.svg" alt="finishmodal" />
        <Text fontWeight="bold" fontSize="44px" textAlign="center">Incrível, Parabéns!</Text>
      </ModalContent>
    </Modal>
  )
}