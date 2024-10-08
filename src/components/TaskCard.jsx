import React, { useState } from "react";
import "./TaskCard.css";
import { FaTrash } from "react-icons/fa";
import { Draggable } from "@hello-pangea/dnd";

const TaskCard = ({ task, deleteTask, index, toggleExpand }) => {

  const toggleDescription = (id) => {
    toggleExpand(id);
  };

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="task-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => toggleDescription(task.id)}
        >
          <h3>{task.title}</h3>
          <div className={task.isExpanded ? "description-container" : "description-container-hidden"}>
            <p>{task.description}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); deleteTask(task); }} className="trash-icon">
            <FaTrash />
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
