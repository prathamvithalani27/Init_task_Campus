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

    res.json(registrations);
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
    await writeData('events.json', events, res);

    let registrations = readData('registrations.json');
    registrations = registrations.filter(r => r.eventId !== eventId);
    await writeData('registrations.json', registrations, res);

    res.json({ success: true });
};
