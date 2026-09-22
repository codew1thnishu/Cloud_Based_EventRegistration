# Cloud_Based_Event_Registration
# Cloud-Based Event Management System

A web-based Cloud-Based Event Management System developed as a Cloud Computing Tiny Project. The system allows participants to view available events and register online, while administrators can securely log in and manage events and participant registrations using Firebase.

## Project Overview

The Cloud-Based Event Management System provides a simple and centralized platform for managing events online.

The system has two main users:

- Participants – View events and register for events.
- Administrators – Log in securely and manage events and participant registrations.

The project uses Firebase Authentication for administrator login and Cloud Firestore for cloud-based storage of events and registrations.

## Features

### Participant Features

- View available events.
- View event details dynamically from Firestore.
- View event name, description, date, time, venue, and available seats.
- Select an event for registration.
- Enter participant details.
- Submit registration online.
- Store registration information in Firebase Firestore.

### Administrator Features

- Secure administrator login.
- Firebase Email/Password authentication.
- Admin dashboard.
- Add new events.
- Edit existing events.
- Delete events.
- View participant registrations.
- Logout.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive user interface |
| JavaScript | Application logic and interactivity |
| Firebase Authentication | Administrator authentication |
| Firebase Firestore | Cloud database |
| Firebase Web SDK | Firebase integration |
| Visual Studio Code | Development environment |
| Live Server | Local testing |
| Git | Version control |
| GitHub | Source code hosting |

## Project Structure

```text
Cloud-Based-Event-Management-System/
│
├── index.html
├── event-register.html
├── about.html
├── contact.html
├── login.html
├── admin-dashboard.html
│
├── firebase.js
├── login.js
├── admin-dashboard.js
├── register-page.js
├── script.js
│
├── style.css
├── README.md
│
├── images/
│
└── backup/