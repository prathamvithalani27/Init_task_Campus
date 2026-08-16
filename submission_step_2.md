# Fix for Issue II: Event Capacity / Concurrent Registration Issue

## 1. What was happening?
The system allowed more users to register for an event than its maximum capacity limit. During high-traffic testing, the number of registrations routinely exceeded the total available seats.

## 2. Why was it happening?
In `registrationController.js` inside the `registerForEvent` function, there was an artificial, intentional asynchronous delay (`await new Promise(resolve => setTimeout(resolve, 500));`) placed directly between validating the capacity and actually saving the registration to the file system. In a concurrent environment, multiple incoming requests would all pass the `event.registered >= event.capacity` check simultaneously before any of the requests had time to increment the registered count.

## 3. Where was the problem actually fixed?
- **Backend (`registrationController.js`):** The intentional `setTimeout` block was completely removed from the `registerForEvent` function, ensuring the operations between checking capacity and modifying the backend storage do not arbitrarily yield the event loop.

## 4. What could happen in an edge case?
Without the fix, the edge case is exactly what caused the bug: two users clicking "Register" at the exact same millisecond for the final remaining seat. With the fix, because Node.js executes synchronously up to the file-write, the first request will increment the capacity counter, and the second request will immediately hit the `Event is full` validation block. 

## 5. Does the fix introduce any new problems?
It slightly reduces the artificial latency of the API (which was only placed there to simulate slow I/O or network delays), effectively speeding up the registration endpoint. It introduces no actual functional problems.

## Reason for choosing the solution
In a simple file-based JSON storage implementation within a single-threaded Node.js application, preventing arbitrary asynchronous yielding between a read-check-write block is the most direct and idiomatic way to ensure atomicity without introducing complex external mutual-exclusion locks (mutexes).
