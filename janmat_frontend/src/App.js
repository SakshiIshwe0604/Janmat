import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import IssueList from "./components/IssueList";
import IssueForm from "./components/IssueForm";
import Profile from "./components/Profile"; // ✅ Import Profile page
import EditProfile from "./components/EditProfile";
import "./App.css";

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const isLoggedIn = !!localStorage.getItem("access_token");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo" onClick={() => navigate("/")}>
        🗳️ <span>Janmat</span>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/edit-profile">Edit Profile</Link>
        {!isLoggedIn && <Link to="/login">Login</Link>}
        {!isLoggedIn && <Link to="/register">Register</Link>}
        {isLoggedIn && <Link to="/profile">Profile</Link>} {/* ✅ Added */}
        {isLoggedIn && <span className="welcome">Welcome, {username} 👋</span>}
        {isLoggedIn && (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <IssueForm />
                <IssueList />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} /> {/* ✅ Added */}
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
