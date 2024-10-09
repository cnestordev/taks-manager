import "./PriorityColumn.css";
import TaskCard from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";

const PriorityColumn = ({ priority, tasks, deleteTask, editTask, toggleExpand, id }) => (
  <Droppable droppableId={id}>
    {(provided) => (
      <div
        className="column"
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        <div className={`header header-${priority.toLowerCase()}`}>
          <h1 className="title">
            {priority} Priority
          </h1>
        </div>
        <div>
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
