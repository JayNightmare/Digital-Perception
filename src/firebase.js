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

// Enhanced environment variable checking
const missingVars = requiredEnvVars.filter((varName) => {
    const value = process.env[varName];
    return !value || value === 'undefined' || value.trim() === '';
});

if (missingVars.length > 0) {
    console.error("❌ Missing Firebase environment variables:", missingVars);
    console.error("Available env vars:", Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
    throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}\n` +
            "Please check your .env file or GitHub Secrets configuration."
    );
}

// Validate environment variable values
const validateEnvVar = (name, value) => {
    if (!value || value === 'undefined') {
        throw new Error(`${name} is missing or undefined`);
    }
    if (value.includes('${') || value.includes('}')) {
        throw new Error(`${name} contains template syntax - check your environment configuration`);
    }
    return true;
};

// Validate each environment variable
try {
    validateEnvVar('REACT_APP_PROJECT_ID', process.env.REACT_APP_PROJECT_ID);
    validateEnvVar('REACT_APP_AUTH_DOMAIN', process.env.REACT_APP_AUTH_DOMAIN);
    validateEnvVar('REACT_APP_API_KEY', process.env.REACT_APP_API_KEY);
} catch (error) {
    console.error("❌ Environment variable validation failed:", error.message);
    throw error;
}

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
let app;
let auth;
let db;

try {
    console.log("🔥 Initializing Firebase...");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Hostname:", window?.location?.hostname || 'unknown');
    console.log("Project ID:", firebaseConfig.projectId);
    console.log("Auth Domain:", firebaseConfig.authDomain);
    
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Production-specific logging
    if (process.env.NODE_ENV === "production") {
        console.log("✅ Firebase initialized in production mode");
        console.log("Database:", `${firebaseConfig.projectId}/(default)`);
        
        // Log additional debugging info for production issues
        console.log("Full config (sanitized):", {
            projectId: firebaseConfig.projectId,
            authDomain: firebaseConfig.authDomain,
            hasApiKey: !!firebaseConfig.apiKey,
            hasAppId: !!firebaseConfig.appId
        });
    }

    // Development-specific settings
    if (process.env.NODE_ENV === "development") {
        console.log("✅ Firebase initialized in development mode");
        console.log("Project ID:", firebaseConfig.projectId);
        console.log("Auth Domain:", firebaseConfig.authDomain);

        // Connect to emulators in development if needed
        if (process.env.REACT_APP_USE_FIREBASE_EMULATOR === "true") {
            console.log("🔧 Connecting to Firebase emulators...");
            if (!auth._authDomain) {
                connectAuthEmulator(auth, "http://localhost:9099", {
                    disableWarnings: true,
                });
            }
            if (!db._delegate._databaseId) {
                connectFirestoreEmulator(db, "localhost", 8080);
            }
        }
    }
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
    console.error("Config used:", {
        projectId: firebaseConfig.projectId || 'MISSING',
        authDomain: firebaseConfig.authDomain || 'MISSING',
        hasApiKey: !!firebaseConfig.apiKey,
        hasAppId: !!firebaseConfig.appId
    });
    throw new Error(`Failed to initialize Firebase: ${error.message}`);
}

export { auth, db };
