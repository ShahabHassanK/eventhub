// src/pages/MyEvents.jsx
import React, { useEffect, useState, useContext } from 'react';
import { api } from '../api';
import AuthContext from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function MyEvents() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await api.get('/api/events');
        const mine = (res.data || []).filter(
          (ev) => ev.organizer && String(ev.organizer._id) === String(user.id)
        );
        setEvents(mine);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.del(`/api/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert('Delete failed: ' + (err.message || err.data?.error));
    }
  };

  if (!user) return <div>Please login to see your events.</div>;
  if (loading) return <div>Loading...</div>;
  if (events.length === 0) return <div className="card">You have not created any events yet.</div>;

  return (
    <div>
      <h2>My Events</h2>
      <div className="events-grid">
        {events.map((ev) => (
          <div key={ev._id} className="card event-card">
            <h3><Link to={`/events/${ev._id}`}>{ev.title}</Link></h3>
            <div className="meta">{new Date(ev.date).toLocaleString()} • {ev.location}</div>
            <p className="muted">{ev.description?.slice(0,120)}{ev.description?.length>120 ? '…' : ''}</p>
            <div className="card-actions">
              <Link to={`/events/${ev._id}/edit`} className="btn btn-sm">Edit</Link>
              <button className="btn btn-sm danger" onClick={() => handleDelete(ev._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
