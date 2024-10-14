import {
  ChevronDownIcon,
  ChevronUpIcon,
  HamburgerIcon
} from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import "./PriorityColumn.css";
import TaskCard from "./TaskCard";

const PriorityColumn = ({
  priority,
  tasks,
  deleteTask,
  editTask,
  toggleTaskExpansion,
  toggleExpand,
  id,
}) => (
  <div className="column">
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
          <MenuItem
            onClick={() => toggleTaskExpansion(priority, true)}
            icon={<ChevronUpIcon />}
          >
            Expand All
          </MenuItem>
          <MenuItem
            onClick={() => toggleTaskExpansion(priority, false)}
            icon={<ChevronDownIcon />}
          >
            Collapse All
          </MenuItem>
        </MenuList>
      </Menu>
    </div>

    <div className="tasks-container">
      <Droppable droppableId={id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks &&
              tasks.map((task, index) => (
                <TaskCard
                  toggleExpand={toggleExpand}
                  deleteTask={deleteTask}
                  editTask={editTask}
                  key={task._id}
                  task={task}
                  index={index}
                />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  </div>
);

export default PriorityColumn;
