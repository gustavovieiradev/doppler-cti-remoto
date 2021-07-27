import { createContext, ReactNode, useContext, useState } from "react";
import { api } from "../services/api";

interface FormProviderProps {
  children: ReactNode;
}

interface FormContextData {
  // signIn: (credentials: SignInCredentials) => Promise<void>;
  // signOut: () => void;
  idConteudo: number;
  questoes: Questao;
  closeModalConteudo: (idConteudo: number, idDisciplina: number) => Promise<void>;
}

interface Questao {
  idDisciplina: number;
  questoes: Array<{
    id: number;
    dsc_questao: number;
    value?: string;
  }>
}

const FormContext = createContext({} as FormContextData);

export function FormProvider({children}: FormProviderProps) {
  const [idConteudo, setIdConteudo] = useState();
  const [questoes, setQuestoes] = useState<Questao>({} as Questao);

  async function closeModalConteudo(idConteudo, idDisciplina) {
    const {data} = await api.get(`/api/public/questao/?ano_letivo=2021&conteudo=${idConteudo}`);
    setIdConteudo(idConteudo);
    setQuestoes({
      idDisciplina,
      questoes: data
    });
  }

  return (
    <FormContext.Provider value={{idConteudo, closeModalConteudo, questoes}}>
      {children}
    </FormContext.Provider>
  )
}

export const useForm = () => useContext(FormContext);