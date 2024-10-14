import "./FormContainer.css";
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
  useDisclosure,
  FormErrorMessage,
} from "@chakra-ui/react";

import { AddIcon } from "@chakra-ui/icons";
import { TaskSchema } from "../validation/taskValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef } from "react";

const FormContainer = ({ addTask }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  // React Hook Form  validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(TaskSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data, e) => {
    e.preventDefault();
    await addTask(data, onClose);
    reset();
  };

  return (
    <div className="form-container">
      <Button ref={btnRef} colorScheme="blue" onClick={onOpen}>
        <AddIcon boxSize={6} />{" "}
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

          <form onSubmit={(e) => handleSubmit((data) => onSubmit(data, e))(e)}>
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
