// src/pages/Profile.jsx
import React, { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="card">
      <h2>My Profile</h2>
      <div className="profile-grid">
        <div><strong>Name</strong></div><div>{user.name}</div>
        <div><strong>Email</strong></div><div>{user.email}</div>
        <div><strong>Role</strong></div><div>{user.role}</div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link to="/events" className="btn btn-outline">All Events</Link>
        <Link to="/my-events" className="btn btn-outline">My Events</Link>
        <Link to="/" className="btn" style={{ marginLeft: 8 }}>Home</Link>
      </div>
    </div>
  );
}
