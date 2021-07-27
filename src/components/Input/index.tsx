import {
  FormControl,
  Input as ChakraInput,
  FormLabel,
  InputProps as ChakraInputProps,
  FormErrorMessage
} from '@chakra-ui/react'
import { forwardRef, ForwardRefRenderFunction } from 'react'
import { FieldError } from 'react-hook-form'

interface InputProps extends ChakraInputProps {
  name: string
  label?: string
  mask?: string
  error?: FieldError
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error = null, mask = null, ...rest },
  ref
) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraInput 
        name={name} 
        id={name} 
        size="lg" 
        ref={ref} 
        {...rest} 
        variant="unstyled" 
        boxShadow="0px 4px 8px rgba(0, 0, 0, 0.08)" 
        background="#fff" 
        height="48px" 
        borderRadius="8px" 
        px="10px" 
        border="1px solid #E5E5E5" 
      />
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

const ChackraInput = forwardRef(InputBase)

export default ChackraInput;
