import { useUser } from "../context/UserContext";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { user } = useUser();

  return (
    <div style={{ padding: "10px", borderBottom: "2px solid #e2e8f0" }}>
      {user ? (
        <>
          <span>
            Welcome, <strong>{user.username}</strong>!
          </span>
          <LogoutButton />
        </>
      ) : (
        <button>Login</button>
      )}
    </div>
  );
};

export default Navbar;
