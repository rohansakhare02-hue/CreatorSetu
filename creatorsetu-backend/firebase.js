const fs = require("fs");
const path = require("path");

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

function loadServiceAccount() {
  const keyPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    path.join(__dirname, "firebase-key.json");

  if (!fs.existsSync(keyPath)) {
    throw new Error("firebase-key.json not found.");
  }

  return JSON.parse(fs.readFileSync(keyPath, "utf8"));
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert(loadServiceAccount()),
  });
}

const db = getFirestore();

module.exports = db;