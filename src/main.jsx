import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import Providers from "./context/Providers";
import theme from "./theme/theme.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Providers>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Providers>
  </StrictMode>
);
