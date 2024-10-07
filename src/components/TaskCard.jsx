import "./TaskCard.css";
import { FaTrash } from "react-icons/fa";

function TaskCard({ task, deleteTask }) {

    return (
        <>
            <div className="task-card">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <button onClick={() => deleteTask(task)} className="trash-icon"><FaTrash /></button>
            </div>
        </>
    );
}
export default TaskCard