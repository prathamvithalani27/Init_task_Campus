import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { fetchEvents } from '../services/api';

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(events.map(e => e.category))];

  if (loading) return <div className="page-title" style={{marginTop: '2rem'}}>Loading events...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <h1 className="page-title">Discover Campus Events</h1>
      
      <div className="controls-container">
        <input 
          type="text" 
          className="search-input"
          placeholder="Search events..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          className="search-input" 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{width: 'auto'}}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filteredEvents.length === 0 ? (
        <div style={{textAlign: 'center', color: 'var(--text-secondary)', marginTop: '3rem'}}>
          <h2>No events found matching your criteria.</h2>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
