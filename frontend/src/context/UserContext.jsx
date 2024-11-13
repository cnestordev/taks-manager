import { createContext, useContext, useState, useEffect } from "react";
import { checkUser } from "../api/index";

const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(user)

  // Check the user session on initial load
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const { data } = await checkUser();
        // Check if response is valid and contains user information
        if (data.statusCode === 200 && data.user) {
          setUser(data.user);
        } else {
          throw new Error("No user data found.");
        }
      } catch (error) {
        setUser(null); // Clear user if not authenticated
      } finally {
        setLoading(false); // Stop loading once check is complete
      }
    };

    checkUserSession();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
