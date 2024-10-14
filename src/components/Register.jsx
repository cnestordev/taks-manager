import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  Text,
  Link,
} from "@chakra-ui/react";
import { useUser } from "../context/UserContext";
import { register } from "../api/index";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register(username, password);
      console.log(data);

      // Check if the registration was successful
      if (data.statusCode === 201 && data.user) {
        console.log("Registration successful");
        login(data.user);
        navigate("/dashboard");
      } else {
        // Handle any unexpected responses
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      // Handle specific error responses
      if (error.response && error.response.status === 400) {
        setError("Username already exists");
      } else {
        setError("An error occurred during registration");
      }
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
      <Heading mb="6">Register</Heading>
      {error && <Text color="red.500">{error}</Text>}
      <form onSubmit={handleSubmit}>
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
          <Button type="submit" colorScheme="green" width="full">
            Register
          </Button>
        </VStack>
      </form>

      <Text mt="4" textAlign="center">
        Already have an account?{" "}
        <Link as={RouterLink} to="/login" color="teal.500">
          Login here
        </Link>
      </Text>
    </Box>
  );
};

export default Register;
