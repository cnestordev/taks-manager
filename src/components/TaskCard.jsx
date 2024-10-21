import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
} from "@chakra-ui/react";
import { Draggable } from "@hello-pangea/dnd";
import { FaEdit } from "react-icons/fa";
import "./TaskCard.css";
import { useLoading } from "../context/LoadingContext";

const TaskCard = ({ task, deleteTask, editTask, index, toggleExpand }) => {
  const { loadingTaskId } = useLoading();
  const taskIdMatch = loadingTaskId === task._id;

  return (
    <Draggable key={task._id} draggableId={task._id} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${taskIdMatch ? "loading-border" : ""}`}
          onClick={() => toggleExpand(task)}
        >
          <svg
            style={{ display: taskIdMatch ? "block" : "none" }}
            height="100%"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              rx="8"
              ry="8"
              className="line"
              height="100%"
              width="100%"
              strokeLinejoin="round"
            />
          </svg>
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
