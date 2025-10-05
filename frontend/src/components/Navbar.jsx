// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand / Logo */}
        <Link to="/" className="brand">
          EventHub
        </Link>

        {/* Left navigation */}
        <div className="nav-left">
          <NavLink
            to="/events"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Events
          </NavLink>

          {user && (user.role === "organizer" || user.role === "admin") && (
            <>
              <NavLink
                to="/my-events"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                My Events
              </NavLink>
              <NavLink
                to="/create"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Create Event
              </NavLink>
            </>
          )}
        </div>

        {/* Right navigation (auth) */}
        <div className="nav-right">
          {user ? (
            <>
              <span className="welcome">Hi, {user.name}</span>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Profile
              </NavLink>
              <button className="btn-link" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
