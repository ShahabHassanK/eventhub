// src/pages/Events.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import AuthContext from "../contexts/AuthContext";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/events");
        setEvents(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.del(`/api/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const canEditOrDelete = (ev) => {
    if (!user) return false;
    if (user.role === "admin") return true; // admin can delete anything
    if (user.role === "organizer" && ev.organizer && user.id === ev.organizer._id) {
      return true; // organizer can edit/delete their own
    }
    return false;
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="events-page">
      <h2>All Events</h2>
      <div className="events-grid">
        {events.length === 0 && <div>No events yet.</div>}
        {events.map((ev) => (
          <div key={ev._id} className="card event-card">
            <h3>
              <Link to={`/events/${ev._id}`}>{ev.title}</Link>
            </h3>
            <div className="meta">
              <div>{new Date(ev.date).toLocaleString()}</div>
              <div>{ev.location}</div>
            </div>
            <p className="muted">
              {ev.description?.slice(0, 120)}
              {ev.description?.length > 120 ? "…" : ""}
            </p>
            <div className="tags">
              {(ev.tags || []).map((t, i) => (
                <span key={i} className="tag">
                  {t}
                </span>
              ))}
            </div>

            <div className="card-actions">
              <Link to={`/events/${ev._id}`} className="btn btn-sm">
                View
              </Link>

              {canEditOrDelete(ev) && (
                <>
                  <Link
                    to={`/events/${ev._id}/edit`}
                    className="btn btn-sm btn-outline"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm danger"
                    onClick={() => handleDelete(ev._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
