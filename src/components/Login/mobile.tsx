import Router from 'next/router';
import dynamic from 'next/dynamic'

import { Flex, Image, Stack, Checkbox, Button, Box, Text, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import ChackraInput  from "../Input";
import { LoginFormData } from "./interfaces";
import { loginFormSchema } from "./schema";
import { api } from '../../services/api';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginMobile() {
  const { signIn } = useAuth();
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(loginFormSchema)
  });
  const [loading, setLoading] = useState(false);

  const handleLogin: SubmitHandler<LoginFormData> = async (values) => {
    try {
      await signIn(values);
    } catch (err) {
      setLoading(false)
      console.log(err)
    }

  }

  const { errors } = formState;
  return (
    <Flex w="100vw" h="100vh" bg="teal.300" align="center" justify="center" px="8px" py="8px">
      <Stack h="600px" bg="white" w="100%" borderRadius="16px" boxShadow="0px 4px 8px rgba(0, 0, 0, 0.08)" border="1px solid #E5E5E5" py="33px" px="10px">
        <Flex align="center" justify="center">
          <Image src="/img/logo-doppler.svg" alt="logo" w="157px" h="48px" />
        </Flex>
        <Box position="relative" height="230px">
          <Image src="/img/ilustra-home.svg" w="250px" height="220px" alt="ilustra-home" position="absolute" right="0" />
          <Box fontSize="28px" fontWeight="bold" position="absolute">
            <Text>Acesse o </Text>
            <Text>formulário do </Text>
            <Text>CTI</Text>
          </Box>
        </Box>
        <Stack as="form" onSubmit={handleSubmit(handleLogin)}>
          <ChackraInput name="etestemail" label="E-mail" {...register('email')} error={errors.email} />
          <ChackraInput name="matricula" label="Matrícula" {...register('matricula')} error={errors.matricula} />
          <Checkbox defaultIsChecked colorScheme="teal" mt="10px">Continuar logado</Checkbox>
          <Flex align="center" justify="center">
            <Button type="submit" mt="6" colorScheme="teal" size="lg" borderRadius="30px" w="160px"> ACESSAR </Button>
          </Flex>
        </Stack>
      </Stack>
    </Flex>
  )
}