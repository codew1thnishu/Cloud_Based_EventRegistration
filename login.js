import {
    auth,
    signInWithEmailAndPassword
} from "./firebase.js";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const loginBtn = document.getElementById("loginBtn");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        loginMessage.textContent = "";
        loginBtn.disabled = true;
        loginBtn.textContent = "Logging in...";

        try {
            await signInWithEmailAndPassword(auth, email, password);
            loginMessage.className = "login-message success";
            loginMessage.textContent = "Login successful. Opening dashboard...";

            setTimeout(() => {
                window.location.href = "admin-dashboard.html";
            }, 500);
        } catch (error) {
            console.error("Login error:", error);

            loginMessage.className = "login-message error";

            const messages = {
                "auth/invalid-email": "Please enter a valid email address.",
                "auth/invalid-credential": "Invalid email or password.",
                "auth/user-not-found": "Admin account not found.",
                "auth/wrong-password": "Incorrect password.",
                "auth/too-many-requests": "Too many attempts. Please try again later.",
                "auth/api-key-not-valid": "Firebase API key is invalid. Copy a fresh Web App config from Firebase Console into firebase.js.",
                "auth/network-request-failed": "Network error. Check your internet connection."
            };

            loginMessage.textContent =
                messages[error.code] || `Login failed: ${error.message}`;

            loginBtn.disabled = false;
            loginBtn.textContent = "Login";
        }
    });
}
