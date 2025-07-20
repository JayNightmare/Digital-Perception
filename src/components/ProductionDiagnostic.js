// src/components/ProductionDiagnostic.js
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import styled from "styled-components";

const DiagnosticContainer = styled.div`
    background: #2a2a2a;
    color: #fff;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 8px;
    border: 1px solid #444;
    font-family: "Courier New", monospace;
    font-size: 0.9rem;
`;

const TestItem = styled.div`
    margin: 0.5rem 0;
    padding: 0.5rem;
    border-radius: 4px;
    background: ${(props) =>
        props.status === "success"
            ? "#1a4d1a"
            : props.status === "error"
            ? "#4d1a1a"
            : "#4d4d1a"};
    border-left: 4px solid
        ${(props) =>
            props.status === "success"
                ? "#4ade80"
                : props.status === "error"
                ? "#ef4444"
                : "#fbbf24"};
`;

const Button = styled.button`
    background: #61dafb;
    color: #222;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0.5rem 0.5rem 0;
    cursor: pointer;
    font-weight: 500;

    &:hover {
        background: #4fa8c5;
    }

    &:disabled {
        background: #666;
        cursor: not-allowed;
    }
`;

// Parse auth domain array helper function
const parseAuthDomainInfo = (authDomainString) => {
    if (!authDomainString)
        return { type: "missing", domains: [], selected: null };

    const cleaned = authDomainString
        .toString()
        .trim()
        .replace(/[\r\n\t]/g, "");

    if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
        const domains = cleaned
            .slice(1, -1)
            .split(",")
            .map((domain) => domain.trim())
            .filter((domain) => domain.length > 0);

        const currentHostname = window.location.hostname;
        let selected;

        if (currentHostname.includes("github.io")) {
            selected =
                domains.find((d) => d.includes("github.io")) || domains[0];
        } else if (
            currentHostname === "localhost" ||
            currentHostname === "127.0.0.1"
        ) {
            selected = domains.find((d) => d === "localhost") || domains[0];
        } else {
            selected =
                domains.find(
                    (d) =>
                        d.includes("firebaseapp.com") || d.includes("web.app")
                ) || domains[0];
        }

        return { type: "array", domains, selected };
    }

    return { type: "single", domains: [cleaned], selected: cleaned };
};

export default function ProductionDiagnostic() {
    const [diagnostics, setDiagnostics] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    const addDiagnostic = (test, status, message, details = null) => {
        setDiagnostics((prev) => [
            ...prev,
            { test, status, message, details, timestamp: new Date() },
        ]);
    };

    const runComprehensiveDiagnostic = async () => {
        setIsRunning(true);
        setDiagnostics([]);

        // Test 1: Environment Variables & Auth Domain Parsing
        addDiagnostic(
            "Environment Check",
            "pending",
            "Checking environment variables..."
        );

        // Parse auth domain to check array handling
        const authDomainInfo = parseAuthDomainInfo(
            process.env.REACT_APP_AUTH_DOMAIN
        );

        const envVars = {
            REACT_APP_PROJECT_ID: process.env.REACT_APP_PROJECT_ID,
            REACT_APP_API_KEY: process.env.REACT_APP_API_KEY
                ? "***SET***"
                : "MISSING",
            REACT_APP_AUTH_DOMAIN: process.env.REACT_APP_AUTH_DOMAIN,
            AUTH_DOMAIN_TYPE: authDomainInfo.type,
            AUTH_DOMAIN_AVAILABLE: authDomainInfo.domains,
            AUTH_DOMAIN_SELECTED: authDomainInfo.selected,
            NODE_ENV: process.env.NODE_ENV,
            HOSTNAME: window.location.hostname,
            ORIGIN: window.location.origin,
        };

        // Check for newline/whitespace issues
        const envVarIssues = [];
        const checkEnvVar = (name, value) => {
            if (value && typeof value === "string") {
                if (value.includes("\n"))
                    envVarIssues.push(`${name} contains newline characters`);
                if (value.includes("\r"))
                    envVarIssues.push(
                        `${name} contains carriage return characters`
                    );
                if (value !== value.trim())
                    envVarIssues.push(
                        `${name} has leading/trailing whitespace`
                    );
            }
        };

        checkEnvVar("REACT_APP_PROJECT_ID", process.env.REACT_APP_PROJECT_ID);
        checkEnvVar("REACT_APP_AUTH_DOMAIN", process.env.REACT_APP_AUTH_DOMAIN);
        checkEnvVar("REACT_APP_API_KEY", process.env.REACT_APP_API_KEY);

        const missingEnvVars = Object.entries(envVars)
            .filter(([key, value]) => !value || value === "undefined")
            .map(([key]) => key);

        if (missingEnvVars.length === 0 && envVarIssues.length === 0) {
            addDiagnostic(
                "Environment Check",
                "success",
                "All environment variables present and clean",
                envVars
            );
        } else if (envVarIssues.length > 0) {
            addDiagnostic(
                "Environment Check",
                "error",
                `Environment variable issues found: ${envVarIssues.join(", ")}`,
                { ...envVars, issues: envVarIssues }
            );
        } else {
            addDiagnostic(
                "Environment Check",
                "error",
                `Missing variables: ${missingEnvVars.join(", ")}`,
                envVars
            );
        }

        // Test 2: Firebase Config Validation
        addDiagnostic(
            "Firebase Config",
            "pending",
            "Validating Firebase configuration..."
        );

        try {
            const projectId = process.env.REACT_APP_PROJECT_ID;
            const authDomain = process.env.REACT_APP_AUTH_DOMAIN;

            if (!projectId || !authDomain) {
                throw new Error("Missing projectId or authDomain");
            }

            if (!authDomain.includes(".")) {
                throw new Error("Invalid authDomain format");
            }

            addDiagnostic(
                "Firebase Config",
                "success",
                "Firebase configuration valid",
                {
                    projectId,
                    authDomain,
                    expectedFormat: `${projectId}.firebaseapp.com`,
                }
            );
        } catch (error) {
            addDiagnostic("Firebase Config", "error", error.message);
        }

        // Test 3: Database Instance Check
        addDiagnostic(
            "Database Instance",
            "pending",
            "Checking Firestore database instance..."
        );

        try {
            // Test if db object exists and has expected properties
            if (!db) {
                throw new Error("Firestore db instance is null or undefined");
            }

            if (!db._delegate) {
                throw new Error("Firestore db delegate is missing");
            }

            const dbInfo = {
                app: db.app?.name || "Unknown",
                projectId: db._delegate._databaseId?.projectId || "Unknown",
                database: db._delegate._databaseId?.database || "Unknown",
            };

            addDiagnostic(
                "Database Instance",
                "success",
                "Firestore instance initialized",
                dbInfo
            );
        } catch (error) {
            addDiagnostic("Database Instance", "error", error.message);
        }

        // Test 4: Network Connectivity Test
        addDiagnostic(
            "Network Test",
            "pending",
            "Testing basic connectivity..."
        );

        try {
            const testUrl = `https://firestore.googleapis.com/v1/projects/${process.env.REACT_APP_PROJECT_ID}/databases/(default)/documents`;
            const response = await fetch(testUrl, { method: "HEAD" });

            if (
                response.status === 200 ||
                response.status === 401 ||
                response.status === 403
            ) {
                addDiagnostic(
                    "Network Test",
                    "success",
                    `Firestore API reachable (Status: ${response.status})`
                );
            } else {
                addDiagnostic(
                    "Network Test",
                    "error",
                    `Unexpected response: ${response.status} ${response.statusText}`
                );
            }
        } catch (error) {
            addDiagnostic(
                "Network Test",
                "error",
                `Network error: ${error.message}`
            );
        }

        // Test 5: Firestore Collection Test
        addDiagnostic(
            "Firestore Access",
            "pending",
            "Testing Firestore collection access..."
        );

        try {
            const projectsRef = collection(db, "projects");
            const snapshot = await getDocs(projectsRef);

            addDiagnostic(
                "Firestore Access",
                "success",
                `Successfully accessed projects collection (${snapshot.size} documents)`,
                {
                    collectionPath: "projects",
                    documentCount: snapshot.size,
                    empty: snapshot.empty,
                }
            );
        } catch (error) {
            addDiagnostic(
                "Firestore Access",
                "error",
                `Firestore access failed: ${error.message}`,
                {
                    errorCode: error.code,
                    errorDetails: error.toString(),
                }
            );
        }

        // Test 6: Security Rules Test
        addDiagnostic("Security Rules", "pending", "Testing security rules...");

        try {
            // Try to access a non-existent document to test read permissions
            const testDocRef = doc(
                db,
                "projects",
                "test-document-that-does-not-exist"
            );
            await getDoc(testDocRef);

            addDiagnostic(
                "Security Rules",
                "success",
                "Security rules allow read access"
            );
        } catch (error) {
            if (error.code === "permission-denied") {
                addDiagnostic(
                    "Security Rules",
                    "error",
                    "Security rules deny access",
                    {
                        errorCode: error.code,
                        suggestion:
                            "Update Firestore security rules to allow read access",
                    }
                );
            } else {
                addDiagnostic(
                    "Security Rules",
                    "success",
                    "Security rules allow access (document not found is expected)"
                );
            }
        }

        setIsRunning(false);
    };

    const generateReport = () => {
        const report = {
            timestamp: new Date().toISOString(),
            environment: {
                hostname: window.location.hostname,
                origin: window.location.origin,
                userAgent: navigator.userAgent,
                nodeEnv: process.env.NODE_ENV,
            },
            diagnostics: diagnostics.map((d) => ({
                test: d.test,
                status: d.status,
                message: d.message,
                details: d.details,
            })),
        };

        console.log("🔍 Production Diagnostic Report:", report);

        // Copy to clipboard
        navigator.clipboard
            .writeText(JSON.stringify(report, null, 2))
            .then(() => {
                alert("Diagnostic report copied to clipboard!");
            });
    };

    return (
        <DiagnosticContainer>
            <h3>🔍 Production Firestore Diagnostic</h3>
            <p>Running diagnostics for GitHub Pages deployment...</p>

            <div>
                <Button
                    onClick={runComprehensiveDiagnostic}
                    disabled={isRunning}
                >
                    {isRunning
                        ? "Running Diagnostics..."
                        : "Run Full Diagnostic"}
                </Button>

                {diagnostics.length > 0 && (
                    <Button onClick={generateReport}>
                        Copy Report to Clipboard
                    </Button>
                )}
            </div>

            {diagnostics.map((diagnostic, index) => (
                <TestItem key={index} status={diagnostic.status}>
                    <strong>{diagnostic.test}:</strong> {diagnostic.message}
                    {diagnostic.details && (
                        <pre
                            style={{
                                margin: "0.5rem 0 0 0",
                                fontSize: "0.8rem",
                                opacity: 0.8,
                            }}
                        >
                            {JSON.stringify(diagnostic.details, null, 2)}
                        </pre>
                    )}
                </TestItem>
            ))}
        </DiagnosticContainer>
    );
}
