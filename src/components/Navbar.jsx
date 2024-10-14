import { useUser } from "../context/UserContext";
import LogoutButton from "./LogoutButton";

import "./Navbar.css";

const Navbar = ({ children }) => {
  const { user } = useUser();

  return (
    <div className="navbar-container">
      <span className="nav-welcome-text">
        Welcome, <strong>{user.username}</strong>!
      </span>
      <div className="navbar-right">
        <LogoutButton />
        {children}
      </div>
    </div>
  );
};

export default Navbar;
