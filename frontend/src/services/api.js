import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

export const fetchEvents = async () => {
    const res = await fetch(`${API_URL}/events`);
    return res.json();
};

export const fetchEventById = async (id) => {
    const res = await fetch(`${API_URL}/events/${id}`);
    if (!res.ok) throw new Error('Event not found');
    return res.json();
};

export const registerForEvent = async (id, userData) => {
    const res = await fetch(`${API_URL}/events/${id}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    return res.json();
};

export const fetchEventRegistrations = async (id) => {
    const res = await fetch(`${API_URL}/events/${id}/registrations`);
    return res.json();
};

export const createEvent = async (eventData) => {
    const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    });
    return res.json();
};

export const deleteEvent = async (id) => {
    const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE'
    });
    return res.json();
};
