import { Avatar, Heading, Text } from "@chakra-ui/react";
import { useUser } from "../context/UserContext";
import LogoutButton from "./LogoutButton";
import "./Navbar.css";

const Navbar = ({ children }) => {
  const { user } = useUser();

  return (
    <div className="navbar-container">
      <div className="navbar-user-container">
        <div className="navbar-user-avatar">
          <Avatar color="#ebedf0" bg="#c2c7d0" name={user?.username} />
        </div>
        <div className="navbar-user-greeting">
          <Text className="greeting-text" margin="0" fontSize="medium">Hello,</Text>
          <Heading className="greeting-name" margin="0" fontSize="5xl">{user?.username || "Guest"}</Heading>
        </div>
      </div>
      <div className="navbar-right">
        <LogoutButton />
        {children}
      </div>
    </div>
  );
};

export default Navbar;
