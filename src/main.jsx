import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "./context/UserContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <ChakraProvider toastOptions={{ defaultOptions: { position: "top-center" } }}>
        <App />
      </ChakraProvider>
    </UserProvider>
  </StrictMode>
);
