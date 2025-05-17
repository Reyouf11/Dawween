# # Dawween | دوّن

This project combines a to-do list, calendar, and AI assistant to help you stay organized effortlessly.

Smart Reminders: Get notified in advance and receive AI-generated suggestions to tackle your tasks.  
Exam/Test Support: Automatically schedules study sessions and provides study tips or resources.  
Calendar Integration: Visualize deadlines and avoid last-minute stress.  
AI-Powered Ideas: Stuck on a task? Get quick, actionable steps to make progress.  


Perfect for students, professionals, and anyone who wants to work smarter, not harder.

The flowchart below shows the basic user flow and system components of Dawween:
- User signs in or creates an account
- Navigates to homepage with weekly calendar
- Adds tasks with details and priority
- Settings and contact pages available
- Backend manages data storage and user sessions


```mermaid
flowchart TD
A[Sign In Page] -->|Enter username & password| B{Has Account?}
B -- Yes --> C[Go to Homepage]
B -- No --> D[Create New Account Page]
D -->|Enter username, password, confirm password| E[Account Created]
E --> C

C --> F[Homepage]
F --> G[Left Sidebar Options]
G --> G1[Sign In]
G --> G2[Settings]
G --> G3[Contact Us]

F --> H[7 Day Boxes]
H --> I[Add Task Button]

I --> J[Popup: Enter Task Description]
J -->|OK| K[Popup: Enter Task Time]
J -->|Cancel| F

K -->|OK| L[Popup: Select Priority – High / Medium / Low]
K -->|Cancel| F

L -->|OK| M[Task Added to Day Box]
L -->|Cancel| F

F --> N[Settings Header - bottom middle]
N --> O[Pick Interface Color]
N --> P[Pick Text Size]
N --> Q[Set Reminder Time in Minutes]

G2 --> R[Settings Page]
R --> S[Input Username]
R --> T[لون السمة - Pick Color]
R --> U[Reminder Time Before Task]
R --> V[Save Settings]

G3 --> W[Contact Us Page]
W --> X[Input Email Address]
W


```
