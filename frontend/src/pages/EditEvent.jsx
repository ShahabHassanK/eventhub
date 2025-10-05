// src/pages/EditEvent.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditEvent() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/events/${id}`);
        const ev = res.data;
        setForm({
          title: ev.title || '',
          description: ev.description || '',
          location: ev.location || '',
          // convert ISO date to datetime-local input value
          date: ev.date ? new Date(ev.date).toISOString().slice(0, 16) : '',
          capacity: ev.capacity || 100,
          tags: (ev.tags || []).join(', '),
        });
      } catch (err) {
        alert('Could not load event: ' + err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!form) return <div>Event not found.</div>;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        description: form.description,
        location: form.location || 'Online',
        date: new Date(form.date).toISOString(),
        capacity: Number(form.capacity),
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      const res = await api.put(`/api/events/${id}`, payload);
      navigate(`/events/${res.data._id}`);
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  return (
    <div className="card">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Title</label>
        <input name="title" value={form.title} onChange={onChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={onChange} rows="5" />

        <label>Location</label>
        <input name="location" value={form.location} onChange={onChange} />

        <label>Date & Time</label>
        <input name="date" type="datetime-local" value={form.date} onChange={onChange} required />

        <label>Capacity</label>
        <input name="capacity" type="number" value={form.capacity} onChange={onChange} />

        <label>Tags (comma separated)</label>
        <input name="tags" value={form.tags} onChange={onChange} />

        <div className="form-actions">
          <button className="btn" type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}
