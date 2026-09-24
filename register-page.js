import {
    db,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy
} from "./firebase.js";

const publicEvents = document.getElementById("publicEvents");
const selectedEvent = document.getElementById("selectedEvent");
const registrationForm = document.getElementById("registrationForm");
const registrationMessage = document.getElementById("registrationMessage");
const registerBtn = document.getElementById("registerBtn");

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function loadPublicEvents() {
    try {
        const q = query(collection(db, "events"), orderBy("date"));
        const snapshot = await getDocs(q);

        publicEvents.innerHTML = "";
        selectedEvent.innerHTML = `<option value="">Select an event</option>`;

        if (snapshot.empty) {
            publicEvents.innerHTML = `<p>No events are currently available.</p>`;
            return;
        }

        snapshot.forEach((snap) => {
            const data = snap.data();

            const option = document.createElement("option");
            option.value = data.name;
            option.textContent = data.name;
            selectedEvent.appendChild(option);

            const card = document.createElement("article");
            card.className = "event-card";
            card.innerHTML = `
                <h3>${escapeHtml(data.name)}</h3>
                <p>${escapeHtml(data.description)}</p>
                <p><strong>Date:</strong> ${escapeHtml(data.date)}</p>
                <p><strong>Time:</strong> ${escapeHtml(data.time)}</p>
                <p><strong>Venue:</strong> ${escapeHtml(data.venue)}</p>
                <p><strong>Available Seats:</strong> ${escapeHtml(data.seats)}</p>
                <button class="primary-btn select-event" data-name="${escapeHtml(data.name)}">
                    Select Event
                </button>
            `;

            publicEvents.appendChild(card);
        });

        document.querySelectorAll(".select-event").forEach((button) => {
            button.addEventListener("click", () => {
                selectedEvent.value = button.dataset.name;
                selectedEvent.scrollIntoView({ behavior: "smooth", block: "center" });
            });
        });
    } catch (error) {
        console.error("Error loading public events:", error);
        publicEvents.innerHTML = `<p class="error-text">Unable to load events: ${escapeHtml(error.message)}</p>`;
    }
}

registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!selectedEvent.value) {
        registrationMessage.className = "dashboard-message error";
        registrationMessage.textContent = "Please select an event.";
        return;
    }

    registerBtn.disabled = true;
    registerBtn.textContent = "Registering...";

    try {
        await addDoc(collection(db, "registrations"), {
            fullName: document.getElementById("fullName").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            college: document.getElementById("college").value.trim(),
            selectedEvent: selectedEvent.value,
            time: new Date()
        });

        registrationMessage.className = "dashboard-message success";
        registrationMessage.textContent = "Registration successful!";
        registrationForm.reset();
    } catch (error) {
        console.error("Registration error:", error);
        registrationMessage.className = "dashboard-message error";
        registrationMessage.textContent = `Registration failed: ${error.message}`;
    } finally {
        registerBtn.disabled = false;
        registerBtn.textContent = "Register";
    }
});

loadPublicEvents();
