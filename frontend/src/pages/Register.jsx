// src/pages/Register.jsx
import React, { useContext, useState } from 'react';
import AuthContext from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'attendee' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/');
    } catch (err) {
      alert('Register failed: ' + (err.message || err.data?.error || JSON.stringify(err.data)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={onChange} required />

        <label>Email</label>
        <input name="email" value={form.email} type="email" onChange={onChange} required />

        <label>Password</label>
        <input name="password" value={form.password} type="password" onChange={onChange} required />

        <label>Role</label>
        <select name="role" value={form.role} onChange={onChange}>
          <option value="attendee">Attendee</option>
          <option value="organizer">Organizer</option>
        </select>

        <div className="form-actions">
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Registering…' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
}
