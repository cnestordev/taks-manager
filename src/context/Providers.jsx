import { UserProvider } from "./UserContext";
import { TaskProvider } from "./TaskContext";
import { LoadingProvider } from "./LoadingContext";

const Providers = ({ children }) => {
  return (
    <LoadingProvider>
      <UserProvider>
        <TaskProvider>{children}</TaskProvider>
      </UserProvider>
    </LoadingProvider>
  );
};

export default Providers;
