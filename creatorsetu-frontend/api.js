const API_BASE_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://YOUR-BACKEND-URL.com";

async function apiFetch(endpoint, options = {}) {
    return fetch(`${API_BASE_URL}${endpoint}`, options);
}