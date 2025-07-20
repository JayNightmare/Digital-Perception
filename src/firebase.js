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
    return !value || value === "undefined" || value.trim() === "";
});

if (missingVars.length > 0) {
    console.error("❌ Missing Firebase environment variables:", missingVars);
    console.error(
        "Available env vars:",
        Object.keys(process.env).filter((key) => key.startsWith("REACT_APP_"))
    );
    throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}\n` +
            "Please check your .env file or GitHub Secrets configuration."
    );
}

// Sanitize environment variables by removing newlines and whitespace
const sanitizeEnvVar = (value) => {
    if (!value) return value;
    return value
        .toString()
        .trim()
        .replace(/[\r\n\t]/g, "")
        .replace(/^['"`]|['"`]$/g, ""); // Remove quotes if present
};

// Parse auth domain array and select appropriate domain
const parseAuthDomain = (authDomainString) => {
    console.log("Raw auth domain string:", authDomainString);

    // Clean the string first
    const cleaned = sanitizeEnvVar(authDomainString);

    // Check if it's an array format [domain1, domain2, domain3]
    if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
        // Remove brackets and split by comma
        const domains = cleaned
            .slice(1, -1) // Remove [ and ]
            .split(",")
            .map((domain) => domain.trim())
            .filter((domain) => domain.length > 0);

        console.log("Parsed domains:", domains);

        // Determine which domain to use based on current environment
        const currentHostname =
            typeof window !== "undefined"
                ? window.location.hostname
                : "localhost";
        console.log("Current hostname:", currentHostname);

        // Priority order for domain selection
        if (currentHostname.includes("github.io")) {
            // Use github.io domain if we're on GitHub Pages
            const githubDomain = domains.find((d) => d.includes("github.io"));
            if (githubDomain) {
                console.log("Using GitHub domain:", githubDomain);
                return githubDomain;
            }
        }

        if (
            currentHostname === "localhost" ||
            currentHostname === "127.0.0.1"
        ) {
            // Use localhost if available, otherwise firebase domain
            const localDomain = domains.find((d) => d === "localhost");
            if (localDomain) {
                console.log("Using localhost domain");
                return localDomain;
            }
        }

        // Default to Firebase auth domain (should be first or contain firebaseapp.com)
        const firebaseDomain = domains.find(
            (d) => d.includes("firebaseapp.com") || d.includes("web.app")
        );
        if (firebaseDomain) {
            console.log("Using Firebase auth domain:", firebaseDomain);
            return firebaseDomain;
        }

        // Fallback to first domain
        console.log("Using fallback domain:", domains[0]);
        return domains[0];
    }

    // If not array format, return as-is
    console.log("Using single auth domain:", cleaned);
    return cleaned;
};

// Validate environment variable values
const validateEnvVar = (name, value) => {
    if (!value || value === "undefined") {
        throw new Error(`${name} is missing or undefined`);
    }
    if (value.includes("${") || value.includes("}")) {
        throw new Error(
            `${name} contains template syntax - check your environment configuration`
        );
    }
    if (value.includes("\n") || value.includes("\r")) {
        console.warn(
            `⚠️ ${name} contains newline characters - will be sanitized`
        );
    }
    return true;
};

// Parse and select appropriate auth domain
const selectedAuthDomain = parseAuthDomain(process.env.REACT_APP_AUTH_DOMAIN);

// Validate each environment variable
try {
    validateEnvVar(
        "REACT_APP_PROJECT_ID",
        sanitizeEnvVar(process.env.REACT_APP_PROJECT_ID)
    );
    validateEnvVar("REACT_APP_AUTH_DOMAIN", selectedAuthDomain);
    validateEnvVar(
        "REACT_APP_API_KEY",
        sanitizeEnvVar(process.env.REACT_APP_API_KEY)
    );
} catch (error) {
    console.error("❌ Environment variable validation failed:", error.message);
    throw error;
}

const firebaseConfig = {
    apiKey: sanitizeEnvVar(process.env.REACT_APP_API_KEY),
    authDomain: selectedAuthDomain,
    projectId: sanitizeEnvVar(process.env.REACT_APP_PROJECT_ID),
    storageBucket: sanitizeEnvVar(process.env.REACT_APP_STORAGE_BUCKET),
    messagingSenderId: sanitizeEnvVar(
        process.env.REACT_APP_MESSAGING_SENDER_ID
    ),
    appId: sanitizeEnvVar(process.env.REACT_APP_APP_ID),
    measurementId: sanitizeEnvVar(process.env.REACT_APP_MEASUREMENT_ID),
};

// Debug: Show original vs sanitized values
if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "production"
) {
    console.log("🔍 Environment Variables Debug:");
    console.log(
        "Original PROJECT_ID:",
        JSON.stringify(process.env.REACT_APP_PROJECT_ID)
    );
    console.log(
        "Sanitized PROJECT_ID:",
        JSON.stringify(firebaseConfig.projectId)
    );
    console.log(
        "Original AUTH_DOMAIN:",
        JSON.stringify(process.env.REACT_APP_AUTH_DOMAIN)
    );
    console.log(
        "Selected AUTH_DOMAIN:",
        JSON.stringify(firebaseConfig.authDomain)
    );
    console.log(
        "Current Hostname:",
        typeof window !== "undefined" ? window.location.hostname : "server"
    );
}

// Initialize Firebase
let app;
let auth;
let db;

try {
    console.log("🔥 Initializing Firebase...");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Hostname:", window?.location?.hostname || "unknown");
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
            hasAppId: !!firebaseConfig.appId,
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
        projectId: firebaseConfig.projectId || "MISSING",
        authDomain: firebaseConfig.authDomain || "MISSING",
        hasApiKey: !!firebaseConfig.apiKey,
        hasAppId: !!firebaseConfig.appId,
    });
    throw new Error(`Failed to initialize Firebase: ${error.message}`);
}

export { auth, db };
