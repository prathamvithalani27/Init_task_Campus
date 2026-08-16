# Fix for Issue VIII: Case-Sensitive Search

## 1. What was happening?
Users trying to find specific events using the search bar on the homepage would get no results if their capitalization did not exactly match the database. For example, searching for "hackathon" would fail to find an event titled "Hackathon".

## 2. Why was it happening?
In `frontend/src/pages/Home.jsx`, the filtering logic utilized the native JavaScript `String.prototype.includes()` method:
`const matchesSearch = event.title.includes(searchTerm);`
Because `includes()` evaluates strict character matching, an uppercase 'H' is evaluated as a completely different character than a lowercase 'h'.

## 3. Where was the problem actually fixed?
- **Frontend (`Home.jsx`):** The filtering logic was updated to normalize both strings to lowercase before comparison. The line was changed to:
`const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());`

## 4. What could happen in an edge case?
Without the fix, users might mistakenly believe an event is cancelled or doesn't exist simply because they typed on their mobile phone (which often auto-lowercases or auto-capitalizes the first letter). With the fix, the search is far more robust and user-friendly.

## 5. Does the fix introduce any new problems?
No functional problems are introduced. Calling `toLowerCase()` on every keystroke for an array of items does introduce a micro-optimization penalty, but for a standard array of a few hundred events, the performance impact in a modern browser is entirely imperceptible. 

## Reason for choosing the solution
Normalizing strings to lowercase (or uppercase) before comparison is the universally accepted standard for implementing basic case-insensitive text search in client-side applications. It requires no external libraries and works reliably across all browsers.
