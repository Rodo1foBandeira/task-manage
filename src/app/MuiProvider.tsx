"use client"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PropsWithChildren } from "react";

const theme = createTheme({
    components: {
    },
  });

export default function MuiProvider({ children } : PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}