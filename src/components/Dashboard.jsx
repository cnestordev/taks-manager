import { WarningIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useRef, useState } from "react";
import "../App.css";
import FormContainer from "../components/FormContainer";
import Navbar from "../components/Navbar";
import PriorityColumn from "../components/PriorityColumn";

import { createTask, updateTaskOrder } from "../api/index";
import { useUser } from "../context/UserContext";

const Dashboard = () => {
  const { user, updateTasks } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("High");
  const [error, setError] = useState("");

  const [selectedTask, setSelectedTask] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const cancelRef = useRef();
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const addTask = async (e) => {
    e.preventDefault();

    if (title === "" || description === "") {
      setError("All fields required");
      return;
    }

    try {
      const { data } = await createTask({ title, description, priority });
      if (data.statusCode === 201 && data.tasks) {
        updateTasks(data.tasks);
        setError("");
      } else {
        throw new Error("Error creating a new task");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = (task) => {
    setSelectedTask(task);
    onOpen();
  };

  const editTask = (task) => {
    if (task) {
      setSelectedTask(task);
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      onEditModalOpen();
    }
  };

  const updateTasksOptimistically = async (updateFunction) => {
    const originalTasks = Array.from(user.tasks);
    const updatedTasks = updateFunction(originalTasks);

    // Optimistic UI update - update the tasks immediately
    updateTasks(updatedTasks);

    try {
      // Send the updated tasks array to the server in the background
      const { data } = await updateTaskOrder(updatedTasks);
      // Re-sync the tasks if the server returns something different
      updateTasks(data.tasks);
    } catch (error) {
      console.error("Error updating task order:", error);
      // Rollback to original tasks
      updateTasks(originalTasks);
    }
  };

  const saveTaskChanges = async () => {
    await updateTasksOptimistically((originalTasks) =>
      originalTasks.map((task) =>
        task._id === selectedTask._id
          ? { ...task, title, description, priority }
          : task
      )
    );
    setSelectedTask(null);
    onEditModalClose();
  };

  const toggleExpand = async (selectedTask) => {
    await updateTasksOptimistically((originalTasks) =>
      originalTasks.map((task) =>
        task._id === selectedTask._id
          ? { ...task, isExpanded: !task.isExpanded }
          : task
      )
    );
  };

  const handleRemoveTask = async () => {
    await updateTasksOptimistically((originalTasks) =>
      originalTasks.map((task) =>
        task._id === selectedTask._id
          ? { ...task, isDeleted: true }
          : task
      )
    );
    setSelectedTask(null);
    onClose();
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    await updateTasksOptimistically((originalTasks) => {
      const updatedTasks = Array.from(originalTasks);

      const sourceIndex = updatedTasks.findIndex(
        (task) => task._id === draggableId
      );
      const movedTask = {
        ...updatedTasks[sourceIndex],
        priority: destination.droppableId,
      };

      updatedTasks.splice(sourceIndex, 1);

      const destinationPriorityTasks = updatedTasks.filter(
        (task) => task.priority === destination.droppableId
      );
      const destinationIndex =
        destinationPriorityTasks.length >= destination.index
          ? destination.index
          : destinationPriorityTasks.length;

      updatedTasks.splice(
        destinationIndex +
          updatedTasks.findIndex(
            (task) => task.priority === destination.droppableId
          ),
        0,
        movedTask
      );

      return updatedTasks;
    });
  };

  const toggleTaskExpansion = async (priority, boolean) => {
    await updateTasksOptimistically((originalTasks) =>
      originalTasks.map((task) =>
        task.priority === priority && task.isExpanded !== boolean
          ? { ...task, isExpanded: boolean }
          : task
      )
    );
  };

  const priorities = ["High", "Medium", "Low"];

  return (
    <div className="container">
      <Navbar />
      {/* Delete Confirmation Modal */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        size="xl"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <WarningIcon /> Delete Task
            </AlertDialogHeader>

            <AlertDialogBody>
              <p className="modal-delete-message">
                Are you sure you want to delete this task?
              </p>
              <p className="modal-task-title">
                {selectedTask && selectedTask.title}
              </p>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button borderRadius={50} ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                borderRadius={50}
                colorScheme="red"
                onClick={handleRemoveTask}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Edit Task Modal */}
      {selectedTask && (
        <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isEditModalOpen}
          onClose={onEditModalClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Task Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Input
                  placeholder="Task Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Priority</FormLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Select>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                borderRadius={50}
                colorScheme="blue"
                mr={3}
                onClick={saveTaskChanges}
              >
                Save
              </Button>
              <Button borderRadius={50} onClick={onEditModalClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Drag and Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="columns-container">
          {priorities.map((priority) => (
            <PriorityColumn
              key={priority}
              toggleExpand={toggleExpand}
              deleteTask={deleteTask}
              editTask={editTask}
              toggleTaskExpansion={toggleTaskExpansion}
              priority={priority}
              tasks={user.tasks.filter((task) => task.priority === priority && !task.isDeleted)}
              id={priority}
            />
          ))}
        </div>
        <FormContainer
          title={title}
          description={description}
          priority={priority}
          error={error}
          setTitle={setTitle}
          setDescription={setDescription}
          setPriority={setPriority}
          addTask={addTask}
        />
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
