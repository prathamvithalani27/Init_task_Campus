import { Link } from 'react-router-dom';

function EventCard({ event }) {
  const isFull = event.registered >= event.capacity;
  const availableSeats = event.capacity - event.registered;

  return (
    <div className="event-card">
      <div className="event-category">{event.category}</div>
      <h3 className="event-title">{event.title}</h3>
      <div className="event-date-time">
        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
        <span>⏰ {event.time}</span>
      </div>
      <div className="event-capacity">
        <span className={`capacity-badge ${isFull ? 'capacity-full' : ''}`}>
          {isFull ? 'Full Capacity' : `${availableSeats} seats left`}
        </span>
        <Link to={`/events/${event.id}`}>
          <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
