import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEventById, registerForEvent } from '../services/api';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userId: Math.floor(Math.random() * 1000) + 10 // Simulating logged-in user
  });

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err) {
        setError('Event not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await registerForEvent(id, formData);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Successfully registered for the event!');
        
        // INTENTIONAL BUG 6: STALE FRONTEND STATE
        // The event capacity is not updated in the local state.
        // User has to refresh the page to see the new seat count.
        
        // The user ID should conceptually change or prevent duplicate registration,
        // but because of BUG 1 on backend, we could technically submit again.
      }
    } catch (err) {
      setError('An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="page-title" style={{marginTop: '2rem'}}>Loading details...</div>;
  if (!event) return <div className="alert alert-error">{error}</div>;

  const isFull = event.registered >= event.capacity;
  const availableSeats = event.capacity - event.registered;

  return (
    <div className="event-details-container">
      <div className="details-header">
        <div className="event-category" style={{fontSize: '1rem'}}>{event.category}</div>
        <h1 style={{fontSize: '2.5rem', marginBottom: '1rem'}}>{event.title}</h1>
        <p style={{fontSize: '1.2rem', color: 'var(--text-secondary)'}}>{event.description}</p>
      </div>

      <div className="details-meta">
        <div className="meta-item">
          <span style={{fontSize: '1.5rem'}}>📅</span>
          <span><strong>Date:</strong> {new Date(event.date).toLocaleDateString()} at {event.time}</span>
        </div>
        <div className="meta-item">
          <span style={{fontSize: '1.5rem'}}>📍</span>
          <span><strong>Venue:</strong> {event.venue}</span>
        </div>
        <div className="meta-item">
          <span style={{fontSize: '1.5rem'}}>🎟️</span>
          <span><strong>Availability:</strong> {availableSeats} / {event.capacity} seats left</span>
        </div>
      </div>

      <div className="registration-section">
        <h2>Registration Form</h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Student Email</label>
            <input 
              type="email" 
              className="form-input" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isSubmitting || (isFull && !success)} // If success is true, wait, we shouldn't allow if full. But if full because of stale state, the backend handles it.
            style={{width: '100%', marginTop: '1rem'}}
          >
            {isSubmitting ? 'Processing...' : (isFull ? 'Event Full' : 'Register Now')}
          </button>
        </form>
      </div>
      
      <button 
        className="btn" 
        style={{marginTop: '2rem', background: 'transparent', border: '1px solid var(--card-border)', color: 'white'}}
        onClick={() => navigate(-1)}
      >
        ← Back to Events
      </button>
    </div>
  );
}

export default EventDetails;
