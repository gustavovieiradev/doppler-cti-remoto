import Router from 'next/router';
import { Flex, Image, Heading, Stack, Checkbox, Button, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "../../../services/api";
import ChackraInput from "../Input";
import { LoginFormData } from "./interfaces";
import { loginFormSchema } from "./schema";
import { useAuth } from '../../../contexts/AuthContext';

export function LoginDesktop() {
  const toast = useToast();
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(loginFormSchema)
  });

  const { signIn } = useAuth();

  const handleLogin: SubmitHandler<LoginFormData> = async (values) => {

    await signIn(values);

    // try {
    //   const {data} = await api.get(`api/public/aluno/?dsc_matricula=${values.matricula}&format=json`)
      
    //   console.log(data)

    //   if (!data.length) {
    //     toast({
    //       title: 'Matrícula não encontrada!',
    //       status: 'error',
    //       duration: 9000,
    //       isClosable: true
    //     })
    //     return;
    //   }

    //   Router.push('/home');

    // } catch (err) {
    //   console.log(err)
    // }

  }

  const { errors } = formState;
  return (
    <>
      <Flex w="100vw" h="100vh" bg="teal.300" align="center" justify="center" px="170px" py="120px" as="form" onSubmit={handleSubmit(handleLogin)}>
        <Flex w="730px" h="680px" bg="white" align="flex-start" p="20px" direction="column" position="relative">
          <Image src="/img/logo-doppler.svg" alt="logo" />
          <Heading fontSize="28px" mt="42px">Acesse o CTI Home School</Heading>
          <Image src="/img/ilustra-home.svg" position="absolute" bottom="20px" right="20px" w="613px" height="554px" alt="ilustra-home" />
        </Flex>
        <Stack bg="#FBFBFB" w="390px" h="421px" justify="center" align="center" direction="column" px="40px" spacing="10px">
          <ChackraInput name="email" label="E-mail" {...register('email')} error={errors.email} />
          <ChackraInput name="matricula" label="Matrícula" {...register('matricula')} error={errors.matricula} />
          <Checkbox defaultIsChecked colorScheme="teal" float="left">Continuar logado</Checkbox>
          <Button type="submit" mt="6" colorScheme="teal" size="lg" borderRadius="30px" w="160px"> ACESSAR </Button>
        </Stack>
      </Flex>
    </>
  )
}