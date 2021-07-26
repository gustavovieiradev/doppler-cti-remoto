import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  colors: {
    teal: {
      "300": "#60C7AF",
      "500": "#60C7AF"
    }
  },
  fonts: {
    heading: 'Raleway',
    body: 'Raleway'
  },
  styles: {
    global: {
      body: {
        bg: '#E5E5E5',
        color: 'black'
      }
    }
  }
})