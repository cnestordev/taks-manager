import {
  ChevronDownIcon,
  ChevronUpIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  Tabs
} from "@chakra-ui/react";
import { Droppable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import "./PriorityColumn.css";
import TaskCard from "./TaskCard";

const PriorityColumn = ({
  priority,
  tasks,
  deleteTask,
  editTask,
  completedTask,
  toggleTaskExpansion,
  toggleExpand,
  id,
  isActive,
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  // Separate tasks into in-progress and completed
  const inProgressTasks = tasks.filter((task) => !task.isCompleted);
  const completedTasks = tasks.filter((task) => task.isCompleted);

  useEffect(() => {
    console.log(tabIndex);
  }, [tabIndex]);

  return (
    <div className={`column ${isActive ? "active" : ""}`}>
      <div className={`header header-${priority.toLowerCase()}`}>
        <div></div>
        <div className="header-content">
          <h1 className="title">{priority} Priority</h1>
          <Tabs onChange={(index) => setTabIndex(index)} isLazy>
            <TabList>
              <Tab>In Progress ({inProgressTasks.length})</Tab>
              <Tab isDisabled={ completedTasks.length === 0}>Completed ({completedTasks.length})</Tab>
            </TabList>
          </Tabs>
        </div>
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
              {/* Conditionally render based on the selected tab */}
              {tabIndex === 0 &&
                inProgressTasks.map((task, index) => (
                  <TaskCard
                    toggleExpand={toggleExpand}
                    deleteTask={deleteTask}
                    editTask={editTask}
                    completedTask={completedTask}
                    key={task._id}
                    task={task}
                    index={index}
                  />
                ))}
              {tabIndex === 1 &&
                completedTasks.map((task, index) => (
                  <TaskCard
                    toggleExpand={toggleExpand}
                    deleteTask={deleteTask}
                    editTask={editTask}
                    completedTask={completedTask}
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
};

export default PriorityColumn;
