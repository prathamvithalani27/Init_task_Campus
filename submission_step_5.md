# Fix for Issue V: Missing Input Validation

## 1. What was happening?
The backend was blindly accepting registration payloads from the frontend without verifying if the required user information (Name and Email) was actually provided. It would insert empty strings or default placeholder values.

## 2. Why was it happening?
In `registrationController.js`, the `registerForEvent` endpoint lacked any mandatory input validation checks at the beginning of the function execution. It destructured the payload but proceeded with the operation even if `name` or `email` were undefined or empty.

## 3. Where was the problem actually fixed?
- **Backend (`registrationController.js`):** A strict validation block was placed immediately after extracting the variables from `req.body`. The server checks `if (!name || !name.trim() || !email || !email.trim())`. If the check fails, it immediately aborts the process and returns a `400 Bad Request` with an appropriate error message. We also cleaned up the fallback values since we now guarantee the data exists.

## 4. What could happen in an edge case?
A user trying to bypass the frontend form by directly pinging the API via a curl request with an empty JSON body could have polluted the `registrations.json` database with null values. With this backend validation, such payloads are safely blocked, ensuring structural integrity of the data.

## 5. Does the fix introduce any new problems?
No new problems are introduced. The frontend currently uses HTML5 `required` attributes on its form inputs, meaning legitimate browser-based users will never hit this backend error anyway.

## Reason for choosing the solution
Server-side validation is a non-negotiable security practice. Regardless of frontend validation, the backend must independently verify that incoming payloads conform to the expected data schema before interacting with the database.
