import {
  initializeApp,
  getApps
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAP6XfEF7khjadB5JXpFHOBYuK4ygTcVno",
  authDomain: "creatorsetu-e8fd8.firebaseapp.com",
  projectId: "creatorsetu-e8fd8",
  storageBucket: "creatorsetu-e8fd8.firebasestorage.app",
  messagingSenderId: "862233947149",
  appId: "1:862233947149:web:59bef7ce82eb43c44bb944"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      await signOut(auth);

      // Show login page
      showAuth();

      alert("Logged out successfully");

    } catch (error) {
      alert(error.message);
    }
  });
}