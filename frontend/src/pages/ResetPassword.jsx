// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/api/auth/reset-password/${token}`, { password });
      // server returns user + token; cookie set — redirect home
      setMessage('Password reset successful. Redirecting…');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="card">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>New password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        <div className="form-actions">
          <button className="btn" type="submit">Set New Password</button>
        </div>
      </form>
      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </div>
  );
}
