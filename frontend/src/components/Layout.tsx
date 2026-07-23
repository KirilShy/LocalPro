import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { isLoggedIn, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <header className="navbar">
        <NavLink to="/" className="navbar-brand">
          LocalPro
        </NavLink>
        <nav className="navbar-links">
          <NavLink to="/" end>
            Browse
          </NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/bookings">My bookings</NavLink>
              <span className="navbar-username">{username}</span>
              <button type="button" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register">Sign up</NavLink>
            </>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
