import { ReactNode } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import Router from "next/router";

interface LayoutProps {
  children: ReactNode;
  isWideVersion?: boolean; 
}

export function Layout({children, isWideVersion = true}: LayoutProps) {
  return (
    <>
      {isWideVersion ? (
        <Box w="100%" my="6" maxW={1480} minH="81vh" mx="auto" px="6" bg="#fff" border="1px solid #E5E5E5" borderRadius="8px" filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))" paddingBottom="200px">
          <Heading fontSize="28px" mt="30px">Bem-vindo ao CTI Home School</Heading>
          {children}
        </Box>
      ) : (
        <Box w="100%" bg="#fff" height="100%" pt="32px">
          <Flex justify="flex-end" mr="24px">
            <Text fontSize="18px" color="black" textDecoration="underline" onClick={() => Router.push('/')}>SAIR</Text>
          </Flex>
          <Box w="267px">
            <Text fontWeight="700" fontSize="28px" ml="11px" lineHeight="33px">Bem-vindo ao CTI Home School</Text>
          </Box>
          {children}
        </Box>
      )}
    </>
  )
}