// src/utils/testFirestore.js
/**
 * Test script for Firestore project service
 * This can be used to verify that Firestore operations work correctly
 * Run this in the browser console to test the functionality
 */

import { projectService } from "./projectService";

export const testFirestoreOperations = async () => {
    console.log("🧪 Starting Firestore tests...");

    try {
        // Test 1: Create a test project
        console.log("1️⃣ Testing project creation...");
        const testProject = await projectService.createProject({
            name: "Test Project",
            description: "This is a test project created by the test script",
            url: "https://example.com",
            pinned: false,
            isGitHubRepo: false,
        });
        console.log("✅ Project created:", testProject);

        // Test 2: Get all projects
        console.log("2️⃣ Testing project retrieval...");
        const allProjects = await projectService.getProjects();
        console.log(
            "✅ All projects retrieved:",
            allProjects.length,
            "projects"
        );

        // Test 3: Update the test project
        console.log("3️⃣ Testing project update...");
        const updatedProject = await projectService.updateProject(
            testProject.id,
            {
                description: "Updated test project description",
                pinned: true,
            }
        );
        console.log("✅ Project updated:", updatedProject);

        // Test 4: Get pinned projects
        console.log("4️⃣ Testing pinned projects retrieval...");
        const pinnedProjects = await projectService.getPinnedProjects();
        console.log(
            "✅ Pinned projects retrieved:",
            pinnedProjects.length,
            "projects"
        );

        // Test 5: Toggle pin status
        console.log("5️⃣ Testing pin toggle...");
        await projectService.togglePin(testProject.id, false);
        console.log("✅ Pin toggled successfully");

        // Test 6: Clean up - delete the test project
        console.log("6️⃣ Testing project deletion...");
        await projectService.deleteProject(testProject.id);
        console.log("✅ Test project deleted");

        console.log("🎉 All Firestore tests passed successfully!");
        return true;
    } catch (error) {
        console.error("❌ Test failed:", error);
        return false;
    }
};

// Test GitHub import functionality
export const testGitHubImport = async () => {
    console.log("🧪 Testing GitHub import...");

    try {
        // Fetch sample repos
        const response = await fetch(
            "https://api.github.com/orgs/Augmented-Perception/repos"
        );
        if (!response.ok) throw new Error("Failed to fetch GitHub repos");
        const repos = await response.json();

        console.log("📦 Found", repos.length, "GitHub repositories");

        // Import first 3 repos for testing
        const testRepos = repos.slice(0, 3);
        const result = await projectService.importGitHubRepos(testRepos);

        console.log("✅ GitHub import test completed:", result);
        return result;
    } catch (error) {
        console.error("❌ GitHub import test failed:", error);
        return false;
    }
};

// Cleanup function to remove all test projects
export const cleanupTestProjects = async () => {
    console.log("🧹 Cleaning up test projects...");

    try {
        const projects = await projectService.getProjects();
        const testProjects = projects.filter(
            (p) => p.name.includes("Test") || p.description.includes("test")
        );

        console.log("Found", testProjects.length, "test projects to clean up");

        for (const project of testProjects) {
            await projectService.deleteProject(project.id);
            console.log("🗑️ Deleted test project:", project.name);
        }

        console.log("✅ Cleanup completed");
        return true;
    } catch (error) {
        console.error("❌ Cleanup failed:", error);
        return false;
    }
};

// Utility function to check Firestore connection
export const checkFirestoreConnection = async () => {
    try {
        const projects = await projectService.getProjects();
        console.log(
            "✅ Firestore connection successful. Found",
            projects.length,
            "projects"
        );
        return true;
    } catch (error) {
        console.error("❌ Firestore connection failed:", error);
        return false;
    }
};

// Export all test functions for easy use
const testUtils = {
    testFirestoreOperations,
    testGitHubImport,
    cleanupTestProjects,
    checkFirestoreConnection,
};

export default testUtils;
