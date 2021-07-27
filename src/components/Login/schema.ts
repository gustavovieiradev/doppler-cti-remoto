import * as yup from 'yup'

export const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email obrigatório')
    .email('Informe um email válido'),
  matricula: yup.string().required('Mátricula obrigatória'),
});