const { readData, writeData } = require('../utils/fileStorage');

exports.getAllEvents = (req, res) => {
    const events = readData('events.json');
    res.json(events); // This works fine for the frontend
};

exports.getEventById = (req, res) => {
    const events = readData('events.json');
    const event = events.find(e => e.id === parseInt(req.params.id));
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
};

exports.getEventRegistrations = (req, res) => {
    const eventId = parseInt(req.params.id);
    const registrations = readData('registrations.json').filter(r => r.eventId === eventId);
    
    // INTENTIONAL BUG 3: FRONTEND/BACKEND RESPONSE MISMATCH
    // Returning { data: registrations } instead of just registrations array
    // This will break the Admin dashboard that expects an array directly
    res.json({ data: registrations });
};

exports.createEvent = async (req, res) => {
    const events = readData('events.json');
    const newEvent = {
        id: Date.now(),
        ...req.body,
        registered: 0
    };
    events.push(newEvent);
    await writeData('events.json', events, res);
    res.status(201).json(newEvent);
};

exports.deleteEvent = async (req, res) => {
    const eventId = parseInt(req.params.id);
    let events = readData('events.json');
    
    events = events.filter(e => e.id !== eventId);
    
    // INTENTIONAL BUG 8: JSON DATA CONSISTENCY ISSUE
    // We are deleting the event but NOT deleting associated registrations from registrations.json
    
    await writeData('events.json', events, res);
    res.json({ success: true });
};
