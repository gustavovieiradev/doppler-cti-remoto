import Router from 'next/router';
import { Flex, Image, Link } from "@chakra-ui/react";

export function Header() {
  return (
    <Flex width="100w" p="20px" direction="row" justifyContent="space-between" alignItems="center">
      <Image src="/img/logo-doppler.svg" alt="logo" />
      <Link color="black" textDecoration="underline" onClick={() => Router.push('/')}>
        SAIR
      </Link>
    </Flex>
  )
}