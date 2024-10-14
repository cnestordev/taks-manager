import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex
} from "@chakra-ui/react";
import { Draggable } from "@hello-pangea/dnd";
import { FaEdit } from "react-icons/fa";
import "./TaskCard.css";

const TaskCard = ({ task, deleteTask, editTask, index, toggleExpand }) => {

  return (
    <Draggable key={task._id} draggableId={task._id} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="task-card"
          onClick={() => toggleExpand(task)}
        >
          <Accordion allowToggle index={task.isExpanded ? [0] : []}>
            <AccordionItem border="none">
              <h2>
                <AccordionButton padding="0" _hover={{ background: "none" }}>
                  <Box
                    as="span"
                    flex="1"
                    textAlign="center"
                    fontWeight="bold"
                    fontSize="18px"
                  >
                    {task.title}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={2}>
                <Box as="p" textAlign="center" fontSize="15px" mb={2}>
                  {task.description}
                </Box>
                <Flex gap="30px" justifyContent="center" marginTop="4">
                  <Button
                    aria-label="Delete Task"
                    size="sm"
                    className="task-btns delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task);
                    }}
                  >
                    Delete
                  </Button>

                  <Button
                    aria-label="Edit Task"
                    icon={<FaEdit />}
                    size="sm"
                    className="task-btns edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      editTask(task);
                    }}
                  >
                    Edit
                  </Button>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      )}
    </Draggable>
  );
};

export default TaskCard;
