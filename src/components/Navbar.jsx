import { useUser } from "../context/UserContext";

const Navbar = () => {
  const { user, login, logout } = useUser();

  const loginUser = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5000/user", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (response.ok) {
        console.log(data.user);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

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
        <button onClick={() => loginUser("john", "123456")}>Mock Login</button>
      )}
    </div>
  );
};

export default Navbar;
