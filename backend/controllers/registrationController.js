const { readData, writeData } = require('../utils/fileStorage');

exports.registerForEvent = async (req, res) => {
    const eventId = parseInt(req.params.id);
    const { userId, name, email } = req.body; 
    
    const events = readData('events.json');
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
        return res.status(404).json({ error: "Event not found" });
    }

    const event = events[eventIndex];

    if (event.registered >= event.capacity) {
        return res.status(200).json({ error: "Event is full" });
    }

    // Simulate async operation (e.g. fetching user data or slow I/O)
    await new Promise(resolve => setTimeout(resolve, 500));

    const registrations = readData('registrations.json');

    const newRegistration = {
        id: Date.now(),
        eventId: eventId,
        userId: parseInt(userId) || Math.floor(Math.random() * 1000) + 10,
        name: name || 'Unknown',
        email: email || 'No email provided',
        registeredAt: new Date().toISOString()
    };

    registrations.push(newRegistration);
    await writeData('registrations.json', registrations, res);

    // Update event registered count
    events[eventIndex].registered += 1;
    await writeData('events.json', events, res);

    res.status(201).json({ success: true, registration: newRegistration });
};

exports.cancelRegistration = async (req, res) => {
    const eventId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);
    const requestingUserId = parseInt(req.headers['x-user-id']);

    // Secure auth check: ensure requesting user matches the registration owner
    if (!requestingUserId || requestingUserId !== userId) {
        return res.status(403).json({ error: "Unauthorized to cancel this registration" });
    }

    let registrations = readData('registrations.json');
    const regIndex = registrations.findIndex(r => r.eventId === eventId && r.userId === userId);
    
    if (regIndex === -1) {
        return res.status(404).json({ error: "Registration not found" });
    }

    registrations.splice(regIndex, 1);
    await writeData('registrations.json', registrations, res);

    // Update event registered count
    const events = readData('events.json');
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
        events[eventIndex].registered -= 1;
        await writeData('events.json', events, res);
    }

    res.json({ success: true });
};
