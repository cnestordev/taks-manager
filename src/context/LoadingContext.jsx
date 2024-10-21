import { createContext, useState, useContext } from "react";

const LoadingContext = createContext(null);

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loadingTaskId, setLoadingTaskId] = useState(null);

  return (
    <LoadingContext.Provider value={{ loadingTaskId, setLoadingTaskId }}>
      {children}
    </LoadingContext.Provider>
  );
};
