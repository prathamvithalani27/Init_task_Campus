const { readData, writeData } = require('../utils/fileStorage');

exports.registerForEvent = async (req, res) => {
    const eventId = parseInt(req.params.id);
    // INTENTIONAL BUG 5: VALIDATION WEAKNESS
    // No backend validation for required fields in req.body (e.g., userId, name, email)
    const { userId } = req.body; 
    
    const events = readData('events.json');
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
        return res.status(404).json({ error: "Event not found" });
    }

    const event = events[eventIndex];

    // INTENTIONAL BUG 2: EVENT CAPACITY BUG (Race Condition)
    // We check capacity, then simulate a slight delay, then write.
    if (event.registered >= event.capacity) {
        // INTENTIONAL BUG 4: INCORRECT HTTP STATUS CODE
        // Returning 200 instead of 400 or 409 for a full event error
        return res.status(200).json({ error: "Event is full" });
    }

    // Simulate async operation (e.g. fetching user data or slow I/O)
    await new Promise(resolve => setTimeout(resolve, 500));

    const registrations = readData('registrations.json');
    
    // INTENTIONAL BUG 1: DUPLICATE REGISTRATION
    // We do NOT check if the user is already registered for this event.
    // The frontend disables the button, but direct API calls will succeed.

    const newRegistration = {
        id: Date.now(),
        eventId: eventId,
        userId: parseInt(userId) || Math.floor(Math.random() * 1000) + 10,
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
    // INTENTIONAL BUG 7: AUTHORIZATION / IDOR-LIKE ISSUE
    // We trust the userId from the URL to cancel a registration, without verifying if the caller is that user.
    const userId = parseInt(req.params.userId);

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
