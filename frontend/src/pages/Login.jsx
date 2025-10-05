// src/pages/Login.jsx
import React, { useContext, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      alert('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} required />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={onChange} required />

        <div className="form-actions">
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
          <Link to="/forgot-password" className="link" style={{ marginLeft: 12 }}>Forgot password?</Link>
        </div>
      </form>
    </div>
  );
}
