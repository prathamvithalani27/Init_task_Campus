# Fix for Issue VII: Orphaned Data

## 1. What was happening?
When an admin deleted an event from the Admin Dashboard, the event itself was successfully removed, but all user registrations associated with that event remained indefinitely in the database. 

## 2. Why was it happening?
In `eventController.js`, the `deleteEvent` function only filtered the `events.json` file. It made absolutely no attempt to cascade the delete operation to the `registrations.json` file. Because there is no relational database manager (like SQL `ON DELETE CASCADE`) to automatically handle this, the flat-file system required manual cleanup logic which was completely missing.

## 3. Where was the problem actually fixed?
- **Backend (`eventController.js`):** Inside the `deleteEvent` function, new logic was appended after deleting the event. The backend now also reads `registrations.json`, filters out any registrations where `r.eventId === eventId`, and writes the cleaned array back to disk.

## 4. What could happen in an edge case?
Without the fix, orphaned data leads to permanent storage bloat (a memory leak of sorts on disk). More critically, if an admin later created a *new* event that coincidentally generated the same `Date.now()` ID (extremely unlikely but technically possible), the new event would inherit all the ghost registrations from the old deleted event, instantly filling up its capacity.

## 5. Does the fix introduce any new problems?
It adds a second synchronous file read and a second asynchronous file write to the endpoint, which slightly increases the execution time of the delete request. However, since deletions are admin-only actions and relatively infrequent, this overhead is negligible.

## Reason for choosing the solution
In a flat-file database system lacking foreign-key constraints, the application layer is solely responsible for maintaining referential integrity. Explicitly removing child records when a parent record is deleted is the standard way to prevent orphaned data in NoSQL/JSON-based systems.
