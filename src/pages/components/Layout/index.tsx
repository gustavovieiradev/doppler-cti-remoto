import { ReactNode } from "react";
import { Flex, Heading } from "@chakra-ui/react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({children}: LayoutProps) {
  return (
    <Flex direction="column" w="100%" my="6" maxW={1480} minH="81vh" mx="auto" px="6" bg="#fff" border="1px solid #E5E5E5" borderRadius="8px" filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" paddingBottom="100px">
      <Heading fontSize="28px" mt="30px">Bem-vindo ao CTI Home School</Heading>
      {children}
    </Flex>
  )
}