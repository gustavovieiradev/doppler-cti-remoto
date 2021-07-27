import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../../styles/theme';
import { AuthProvider } from '../contexts/AuthContext';
import { FormProvider } from '../contexts/FormContext';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <FormProvider>
          <Component {...pageProps} />
        </FormProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default MyApp
