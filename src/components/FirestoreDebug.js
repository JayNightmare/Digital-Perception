// src/components/FirestoreDebug.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const DebugContainer = styled.div`
    background: #1a1a1a;
    color: #fff;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
    font-family: "Courier New", monospace;
    font-size: 0.9rem;
    border: 1px solid #333;
`;

const DebugTitle = styled.h3`
    color: #61dafb;
    margin: 0 0 1rem 0;
`;

const StatusItem = styled.div`
    margin: 0.5rem 0;
    color: ${(props) => {
        if (props.status === "success") return "#00b894";
        if (props.status === "error") return "#ff6b6b";
        return "#fdcb6e";
    }};
`;

const TestButton = styled.button`
    background: #61dafb;
    color: #000;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0.5rem 0.5rem 0;
    cursor: pointer;
    font-size: 0.9rem;

    &:hover {
        background: #4fa8c5;
    }

    &:disabled {
        background: #666;
        cursor: not-allowed;
    }
`;

function FirestoreDebug() {
    const [status, setStatus] = useState({
        firebaseInit: "unknown",
        firestoreInit: "unknown",
        connection: "unknown",
        permissions: "unknown",
    });
    const [logs, setLogs] = useState([]);
    const [testing, setTesting] = useState(false);

    const addLog = (message, type = "info") => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prev) => [...prev, { message, type, timestamp }]);
    };

    const testFirebaseInit = () => {
        try {
            if (db) {
                setStatus((prev) => ({ ...prev, firebaseInit: "success" }));
                addLog("✅ Firebase initialized successfully", "success");
                return true;
            } else {
                setStatus((prev) => ({ ...prev, firebaseInit: "error" }));
                addLog("❌ Firebase not initialized", "error");
                return false;
            }
        } catch (error) {
            setStatus((prev) => ({ ...prev, firebaseInit: "error" }));
            addLog(`❌ Firebase init error: ${error.message}`, "error");
            return false;
        }
    };

    const testFirestoreConnection = async () => {
        try {
            addLog("🔍 Testing Firestore connection...", "info");

            // Try to access Firestore
            const testCollection = collection(db, "projects");
            addLog("✅ Firestore collection reference created", "success");

            // Try to read from Firestore
            const snapshot = await getDocs(testCollection);
            setStatus((prev) => ({ ...prev, connection: "success" }));
            addLog(
                `✅ Firestore connection successful (${snapshot.size} documents)`,
                "success"
            );

            return true;
        } catch (error) {
            setStatus((prev) => ({ ...prev, connection: "error" }));
            addLog(
                `❌ Firestore connection failed: ${error.code} - ${error.message}`,
                "error"
            );

            if (error.code === "permission-denied") {
                setStatus((prev) => ({ ...prev, permissions: "error" }));
                addLog(
                    "❌ Permission denied - check Firestore security rules",
                    "error"
                );
            }

            return false;
        }
    };

    const runAllTests = async () => {
        setTesting(true);
        setLogs([]);

        addLog("🧪 Starting Firestore diagnostic tests...", "info");

        // Test 1: Firebase initialization
        const firebaseOk = testFirebaseInit();

        if (firebaseOk) {
            // Test 2: Firestore connection
            await testFirestoreConnection();
        }

        addLog("🏁 Diagnostic tests completed", "info");
        setTesting(false);
    };

    const clearLogs = () => {
        setLogs([]);
    };

    useEffect(() => {
        // Auto-run basic tests on mount
        const runInitialTest = () => {
            try {
                if (db) {
                    setStatus((prev) => ({ ...prev, firebaseInit: "success" }));
                    addLog("✅ Firebase initialized successfully", "success");
                } else {
                    setStatus((prev) => ({ ...prev, firebaseInit: "error" }));
                    addLog("❌ Firebase not initialized", "error");
                }
            } catch (error) {
                setStatus((prev) => ({ ...prev, firebaseInit: "error" }));
                addLog(`❌ Firebase init error: ${error.message}`, "error");
            }
        };

        runInitialTest();
    }, []);

    const getStatusIcon = (statusValue) => {
        switch (statusValue) {
            case "success":
                return "✅";
            case "error":
                return "❌";
            case "warning":
                return "⚠️";
            default:
                return "❓";
        }
    };

    return (
        <DebugContainer>
            <DebugTitle>🔧 Firestore Debug Panel</DebugTitle>

            <div>
                <h4>System Status:</h4>
                <StatusItem status={status.firebaseInit}>
                    {getStatusIcon(status.firebaseInit)} Firebase
                    Initialization: {status.firebaseInit}
                </StatusItem>
                <StatusItem status={status.connection}>
                    {getStatusIcon(status.connection)} Firestore Connection:{" "}
                    {status.connection}
                </StatusItem>
                <StatusItem status={status.permissions}>
                    {getStatusIcon(status.permissions)} Permissions:{" "}
                    {status.permissions}
                </StatusItem>
            </div>

            <div>
                <TestButton onClick={runAllTests} disabled={testing}>
                    {testing ? "Running Tests..." : "Run Diagnostic Tests"}
                </TestButton>
                <TestButton onClick={clearLogs}>Clear Logs</TestButton>
            </div>

            {logs.length > 0 && (
                <div>
                    <h4>Debug Logs:</h4>
                    <div
                        style={{
                            maxHeight: "200px",
                            overflowY: "auto",
                            background: "#0a0a0a",
                            padding: "0.5rem",
                            borderRadius: "4px",
                        }}
                    >
                        {logs.map((log, index) => (
                            <div
                                key={index}
                                style={{ marginBottom: "0.25rem" }}
                            >
                                <span style={{ color: "#666" }}>
                                    {log.timestamp}
                                </span>{" "}
                                - {log.message}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div
                style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#999" }}
            >
                <p>
                    <strong>Common Issues:</strong>
                </p>
                <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                    <li>Permission denied: Check Firestore security rules</li>
                    <li>Failed precondition: Firestore database not created</li>
                    <li>
                        Unavailable: Network connectivity or Firebase service
                        issues
                    </li>
                    <li>Invalid argument: Check environment variables</li>
                </ul>
            </div>
        </DebugContainer>
    );
}

export default FirestoreDebug;
