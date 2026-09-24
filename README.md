# Cloud-Based Event Management System

## Run
1. Open the folder in VS Code.
2. Run it with Live Server.
3. Open `index.html`.
4. Use Event Register for participants.
5. Use Admin Login for the administrator.

## Firebase setup
The project uses Firebase Authentication and Cloud Firestore.

### Authentication
Enable:
Firebase Console -> Authentication -> Sign-in method -> Email/Password.

Create the admin account in:
Authentication -> Users.

### Firestore
Create a Firestore database and publish the included `firestore.rules`.

### Important API-key note
The supplied `firebase.js` contains the configuration currently shown in the project screenshots. If the browser still returns:

auth/api-key-not-valid

do not change the application code. Copy a fresh Web App config from:
Firebase Console -> Project settings -> Your apps -> Web app -> Config
and replace the `firebaseConfig` object in `firebase.js`.

The API key is not a password. Firebase web apps normally expose this identifier in client-side code; access control belongs in Authentication and Firestore Security Rules.
