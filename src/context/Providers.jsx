import { UserProvider } from "./UserContext";
import { TaskProvider } from "./TaskContext";

const Providers = ({ children }) => {
  return (
    <UserProvider>
      <TaskProvider>
        {children}
      </TaskProvider>
    </UserProvider>
  );
};

export default Providers;
