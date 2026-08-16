# Fix for Issue IV: Incorrect API Error Status

## 1. What was happening?
When a user attempted to register for an event that was already completely full, the backend correctly refused to register them but responded with a `200 OK` HTTP status code.

## 2. Why was it happening?
In `registrationController.js`, the validation block for capacity explicitly returned `res.status(200).json({ error: "Event is full" });`. The `200` status code stands for a successful HTTP request, which semantically contradicts the error message inside the payload. 

## 3. Where was the problem actually fixed?
- **Backend (`registrationController.js`):** The `res.status(200)` was changed to `res.status(400)`. `400 Bad Request` accurately signifies that the client's request cannot be processed due to a business logic constraint (the event being at maximum capacity).

## 4. What could happen in an edge case?
Modern frontend interceptors and `fetch` wrappers often use the `response.ok` property (which evaluates to true for 200-299 statuses) to automatically determine if an operation succeeded. Returning a `200` for an error could trick the frontend into displaying a success message, even though the backend rejected the registration. With a `400` status, standard frontend error handling will naturally catch and display the error without needing manual string inspection.

## 5. Does the fix introduce any new problems?
No. The existing frontend code in `EventDetails.jsx` explicitly checks if `response.error` exists in the parsed JSON rather than throwing on non-200 responses, so this API standardization does not break the current frontend implementation.

## Reason for choosing the solution
Sticking to standard RESTful HTTP status codes (`4xx` for client errors, `2xx` for successes) is an absolute necessity for building predictable APIs that can be easily integrated with frontend frameworks, monitoring tools, and third-party services.
