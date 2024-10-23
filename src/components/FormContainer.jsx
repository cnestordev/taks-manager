import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { MdCheckCircle } from "react-icons/md";

import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Collapse,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ListIcon,
  ListItem,
  Select,
  Textarea,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";

import { getListOfUsers } from "../utils/userUtils";
import { TaskSchema } from "../validation/taskValidation";

import "./FormContainer.css";

const FormContainer = ({ addTask }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const { isOpen: isOptionsOpen, onToggle } = useDisclosure();
  const [usersList, setUsersList] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(TaskSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      data.addedUsers = [...addedUsers];
      await addTask(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getListOfUsers();
        setUsersList(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSelectedUser = (selectedUser) => {
    setAddedUsers((prevList) => {
      const isUserInList = prevList.some(
        (user) => user._id === selectedUser._id
      );
      return isUserInList
        ? prevList.filter((user) => user._id !== selectedUser._id)
        : [...prevList, selectedUser];
    });
  };

  return (
    <div className="form-container">
      <Button ref={btnRef} colorScheme="blue" onClick={onOpen}>
        <AddIcon boxSize={6} />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add New Task</DrawerHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <DrawerBody>
              {/* Title Input */}
              <FormControl isInvalid={errors.title} isRequired>
                <FormLabel htmlFor="title">Title:</FormLabel>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  {...register("title")}
                />
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              </FormControl>

              {/* Description Input */}
              <FormControl isInvalid={errors.description} mt={4}>
                <FormLabel htmlFor="description">Description:</FormLabel>
                <Textarea
                  id="description"
                  placeholder="Enter task description"
                  {...register("description")}
                />
                <FormErrorMessage>
                  {errors.description?.message}
                </FormErrorMessage>
              </FormControl>

              {/* Priority Select */}
              <FormControl isInvalid={errors.priority} mt={4} isRequired>
                <FormLabel htmlFor="priority">Priority:</FormLabel>
                <Select
                  id="priority"
                  placeholder="Select priority"
                  {...register("priority")}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Select>
                <FormErrorMessage>{errors.priority?.message}</FormErrorMessage>
              </FormControl>

              <Button mt={4} onClick={onToggle}>
                Assign Users
              </Button>
              <Collapse in={isOptionsOpen} animateOpacity>
                <Box
                  p={4}
                  mt={4}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius="md"
                >
                  <UnorderedList styleType="none" spacing={3}>
                    {usersList.length > 0 ? (
                      usersList.map((user) => {
                        const isAdded = addedUsers.some(
                          (addedUser) => addedUser._id === user._id
                        );
                        return (
                          <ListItem
                            key={user._id}
                            p={2}
                            _hover={{ bg: "gray.100", cursor: "pointer" }}
                            borderBottom="1px solid #e2e8f0"
                            _last={{ borderBottom: "none" }}
                            onClick={() => handleSelectedUser(user)}
                          >
                            {user.username}
                            {isAdded && (
                              <ListIcon
                                ml={2}
                                as={MdCheckCircle}
                                color="green.500"
                              />
                            )}
                          </ListItem>
                        );
                      })
                    ) : (
                      <ListItem>No users found.</ListItem>
                    )}
                  </UnorderedList>
                </Box>
              </Collapse>
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" type="submit">
                Save Task
              </Button>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FormContainer;
