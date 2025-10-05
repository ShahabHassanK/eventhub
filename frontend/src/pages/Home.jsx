// src/pages/Home.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="hero">
      <div className="container">
        <h1>Welcome to EventHub</h1>
        <p>Create and discover events — workshops, meetups, webinars, and more.</p>
        <div style={{ marginTop: 16 }}>
          <Link to="/events" className="btn">
            Browse Events
          </Link>

          {/* Only show Create Event if organizer or admin */}
          {user && (user.role === 'organizer' || user.role === 'admin') && (
            <Link to="/create" className="btn btn-outline" style={{ marginLeft: 12 }}>
              Create Event
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
