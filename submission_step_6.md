# Fix for Issue VI: Stale Frontend Data

## 1. What was happening?
When a user successfully registered for an event on the frontend, the success message would appear, but the "Availability" counter (e.g., "5 / 50 seats left") would not decrement. The user had to manually refresh their browser to see the updated capacity.

## 2. Why was it happening?
In `frontend/src/pages/EventDetails.jsx`, the `handleSubmit` function awaited the API response for the registration. Upon a successful response, it correctly set the `success` state message, but it completely neglected to update the `event` state object that holds the `registered` count. Because React only re-renders when state changes, the UI continued to display the old, stale data that was originally fetched on page load.

## 3. Where was the problem actually fixed?
- **Frontend (`EventDetails.jsx`):** Inside the `handleSubmit` success block, a state update was added: `setEvent(prev => ({ ...prev, registered: prev.registered + 1 }));`. This explicitly tells React that the event's registration count has increased, instantly triggering a re-render of the availability counters without needing a network refetch.

## 4. What could happen in an edge case?
If multiple users are registering simultaneously, a local state increment might slowly drift from the absolute true backend value until the next hard refresh. However, for immediate user feedback on their own action, an optimistic local update is the standard best practice. Refetching the entire event object from the server on every submission could cause unnecessary network load and visual flickering.

## 5. Does the fix introduce any new problems?
No, it solely improves the user experience by providing immediate, accurate visual feedback. 

## Reason for choosing the solution
React is designed around state-driven UI. By leveraging the functional state updater `setEvent(prev => ...)`, we guarantee we are modifying the most recent version of the local state without executing redundant API calls, keeping the application fast and responsive.
