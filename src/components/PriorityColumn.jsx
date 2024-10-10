import { IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import "./PriorityColumn.css";
import TaskCard from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";
import { AddIcon, ChevronDownIcon, ChevronUpIcon, HamburgerIcon } from "@chakra-ui/icons";

const PriorityColumn = ({
  priority,
  tasks,
  deleteTask,
  editTask,
  toggleTaskExpansion,
  toggleExpand,
  id,
}) => (
  <Droppable droppableId={id}>
    {(provided) => (
      <div
        className="column"
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        <div className={`header header-${priority.toLowerCase()}`}>
          <div></div>
          <h1 className="title">{priority} Priority</h1>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant=""
            />
            <MenuList>
              <MenuItem onClick={() => toggleTaskExpansion(priority, true)} icon={<ChevronUpIcon />} >
                Expand All
              </MenuItem>
              <MenuItem onClick={() => toggleTaskExpansion(priority, false)} icon={<ChevronDownIcon />} >
                Collapse All
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div className="tasks-container">
          {tasks &&
            tasks.map((task, index) => (
              <TaskCard
                toggleExpand={toggleExpand}
                deleteTask={deleteTask}
                editTask={editTask}
                key={task.id}
                task={task}
                index={index}
              />
            ))}
          {provided.placeholder}
        </div>
      </div>
    )}
  </Droppable>
);

export default PriorityColumn;
