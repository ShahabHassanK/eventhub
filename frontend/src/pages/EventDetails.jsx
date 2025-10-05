// src/pages/EventDetails.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import AuthContext from '../contexts/AuthContext';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        alert('Could not load event: ' + err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.del(`/api/events/${id}`);
      navigate('/events');
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="card">
      <div className="card-header">
        <h2>{event.title}</h2>
        <div className="meta">
          <div>{new Date(event.date).toLocaleString()}</div>
          <div>{event.location}</div>
          <div>Capacity: {event.capacity}</div>
        </div>
      </div>
      <div className="card-body">
        <p>{event.description || 'No description provided.'}</p>
        <div className="tags">{(event.tags || []).map((t, i) => <span key={i} className="tag">{t}</span>)}</div>

        <div className="organizer">
          <h4>Organizer</h4>
          <div>{event.organizer?.name} &lt;{event.organizer?.email}&gt;</div>
        </div>

        <div className="card-actions">
          <Link to="/events" className="btn btn-outline">Back</Link>
          {user && event.organizer && user.id === event.organizer._id && (
            <>
              <Link to={`/events/${event._id}/edit`} className="btn">Edit</Link>
              <button className="btn danger" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
