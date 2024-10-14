import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  FormErrorMessage,
  InputRightElement,
  InputGroup,
  Icon,
  Text,
  Link,
} from "@chakra-ui/react";
import { useUser } from "../context/UserContext";
import { register as registerUser } from "../api/index";
import { RegistrationSchema } from "../validation/userValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Register = () => {
  const [showPrimary, setShowPrimary] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(RegistrationSchema),
    mode: "onBlur",
  });

  const handleRegistration = async (formData) => {
    const { username, password } = formData;

    try {
      const { data } = await registerUser(username, password);

      // Check if the registration was successful
      if (data.statusCode === 201 && data.user) {
        login(data.user);
        navigate("/dashboard");
      } else {
        // Handle any unexpected responses
        throw new Error(data.error);
      }
    } catch (error) {
      // Handle specific error responses
      console.log(error);
      if (error.response && error.response.status === 400) {
        toast({
          title: "Error",
          description: "Username already exists",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred during registration",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
    reset();
    setShowPrimary(false);
    setShowSecondary(false);
  };

  const handleClick = () => setShowPrimary(!showPrimary);
  const handleClickConfirmation = () => setShowSecondary(!showSecondary);

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
      <form onSubmit={handleSubmit(handleRegistration)}>
        <VStack spacing="4">
          <FormControl isInvalid={!!errors.username} isRequired>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              placeholder="Enter a username"
              {...register("username")}
            />
            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.password} isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup>
              <Input
                type={showPrimary ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {showPrimary ? (
                    <Icon as={ViewOffIcon} />
                  ) : (
                    <Icon as={ViewIcon} />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.confirmPassword} isRequired>
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <InputGroup size="md">
              <Input
                type={showSecondary ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClickConfirmation}>
                  {showSecondary ? (
                    <Icon as={ViewOffIcon} />
                  ) : (
                    <Icon as={ViewIcon} />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              {errors.confirmPassword?.message}
            </FormErrorMessage>
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
