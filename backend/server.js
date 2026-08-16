require('dotenv').config();
const express = require('express');
const cors = require('cors');
const eventController = require('./controllers/eventController');
const registrationController = require('./controllers/registrationController');
const authController = require('./controllers/authController');
const requireAdmin = require('./middleware/requireAdmin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Event Routes
app.get('/api/events', eventController.getAllEvents);
app.get('/api/events/:id', eventController.getEventById);
app.post('/api/events', requireAdmin, eventController.createEvent);
app.post('/api/admin/login', authController.login);
app.delete('/api/events/:id', requireAdmin, eventController.deleteEvent);

// Admin verify route
app.get('/api/admin/verify', requireAdmin, (req, res) => res.json({ valid: true }));

// Registration Routes
app.get('/api/events/:id/registrations', requireAdmin, eventController.getEventRegistrations);
app.post('/api/events/:id/register', registrationController.registerForEvent);
app.delete('/api/events/:id/register/:userId', registrationController.cancelRegistration);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
