# Fix for Issue III: Duplicate Registration

## 1. What was happening?
A single user was able to register for the exact same event multiple times, taking up multiple seats and causing duplicate data entries.

## 2. Why was it happening?
In `registrationController.js` inside the `registerForEvent` function, there was absolutely no validation step checking whether the incoming `userId` already had an active registration record for the specified `eventId` inside `registrations.json`. The endpoint simply appended a new record regardless of past registrations.

## 3. Where was the problem actually fixed?
- **Backend (`registrationController.js`):** A validation check was introduced immediately after reading `registrations.json`. The system now evaluates `registrations.some(r => r.eventId === eventId && r.userId === finalUserId)`. If true, the system returns a `400 Bad Request` with an appropriate error message.

## 4. What could happen in an edge case?
Without the fix, an aggressive double-click on the frontend "Register" button could result in two duplicate registrations. With this backend enforcement in place, even if the frontend glitches and fires two identical requests simultaneously, the second one will hit the duplicate validation and be blocked (especially now that we also fixed the asynchronous concurrency delay in Step 2).

## 5. Does the fix introduce any new problems?
No functional problems are introduced. It prevents malicious or accidental multiple seat occupation by the same simulated user account.

## Reason for choosing the solution
Enforcing unique constraints on the backend ensures that data integrity is maintained even if the frontend fails to properly disable the submit button, or if an attacker tries to hit the API endpoint directly using tools like Postman.
