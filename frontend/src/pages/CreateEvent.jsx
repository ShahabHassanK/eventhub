// src/pages/CreateEvent.jsx
import React, { useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    capacity: 100,
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // date input is local datetime like "2025-10-02T15:00"
      const payload = {
        title: form.title,
        description: form.description,
        location: form.location || 'Online',
        date: new Date(form.date).toISOString(),
        capacity: Number(form.capacity) || 0,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      const res = await api.post('/api/events', payload);
      navigate(`/events/${res.data._id}`);
    } catch (err) {
      alert('Create failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Title</label>
        <input name="title" value={form.title} onChange={onChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={onChange} rows="5" />

        <label>Location</label>
        <input name="location" value={form.location} onChange={onChange} placeholder="e.g., Online or Karachi" />

        <label>Date & Time</label>
        <input
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={onChange}
          required
        />

        <label>Capacity</label>
        <input name="capacity" type="number" value={form.capacity} onChange={onChange} />

        <label>Tags (comma separated)</label>
        <input name="tags" value={form.tags} onChange={onChange} placeholder="workshop, js, free" />

        <div className="form-actions">
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
