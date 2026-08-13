# Campus Event Registration

A full-stack web application built for college students to discover and register for campus events.

## Features
- Browse available campus events
- Search for events by title
- Filter events by category
- View event details and remaining capacity
- Register for an event
- Admin dashboard to manage events and view registrations

## Installation
1. Clone the repository.
2. Ensure you have Node.js installed.

## How to run Backend
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   node server.js
   ```
   The backend will run on `http://localhost:5000`.

## How to run Frontend
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events` | List all events |
| GET | `/api/events/:id` | Get single event details |
| POST | `/api/events` | Create a new event |
| DELETE | `/api/events/:id` | Delete an event |
| GET | `/api/events/:id/registrations` | View registrations for an event |
| POST | `/api/events/:id/register` | Register for an event |
| DELETE | `/api/events/:id/register/:userId` | Cancel a registration |

## Project Structure
```
campus-event-registration/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── utils/
│   ├── data/
│   │   ├── events.json
│   │   ├── users.json
│   │   └── registrations.json
│   └── server.js
│
├── README.md
```
