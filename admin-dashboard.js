import {
    db,
    auth,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    query,
    orderBy,
    onAuthStateChanged,
    signOut
} from "./firebase.js";

const eventForm = document.getElementById("eventForm");
const eventsList = document.getElementById("eventsList");
const registrationsTable = document.getElementById("registrationsTable");
const logoutBtn = document.getElementById("logoutBtn");
const dashboardMessage = document.getElementById("dashboardMessage");

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function showMessage(message, type = "info") {
    if (!dashboardMessage) return;
    dashboardMessage.textContent = message;
    dashboardMessage.className = `dashboard-message ${type}`;
}

async function loadEvents() {
    if (!eventsList) return;

    eventsList.innerHTML = `<p class="loading">Loading events...</p>`;

    try {
        const q = query(collection(db, "events"), orderBy("date"));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            eventsList.innerHTML = `<p>No events have been added yet.</p>`;
            return;
        }

        eventsList.innerHTML = "";

        snapshot.forEach((snap) => {
            const data = snap.data();
            const card = document.createElement("article");
            card.className = "admin-event";

            card.innerHTML = `
                <div class="event-card-content">
                    <h3>${escapeHtml(data.name)}</h3>
                    <p>${escapeHtml(data.description)}</p>
                    <p><strong>Date:</strong> ${escapeHtml(data.date)}</p>
                    <p><strong>Time:</strong> ${escapeHtml(data.time)}</p>
                    <p><strong>Venue:</strong> ${escapeHtml(data.venue)}</p>
                    <p><strong>Seats:</strong> ${escapeHtml(data.seats)}</p>
                </div>
                <div class="event-actions">
                    <button class="secondary-btn edit-event-btn" data-id="${snap.id}">Edit</button>
                    <button class="danger-btn delete-event-btn" data-id="${snap.id}">Delete</button>
                </div>
            `;

            eventsList.appendChild(card);
        });

        document.querySelectorAll(".delete-event-btn").forEach((button) => {
            button.addEventListener("click", async () => {
                if (!confirm("Delete this event?")) return;

                try {
                    await deleteDoc(doc(db, "events", button.dataset.id));
                    showMessage("Event deleted successfully.", "success");
                    await loadEvents();
                } catch (error) {
                    console.error(error);
                    showMessage(`Could not delete event: ${error.message}`, "error");
                }
            });
        });

        document.querySelectorAll(".edit-event-btn").forEach((button) => {
            button.addEventListener("click", async () => {
                const id = button.dataset.id;
                const current = [...snapshot.docs].find((item) => item.id === id);
                if (!current) return;

                const data = current.data();

                const name = prompt("Event name:", data.name ?? "");
                if (name === null) return;

                const description = prompt("Description:", data.description ?? "");
                if (description === null) return;

                const date = prompt("Date (YYYY-MM-DD):", data.date ?? "");
                if (date === null) return;

                const time = prompt("Time:", data.time ?? "");
                if (time === null) return;

                const venue = prompt("Venue:", data.venue ?? "");
                if (venue === null) return;

                const seats = prompt("Available seats:", data.seats ?? "");
                if (seats === null) return;

                try {
                    await updateDoc(doc(db, "events", id), {
                        name: name.trim(),
                        description: description.trim(),
                        date,
                        time,
                        venue: venue.trim(),
                        seats: Number(seats)
                    });

                    showMessage("Event updated successfully.", "success");
                    await loadEvents();
                } catch (error) {
                    console.error(error);
                    showMessage(`Could not update event: ${error.message}`, "error");
                }
            });
        });
    } catch (error) {
        console.error("Error loading events:", error);
        eventsList.innerHTML = `<p class="error-text">Unable to load events: ${escapeHtml(error.message)}</p>`;
    }
}

async function loadRegistrations() {
    if (!registrationsTable) return;

    registrationsTable.innerHTML = `
        <tr><td colspan="5">Loading registrations...</td></tr>
    `;

    try {
        const snapshot = await getDocs(collection(db, "registrations"));

        if (snapshot.empty) {
            registrationsTable.innerHTML = `
                <tr><td colspan="5">No registrations found.</td></tr>
            `;
            return;
        }

        registrationsTable.innerHTML = "";

        snapshot.forEach((snap) => {
            const data = snap.data();
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHtml(data.fullName)}</td>
                <td>${escapeHtml(data.email)}</td>
                <td>${escapeHtml(data.phone)}</td>
                <td>${escapeHtml(data.college)}</td>
                <td>${escapeHtml(data.selectedEvent || "Not specified")}</td>
            `;

            registrationsTable.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading registrations:", error);
        registrationsTable.innerHTML = `
            <tr><td colspan="5" class="error-text">Unable to load registrations: ${escapeHtml(error.message)}</td></tr>
        `;
    }
}

if (eventForm) {
    eventForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const button = document.getElementById("addEventBtn");
        button.disabled = true;
        button.textContent = "Adding Event...";

        try {
            await addDoc(collection(db, "events"), {
                name: document.getElementById("eventName").value.trim(),
                description: document.getElementById("eventDescription").value.trim(),
                date: document.getElementById("eventDate").value,
                time: document.getElementById("eventTime").value,
                venue: document.getElementById("eventVenue").value.trim(),
                seats: Number(document.getElementById("eventSeats").value),
                createdAt: new Date()
            });

            eventForm.reset();
            showMessage("Event added successfully.", "success");
            await loadEvents();
        } catch (error) {
            console.error("Error adding event:", error);
            showMessage(`Could not add event: ${error.message}`, "error");
        } finally {
            button.disabled = false;
            button.textContent = "Add Event";
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.href = "login.html";
        } catch (error) {
            console.error(error);
            showMessage(`Logout failed: ${error.message}`, "error");
        }
    });
}

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    await Promise.all([loadEvents(), loadRegistrations()]);
});
