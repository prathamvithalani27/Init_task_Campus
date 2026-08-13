import { useState, useEffect } from 'react';
import { fetchEvents, fetchEventRegistrations, createEvent, deleteEvent } from '../services/api';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState('');
  const [regError, setRegError] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events.');
    }
  };

  const handleViewRegistrations = async (eventId) => {
    setSelectedEventId(eventId);
    setRegError('');
    try {
      const data = await fetchEventRegistrations(eventId);
      
      // INTENTIONAL BUG 3: FRONTEND/BACKEND RESPONSE MISMATCH
      // Backend returns { data: [...] } but frontend expects an array directly.
      // We are trying to use .length and .map() on data which is an object.
      // This will throw a TypeError or render nothing, forcing the student to debug.
      setRegistrations(data);
      
    } catch (err) {
      setRegError('Failed to load registrations. Check console for details.');
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        loadEvents();
        if (selectedEventId === id) {
          setSelectedEventId(null);
          setRegistrations([]);
        }
      } catch (err) {
        alert('Failed to delete event');
      }
    }
  };

  return (
    <div>
      <h1 className="page-title">Admin Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}
      
      <div className="event-details-container" style={{maxWidth: '100%', marginBottom: '2rem'}}>
        <h2>Manage Events</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Date</th>
              <th>Registered</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{event.id}</td>
                <td>{event.title}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.registered}</td>
                <td>{event.capacity}</td>
                <td>
                  <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button className="btn btn-primary" style={{padding: '0.25rem 0.5rem'}} onClick={() => handleViewRegistrations(event.id)}>
                      View Regs
                    </button>
                    <button className="btn btn-danger" style={{padding: '0.25rem 0.5rem'}} onClick={() => handleDeleteEvent(event.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedEventId && (
        <div className="event-details-container" style={{maxWidth: '100%'}}>
          <h2>Registrations for Event #{selectedEventId}</h2>
          {regError && <div className="alert alert-error">{regError}</div>}
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>Registration ID</th>
                <th>User ID</th>
                <th>Registration Time</th>
              </tr>
            </thead>
            <tbody>
              {/* INTENTIONAL BUG 3 EXPOSED HERE: registrations is { data: [...] }, not an array */}
              {/* This map will throw an error and crash the component if registrations isn't an array */}
              {registrations.length > 0 ? registrations.map(reg => (
                <tr key={reg.id}>
                  <td>{reg.id}</td>
                  <td>{reg.userId}</td>
                  <td>{new Date(reg.registeredAt).toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3">No registrations found or data format error.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
