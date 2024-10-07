import "./PriorityColumn.css";
import TaskCard from "./TaskCard";

function PriorityColumn({ priority, tasks, deleteTask }) {
  return (
    <>
      <div className="column">
        <div className="header">
          <h1>{priority} Priority</h1>
        </div>
        <div>
          {
            tasks && tasks.length === 0 ? <p>No {priority} tasks</p> : tasks.map((task) => <TaskCard deleteTask={deleteTask} key={task.title} task={task} />)
          }
        </div>
      </div>
    </>
  );
}

export default PriorityColumn;
