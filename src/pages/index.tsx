import { useBreakpointValue, Box } from "@chakra-ui/react";
import { LoginDesktop } from '../components/Login/desktop';
import { LoginMobile } from "../components/Login/mobile";

export default function Login() {

  const isWideVersion: boolean = useBreakpointValue({
    base: false,
    lg: true,
  })

  return (
    <Box>
      {isWideVersion ? (
        <LoginDesktop />
      ) :  (
        <LoginMobile />
      )}
    </Box>
  )
}
