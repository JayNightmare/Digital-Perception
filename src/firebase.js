// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Check if all required environment variables are present
const requiredEnvVars = [
    "REACT_APP_API_KEY",
    "REACT_APP_AUTH_DOMAIN",
    "REACT_APP_PROJECT_ID",
    "REACT_APP_STORAGE_BUCKET",
    "REACT_APP_MESSAGING_SENDER_ID",
    "REACT_APP_APP_ID",
    "REACT_APP_MEASUREMENT_ID",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
    throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}\n` +
            "Please check your .env file or GitHub Secrets configuration."
    );
}

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY || "",
    authDomain: process.env.REACT_APP_AUTH_DOMAIN || "",
    projectId: process.env.REACT_APP_PROJECT_ID || "",
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET || "",
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID || "",
    appId: process.env.REACT_APP_APP_ID || "",
    measurementId: process.env.REACT_APP_MEASUREMENT_ID || "",
};

// Initialize Firebase
let app;
let auth;
let db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Debug logging for development
    if (process.env.NODE_ENV === "development") {
        console.log("Firebase initialized successfully");
        console.log("Project ID:", firebaseConfig.projectId);
        console.log("Auth Domain:", firebaseConfig.authDomain);
    }

    // Connect to emulators in development if needed
    if (
        process.env.NODE_ENV === "development" &&
        process.env.REACT_APP_USE_FIREBASE_EMULATOR === "true"
    ) {
        console.log("Connecting to Firebase emulators...");
        if (!auth._authDomain) {
            connectAuthEmulator(auth, "http://localhost:9099", {
                disableWarnings: true,
            });
        }
        if (!db._delegate._databaseId) {
            connectFirestoreEmulator(db, "localhost", 8080);
        }
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
    throw new Error(`Failed to initialize Firebase: ${error.message}`);
}

export { auth, db };
