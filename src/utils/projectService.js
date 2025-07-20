// src/utils/projectService.js
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp,
    where,
} from "firebase/firestore";
import { db } from "../firebase";

const PROJECTS_COLLECTION = "projects";

// Helper function to handle Firestore errors
const handleFirestoreError = (error, operation) => {
    console.error(`Firestore ${operation} error:`, error);

    // Check for common error codes
    if (error.code === "permission-denied") {
        throw new Error(
            `Permission denied: Please check your Firestore security rules. You may need to authenticate or the rules may be too restrictive.`
        );
    } else if (error.code === "unavailable") {
        throw new Error(
            "Firestore service is currently unavailable. Please try again later."
        );
    } else if (error.code === "unauthenticated") {
        throw new Error(
            "Authentication required. Please log in to perform this action."
        );
    } else if (error.code === "failed-precondition") {
        throw new Error(
            "Firestore database may not be properly initialized. Please check your Firebase console."
        );
    } else if (error.code === "invalid-argument") {
        throw new Error(
            "Invalid data provided. Please check your input and try again."
        );
    }

    throw new Error(
        `${operation} failed: ${error.message || error.code || "Unknown error"}`
    );
};

// Test connection function
export const testFirestoreConnection = async () => {
    try {
        console.log("Testing Firestore connection...");
        const testQuery = query(collection(db, PROJECTS_COLLECTION));
        await getDocs(testQuery);
        console.log("✅ Firestore connection successful");
        return true;
    } catch (error) {
        console.error("❌ Firestore connection failed:", error);
        handleFirestoreError(error, "Connection test");
        return false;
    }
};

/**
 * Project data structure:
 * {
 *   id: string,
 *   name: string,
 *   description: string,
 *   url: string,
 *   pinned: boolean,
 *   isGitHubRepo: boolean,
 *   githubData: object | null,
 *   createdAt: timestamp,
 *   updatedAt: timestamp
 * }
 */

export const projectService = {
    // Create a new project
    async createProject(projectData) {
        try {
            console.log("📝 Creating new project:", projectData.name);

            const project = {
                name: projectData.name,
                description: projectData.description || "",
                url: projectData.url || "",
                pinned: projectData.pinned || false,
                isGitHubRepo: projectData.isGitHubRepo || false,
                githubData: projectData.githubData || null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const docRef = await addDoc(
                collection(db, PROJECTS_COLLECTION),
                project
            );
            console.log("✅ Project created with ID:", docRef.id);

            return {
                id: docRef.id,
                ...project,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        } catch (error) {
            handleFirestoreError(error, "Create project");
        }
    },

    // Get all projects
    async getProjects() {
        try {
            console.log("🔍 Fetching projects from Firestore...");

            // First test the connection
            await testFirestoreConnection();

            const q = query(
                collection(db, PROJECTS_COLLECTION),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const projects = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                projects.push({
                    id: doc.id,
                    ...data,
                    // Convert Firestore timestamps to JavaScript dates
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                });
            });

            console.log(`✅ Successfully fetched ${projects.length} projects`);
            return projects;
        } catch (error) {
            handleFirestoreError(error, "Get projects");
        }
    },

    // Get pinned projects
    async getPinnedProjects() {
        try {
            const q = query(
                collection(db, PROJECTS_COLLECTION),
                where("pinned", "==", true),
                orderBy("updatedAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const projects = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                projects.push({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                });
            });

            return projects;
        } catch (error) {
            console.error("Error getting pinned projects:", error);
            throw new Error(
                "Failed to fetch pinned projects: " + error.message
            );
        }
    },

    // Update a project
    async updateProject(projectId, updates) {
        try {
            const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
            const updateData = {
                ...updates,
                updatedAt: serverTimestamp(),
            };

            await updateDoc(projectRef, updateData);
            console.log("Project updated:", projectId);

            return {
                id: projectId,
                ...updates,
                updatedAt: new Date(),
            };
        } catch (error) {
            console.error("Error updating project:", error);
            throw new Error("Failed to update project: " + error.message);
        }
    },

    // Delete a project
    async deleteProject(projectId) {
        try {
            const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
            await deleteDoc(projectRef);
            console.log("Project deleted:", projectId);
            return projectId;
        } catch (error) {
            console.error("Error deleting project:", error);
            throw new Error("Failed to delete project: " + error.message);
        }
    },

    // Pin/Unpin a project
    async togglePin(projectId, pinned) {
        try {
            return await this.updateProject(projectId, { pinned });
        } catch (error) {
            console.error("Error toggling pin:", error);
            throw new Error("Failed to toggle pin: " + error.message);
        }
    },

    // Import projects from GitHub (for initial setup)
    async importGitHubRepos(repos) {
        try {
            const importPromises = repos.map((repo) => {
                return this.createProject({
                    name: repo.name,
                    description: repo.description || "",
                    url: repo.html_url,
                    pinned: false,
                    isGitHubRepo: true,
                    githubData: {
                        id: repo.id,
                        full_name: repo.full_name,
                        stargazers_count: repo.stargazers_count,
                        language: repo.language,
                        updated_at: repo.updated_at,
                    },
                });
            });

            const results = await Promise.allSettled(importPromises);
            const successful = results.filter(
                (result) => result.status === "fulfilled"
            );
            const failed = results.filter(
                (result) => result.status === "rejected"
            );

            console.log(
                `Imported ${successful.length} projects, ${failed.length} failed`
            );

            if (failed.length > 0) {
                console.error(
                    "Failed imports:",
                    failed.map((f) => f.reason)
                );
            }

            return {
                successful: successful.length,
                failed: failed.length,
                projects: successful.map((s) => s.value),
            };
        } catch (error) {
            console.error("Error importing GitHub repos:", error);
            throw new Error(
                "Failed to import GitHub repositories: " + error.message
            );
        }
    },

    // Sync with GitHub data (update existing GitHub repos with latest data)
    async syncGitHubData(gitHubRepos) {
        try {
            const existingProjects = await this.getProjects();
            const gitHubProjects = existingProjects.filter(
                (p) => p.isGitHubRepo
            );

            const updatePromises = gitHubProjects.map((project) => {
                const gitHubRepo = gitHubRepos.find(
                    (repo) =>
                        repo.id === project.githubData?.id ||
                        repo.name === project.name
                );

                if (gitHubRepo) {
                    return this.updateProject(project.id, {
                        description:
                            gitHubRepo.description || project.description,
                        url: gitHubRepo.html_url,
                        githubData: {
                            ...project.githubData,
                            stargazers_count: gitHubRepo.stargazers_count,
                            language: gitHubRepo.language,
                            updated_at: gitHubRepo.updated_at,
                        },
                    });
                }
                return Promise.resolve(null);
            });

            const results = await Promise.allSettled(updatePromises);
            const successful = results.filter(
                (result) => result.status === "fulfilled" && result.value
            ).length;

            console.log(`Synced ${successful} GitHub projects`);
            return successful;
        } catch (error) {
            console.error("Error syncing GitHub data:", error);
            throw new Error("Failed to sync GitHub data: " + error.message);
        }
    },
};

export default projectService;
