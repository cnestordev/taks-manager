import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";

import { TaskSchema } from "../validation/taskValidation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

const EditTaskModal = ({ isOpen, onClose, saveTaskChanges, selectedTask }) => {
  // React Hook Form validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(TaskSchema),
    mode: "onBlur",
    defaultValues: {
      title: selectedTask?.title || "",
      description: selectedTask?.description || "",
      priority: selectedTask?.priority || "Medium",
    },
  });


  useEffect(() => {
    if (selectedTask) {
      reset({
        title: selectedTask.title,
        description: selectedTask.description,
        priority: selectedTask.priority,
      });
    }
  }, [selectedTask, reset]);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    await saveTaskChanges(data);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={(e) => handleSubmit((data) => onSubmit(data, e))(e)}>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={errors.title} isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                id="title"
                placeholder="Edit task title"
                {...register("title")}
              />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.description} isRequired mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                id="description"
                placeholder="Edit task description"
                {...register("description")}
              />
              <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.priority} isRequired mt={4}>
              <FormLabel>Priority</FormLabel>
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
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" type="submit">
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditTaskModal;
