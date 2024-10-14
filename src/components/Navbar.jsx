import { useUser } from "../context/UserContext";
import LogoutButton from "./LogoutButton";

import "./Navbar.css";

const Navbar = ({ children }) => {
  const { user } = useUser();

  return (
    <div className="navbar-container">
      <span>
        Welcome, <strong>{user.username}</strong>!
      </span>
      <LogoutButton />
      {children}
    </div>
  );
};

export default Navbar;
