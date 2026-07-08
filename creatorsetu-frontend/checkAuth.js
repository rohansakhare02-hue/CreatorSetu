import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAP6XfEF7khjadB5JXpFHOBYuK4ygTcVno",
  authDomain: "creatorsetu-e8fd8.firebaseapp.com",
  projectId: "creatorsetu-e8fd8",
  storageBucket: "creatorsetu-e8fd8.firebasestorage.app",
  messagingSenderId: "862233947149",
  appId: "1:862233947149:web:59bef7ce82eb43c44bb944"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname.split("/").pop();

  if (!user && currentPage !== "index.html" && currentPage !== "") {
    window.location.href = "index.html";
  }
});