
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAP6XfEF7khjadB5JXpFHOBYuK4ygTcVno",
  authDomain: "creatorsetu-e8fd8.firebaseapp.com",
  projectId: "creatorsetu-e8fd8",
  storageBucket: "creatorsetu-e8fd8.firebasestorage.app",
  messagingSenderId: "862233947149",
  appId: "1:862233947149:web:59bef7ce82eb43c44bb944"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);