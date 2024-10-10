import { useUser } from "../context/UserContext";

const Navbar = () => {
  const { user, login, logout } = useUser();

  return (
    <div style={{ padding: "10px", borderBottom: "2px solid #e2e8f0" }}>
      {user ? (
        <>
          <span>
            Welcome, <strong>{user.username}</strong>!
          </span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login({ username: "John Doe" })}>
          Mock Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
