import "./FormContainer.css";
import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";

const FormContainer = ({
  title,
  description,
  priority,
  error,
  setTitle,
  setDescription,
  setPriority,
  addTask,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <div className="form-container">
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        <AddIcon />
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

          <form onSubmit={addTask}>
            <DrawerBody>
              {/* Title Input */}
              <FormControl isRequired>
                <FormLabel htmlFor="title">Title:</FormLabel>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                />
              </FormControl>

              {/* Description Input */}
              <FormControl mt={4}>
                <FormLabel htmlFor="description">Description:</FormLabel>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description"
                />
              </FormControl>

              {/* Priority Select */}
              <FormControl mt={4} isRequired>
                <FormLabel htmlFor="priority">Priority:</FormLabel>
                <Select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  placeholder="Select priority"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Select>
              </FormControl>

              {/* Error Message */}
              {error && (
                <Text color="red.500" mt={4}>
                  {error}
                </Text>
              )}
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
