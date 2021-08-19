import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Router from 'next/router';
import { createContext, ReactNode, useContext } from "react";
import { api } from "../services/api";
import { parseCookies, setCookie } from "nookies";

interface User {
  dsc_nome_completo: string;
  dsc_matricula: string;
  dsc_cpf: string;
  id: number;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface SignInCredentials {
  email: string;
  matricula: string;
}

const AuthContext = createContext({} as AuthContextData);

interface AuthContextData {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  // signOut: () => void;
  user: User;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;
  const toast = useToast();
  
  useEffect(() => {
    const { 'nextauth.user': cookieUser } = parseCookies();
    const localUser = localStorage.getItem('nextauth.user');

    if (localUser) {
      const userParse = JSON.parse(localUser);
      setUser(userParse);
    }

    if (cookieUser) {
      const userParse = JSON.parse(cookieUser);
      setUser(userParse);
    }

  }, [])

  async function signIn({ email, matricula }: SignInCredentials): Promise<void> {
    try {
      const { data } = await api.get(`api/public/aluno/?dsc_matricula=${matricula}&format=json`)

      if (!data.length) {
        toast({
          title: 'Matrícula não encontrada!',
          status: 'error',
          duration: 9000,
          isClosable: true
        })
        return;
      }
      setUser(data[0]);

      localStorage.setItem('nextauth.user', JSON.stringify(data[0]));

      setCookie(undefined, 'nextauth.user', JSON.stringify(data[0]), {
        maxAge:  60 * 60 * 24 * 30,
        path: '/'
      })

      Router.push('/home');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, user, isAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  )

}

export const useAuth = () => useContext(AuthContext);