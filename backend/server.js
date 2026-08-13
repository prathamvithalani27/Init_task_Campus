const express = require('express');
const cors = require('cors');
const eventController = require('./controllers/eventController');
const registrationController = require('./controllers/registrationController');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Event Routes
app.get('/api/events', eventController.getAllEvents);
app.get('/api/events/:id', eventController.getEventById);
app.post('/api/events', eventController.createEvent);
app.delete('/api/events/:id', eventController.deleteEvent);

// Registration Routes
app.get('/api/events/:id/registrations', eventController.getEventRegistrations);
app.post('/api/events/:id/register', registrationController.registerForEvent);
app.delete('/api/events/:id/register/:userId', registrationController.cancelRegistration);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
