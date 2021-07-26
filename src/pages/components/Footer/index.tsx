import { Flex, Link, Box, Button } from "@chakra-ui/react";

interface FooterProps {
  step: number;
  nextStep: () => void;
  previousStep: () => void;
  finishStep: () => void;
  firstStep: number;
  lastStep: number;
}

export function Footer({step, nextStep, finishStep, firstStep, lastStep, previousStep}: FooterProps) {
  let space = 'flex-end';
  if (step > 1 && (step >= firstStep && step < lastStep)) {
    space = 'space-between';
  }

  if (step > 1 && step == lastStep) {
    space = 'space-between';
  }


  return (
    <Flex position="fixed" height="80px" bg="white" bottom="0" left="0" right="0" mb="0" boxShadow="0px -1px 8px rgba(0, 0, 0, 0.15)" justify={space} px="20px" align="center">
      {step > 1 && (
        <Button color="teal.500" fontSize="24px" onClick={previousStep} variant="link" fontWeight="normal">
          VOLTAR
        </Button>
      )}
      {step >= firstStep && step < lastStep && (
        <Button color="teal.500" fontSize="24px" onClick={nextStep} variant="link" fontWeight="normal">
          PROSSEGUIR
        </Button>
      )}
      {step === lastStep && (
        <Button color="teal.500" fontSize="24px" variant="link" fontWeight="normal" onClick={finishStep}>
          SALVAR
        </Button>
      )}
    </Flex>
  )
}