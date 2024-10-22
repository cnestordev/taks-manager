import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";
  
  const CompletedTaskModal = ({ isOpen, onClose, task, handleCompletedTask }) => {
    const cancelRef = useRef();
  
    return (
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        size="xl"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {task.isCompleted ? "Restore" : "Complete"} Task
            </AlertDialogHeader>
  
            <AlertDialogBody>
              <p>
                {
                  task.isCompleted ? "Restore task?" : "Mark task as completed?"
                }
              </p>
              <p>{task.title}</p>
            </AlertDialogBody>
  
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={handleCompletedTask} ml={3}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  };
  
  export default CompletedTaskModal;
  