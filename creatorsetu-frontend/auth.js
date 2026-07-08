console.log("auth.js loaded");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getDatabase,
  ref,
  get,
  set,
  update
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";



import { auth, db } from "./firebase-config.js";
const provider = new GoogleAuthProvider();

const loginForm = document.querySelector('[data-form="login"]');
const signupForm = document.querySelector('[data-form="signup"]');
const dashboard = document.querySelector("[data-dashboard]");
const authPanel = document.querySelector(".auth-panel");
const authVisual = document.querySelector(".auth-visual");
const welcomeName = document.querySelector("[data-welcome-name]");
const profileInitials = document.querySelector("[data-profile-initials]");


function showDashboard(user) {
  dashboard.hidden = false;
  authPanel.style.display = "none";
  authVisual.style.display = "none";

  const displayName = user.displayName || user.email.split("@")[0];

  welcomeName.textContent = displayName;
  profileInitials.textContent = displayName.slice(0, 2).toUpperCase();
    // NEW
  if (window.loadDashboard) window.loadDashboard();
  if (window.loadChart) window.loadChart();
}

function showAuth() {
  dashboard.hidden = true;
  authPanel.style.display = "";
  authVisual.style.display = "";
  function showAuth() {
  dashboard.hidden = true;

  authPanel.style.display = "block";
  authVisual.style.display = "block";
}
}

onAuthStateChanged(auth, async (user) => {

    document.body.style.visibility = "visible";

    if (user) {
        showDashboard(user);

        // Load user data in the background
        const snapshot = await get(ref(db, "users/" + user.uid));

         if (user) {
        showDashboard(user);
        }

    } else {
        showAuth();
    }
});

// LOGIN
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm.querySelector('input[name="loginEmail"]').value.trim();
  const password = loginForm.querySelector('input[name="loginPassword"]').value;

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful");
  } catch (error) {
    if (error.code === "auth/invalid-credential") {
      alert("Incorrect email or password.");
    } else {
      alert(error.message);
    }
  }
});

// SIGNUP
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = signupForm.querySelector('input[name="signupName"]').value.trim();
  const email = signupForm.querySelector('input[name="signupEmail"]').value.trim();
  const password = signupForm.querySelector('input[name="signupPassword"]').value;
  const platform = signupForm.querySelector('select[name="platform"]').value;

  if (!name || !email || !password || !platform) {
    alert("Please fill all signup fields.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(userCredential.user, {
      displayName: name
    });

    await set(ref(db, "users/" + userCredential.user.uid), {
      name,
      email,
      platform,
      createdAt: new Date().toISOString()
    });

    alert("Account Created Successfully");
  } catch (error) {
    alert(error.message);
  }
});

// GOOGLE LOGIN / SIGNUP
document.querySelectorAll(".google-button").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await update(ref(db, "users/" + user.uid), {
        name: user.displayName || "",
        email: user.email || "",
        platform: "Google",
        updatedAt: new Date().toISOString()
      });

      alert("Google sign-in successful");
    } catch (error) {
      alert(error.message);
    }
  });
});




document.addEventListener("click", async (e) => {
    if (e.target && e.target.id === "logoutBtn") {
        e.preventDefault();

        try {
            await signOut(auth);

            // Return to login page
            dashboard.hidden = true;
            authPanel.style.display = "block";
            authVisual.style.display = "block";

            location.href = "index.html";

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }
});
document.addEventListener("click", async (e) => {

    if (e.target.id !== "logoutBtn") return;

    e.preventDefault();

    try {

        await signOut(auth);

        window.location.href = "index.html";

    } catch (error) {

        console.error(error);
        alert(error.message);

    }

});