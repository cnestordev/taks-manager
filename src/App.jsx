import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { DragDropContext } from "@hello-pangea/dnd";
import PriorityColumn from "./components/PriorityColumn";
import FormContainer from "./components/FormContainer";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";

const App = () => {
  const items = JSON.parse(localStorage.getItem("tasks")) || [];
  const [tasks, setTasks] = useState(items);

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

  const addTask = (e) => {
    e.preventDefault();

    if (title === "" || description === "") {
      setError("All fields required");
      return;
    }

    setError("");
    setTasks([...tasks, { title, description, priority, id: generateId() }]);
  };

  const generateId = () => Math.random().toString(36).substring(2, 7);

  const deleteTask = (task) => {
    setSelectedTask(task);
    onOpen();
  };

  const handleRemoveTask = () => {
    if (selectedTask) {
      const newTasks = tasks.filter((t) => t.id !== selectedTask.id);
      setTasks(newTasks);
      setSelectedTask(null);
    }
    onClose();
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

  const saveTaskChanges = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id
        ? { ...task, title, description, priority }
        : task
    );
    setTasks(updatedTasks);
    setSelectedTask(null);
    onEditModalClose();
  };

  const toggleExpand = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, isExpanded: !task.isExpanded } : task
      )
    );
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedTasks = Array.from(tasks);

    const sourceIndex = updatedTasks.findIndex(
      (task) => task.id === draggableId
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

    setTasks(updatedTasks);
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    setTitle("");
    setDescription("");
    setPriority("High");
  }, [tasks]);

  return (
    <div className="container">
      {/* Delete Confirmation Modal */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Task
              <p className="modal-task-title">
                {selectedTask && selectedTask.title}
              </p>
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this task?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleRemoveTask} ml={3}>
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
              <Button colorScheme="blue" mr={3} onClick={saveTaskChanges}>
                Save
              </Button>
              <Button onClick={onEditModalClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Drag and Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="columns-container">
          <PriorityColumn
            toggleExpand={toggleExpand}
            deleteTask={deleteTask}
            editTask={editTask}
            priority="High"
            tasks={tasks.filter((task) => task.priority === "High")}
            id="High"
          />
          <PriorityColumn
            toggleExpand={toggleExpand}
            deleteTask={deleteTask}
            editTask={editTask}
            priority="Medium"
            tasks={tasks.filter((task) => task.priority === "Medium")}
            id="Medium"
          />
          <PriorityColumn
            toggleExpand={toggleExpand}
            deleteTask={deleteTask}
            editTask={editTask}
            priority="Low"
            tasks={tasks.filter((task) => task.priority === "Low")}
            id="Low"
          />
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

export default App;
