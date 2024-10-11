import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useUser } from "../context/UserContext";
import { login } from "../api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login: loginUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await login(username, password);
      console.log(data);

      // Check if the status code indicates success
      if (data.statusCode === 200 && data.user) {
        loginUser(data.user);
        navigate("/dashboard");
      } else {
        // Handle different responses based on status code or message
        setError(data.message || "Login failed");
      }
    } catch (error) {
      // General error handling for network issues or unexpected errors
      setError("Invalid username or password");
    }
  };

  return (
    <Box
      maxWidth="400px"
      mx="auto"
      mt="100px"
      p="4"
      borderWidth="1px"
      borderRadius="lg"
    >
      <Heading mb="6">Login</Heading>
      {error && <Text color="red.500">{error}</Text>}
      <form onSubmit={handleLogin}>
        <VStack spacing="4">
          <FormControl isRequired>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" width="full">
            Login
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Login;
