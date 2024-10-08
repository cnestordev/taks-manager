import "./TaskCard.css";
import { FaTrash } from "react-icons/fa";
import { Draggable } from "@hello-pangea/dnd";

const TaskCard = ({ task, deleteTask, index }) => (
  <Draggable key={task.id} draggableId={task.id} index={index}>
    {(provided) => (
      <div
        className="task-card"
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <button onClick={() => deleteTask(task)} className="trash-icon">
          <FaTrash />
        </button>
      </div>
    )}
  </Draggable>
);

export default TaskCard;
