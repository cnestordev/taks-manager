import "./TaskCard.css";
import { FaTrash } from "react-icons/fa";
import { Draggable } from "@hello-pangea/dnd";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  IconButton,
} from "@chakra-ui/react";

const TaskCard = ({ task, deleteTask, index, toggleExpand }) => {
  const toggleDescription = (id) => {
    toggleExpand(id);
  };

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="task-card"
          onClick={() => toggleDescription(task.id)}
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
              <AccordionPanel
                pb={2}
              >
                <Box as="p" textAlign="center" fontSize="15px" mb={2}>
                  {task.description}
                </Box>
                <IconButton
                  aria-label="Delete Task"
                  icon={<FaTrash />}
                  size="sm"
                  colorScheme="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task);
                  }}
                  float="right"
                  className="trash-icon"
                />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      )}
    </Draggable>
  );
};

export default TaskCard;
