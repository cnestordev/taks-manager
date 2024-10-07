import "./PriorityColumn.css";
import TaskCard from "./TaskCard";

function PriorityColumn({ priority, tasks }) {
  return (
    <>
      <div className="column">
        <div className="header">
          <h1>{priority} Priority</h1>
        </div>
        <div>
          {tasks.map((task, index) => (
            <TaskCard key={index} task={task} />
          ))}
        </div>
      </div>
    </>
  );
}

export default PriorityColumn;
