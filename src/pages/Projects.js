import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { projectService } from "../utils/projectService";
import "../styles/projects.css";

const ProjectList = styled.ul`
    list-style: none;
    padding: 0;
`;
const ProjectItem = styled.li`
    background: ${({ pinned }) => (pinned ? "#ffeeba" : "#f4f6fb")};
    border-radius: 8px;
    margin-bottom: 1.2rem;
    padding: 1.2rem 1.5rem;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
    position: relative;
`;
const ProjectTitle = styled.a`
    font-size: 1.2rem;
    font-weight: 600;
    color: #222;
    text-decoration: none;
    &:hover {
        color: #61dafb;
    }
`;
const ProjectDesc = styled.p`
    margin: 0.5rem 0 0 0;
    color: #555;
`;
const AdminControls = styled.div`
    margin-top: 0.7rem;
    display: flex;
    gap: 0.5rem;
`;
const AdminButton = styled.button`
    background: #222;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 0.2rem 0.7rem;
    font-size: 0.95rem;
    cursor: pointer;
    &:hover {
        background: #61dafb;
        color: #222;
    }
`;
const AddEditForm = styled.div`
    background: #f7f8fa;
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
`;
const FormInput = styled.input`
    margin: 0.3rem 0.7rem 0.3rem 0;
    padding: 0.3rem 0.7rem;
    border-radius: 4px;
    border: 1px solid #ccc;
`;
const FormButton = styled.button`
    background: #61dafb;
    color: #222;
    border: none;
    border-radius: 4px;
    padding: 0.3rem 0.9rem;
    font-weight: 500;
    margin-right: 0.5rem;
    cursor: pointer;
    &:hover {
        background: #222;
        color: #fff;
    }
`;

function Projects({ isAdmin }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(null);
    const [form, setForm] = useState({ name: "", description: "", url: "" });
    const [syncing, setSyncing] = useState(false);

    // Load projects from Firestore
    const loadProjects = async () => {
        try {
            setLoading(true);
            const firestoreProjects = await projectService.getProjects();
            setProjects(firestoreProjects);
            setError(null);
        } catch (err) {
            console.error("Error loading projects:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Initial load and setup
    useEffect(() => {
        loadProjects();
    }, []);

    // Sync with GitHub repositories
    const syncWithGitHub = async () => {
        try {
            setSyncing(true);
            console.log("Syncing with GitHub...");

            // Fetch GitHub repos
            const response = await fetch(
                "https://api.github.com/orgs/Augmented-Perception/repos"
            );
            if (!response.ok) throw new Error("Failed to fetch GitHub repos");
            const gitHubRepos = await response.json();

            // Check if we have any projects in Firestore
            const existingProjects = await projectService.getProjects();

            if (existingProjects.length === 0) {
                // First time setup - import all GitHub repos
                console.log(
                    "No existing projects found, importing from GitHub..."
                );
                await projectService.importGitHubRepos(gitHubRepos);
            } else {
                // Sync existing GitHub projects with latest data
                console.log("Syncing existing GitHub projects...");
                await projectService.syncGitHubData(gitHubRepos);
            }

            // Reload projects
            await loadProjects();
            console.log("GitHub sync completed");
        } catch (err) {
            console.error("Error syncing with GitHub:", err);
            setError("Failed to sync with GitHub: " + err.message);
        } finally {
            setSyncing(false);
        }
    };

    // CRUD Operations
    const handlePin = async (project) => {
        try {
            await projectService.togglePin(project.id, !project.pinned);
            await loadProjects(); // Reload to reflect changes
        } catch (err) {
            console.error("Error toggling pin:", err);
            setError("Failed to update project pin status");
        }
    };

    const handleDelete = async (project) => {
        if (
            window.confirm(`Are you sure you want to delete "${project.name}"?`)
        ) {
            try {
                await projectService.deleteProject(project.id);
                await loadProjects(); // Reload to reflect changes
            } catch (err) {
                console.error("Error deleting project:", err);
                setError("Failed to delete project");
            }
        }
    };

    const handleEdit = (project) => {
        setShowEdit(project.id);
        setForm({
            name: project.name,
            description: project.description || "",
            url: project.url || "",
        });
    };

    const handleEditSubmit = async (projectId) => {
        try {
            await projectService.updateProject(projectId, {
                name: form.name,
                description: form.description,
                url: form.url,
            });
            setShowEdit(null);
            setForm({ name: "", description: "", url: "" });
            await loadProjects(); // Reload to reflect changes
        } catch (err) {
            console.error("Error updating project:", err);
            setError("Failed to update project");
        }
    };

    const handleAdd = async () => {
        if (!form.name.trim()) {
            setError("Project name is required");
            return;
        }

        try {
            await projectService.createProject({
                name: form.name,
                description: form.description,
                url: form.url,
                pinned: false,
                isGitHubRepo: false,
            });
            setForm({ name: "", description: "", url: "" });
            setShowAdd(false);
            await loadProjects(); // Reload to reflect changes
        } catch (err) {
            console.error("Error creating project:", err);
            setError("Failed to create project");
        }
    };

    const handleCancelEdit = () => {
        setShowEdit(null);
        setForm({ name: "", description: "", url: "" });
    };

    const handleCancelAdd = () => {
        setShowAdd(false);
        setForm({ name: "", description: "", url: "" });
    };

    if (loading)
        return (
            <div className="projects-page">
                <h1>Loading projects...</h1>
            </div>
        );
    if (error)
        return (
            <div className="projects-page">
                <h1>Error: {error}</h1>
            </div>
        );

    // Separate pinned and unpinned projects
    const pinnedProjects = projects.filter((p) => p.pinned);
    const unpinnedProjects = projects.filter((p) => !p.pinned);

    return (
        <div className="projects-page">
            <h1>Projects</h1>
            {error && (
                <div
                    style={{
                        color: "red",
                        margin: "1rem 0",
                        padding: "0.5rem",
                        background: "#ffe6e6",
                        borderRadius: "4px",
                    }}
                >
                    {error}
                </div>
            )}

            {isAdmin && (
                <div
                    style={{
                        marginBottom: "1rem",
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                    }}
                >
                    <FormButton onClick={() => setShowAdd(true)}>
                        Add Project
                    </FormButton>
                    <FormButton
                        onClick={syncWithGitHub}
                        disabled={syncing}
                        style={{
                            backgroundColor: syncing ? "#ccc" : "#4fa8c5",
                        }}
                    >
                        {syncing ? "Syncing..." : "Sync with GitHub"}
                    </FormButton>
                </div>
            )}

            <ProjectList className="projects-container">
                {/* Pinned Projects */}
                {pinnedProjects.map((project) => (
                    <ProjectItem key={project.id} pinned>
                        <span role="img" aria-label="pinned">
                            📌
                        </span>
                        <ProjectTitle
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {project.name}
                        </ProjectTitle>
                        <ProjectDesc>{project.description}</ProjectDesc>
                        {project.isGitHubRepo && (
                            <small
                                style={{ color: "#666", fontSize: "0.8rem" }}
                            >
                                GitHub Repository
                            </small>
                        )}
                        {isAdmin && (
                            <AdminControls>
                                <AdminButton onClick={() => handlePin(project)}>
                                    Unpin
                                </AdminButton>
                                <AdminButton
                                    onClick={() => handleEdit(project)}
                                >
                                    Edit
                                </AdminButton>
                                <AdminButton
                                    onClick={() => handleDelete(project)}
                                >
                                    Delete
                                </AdminButton>
                            </AdminControls>
                        )}
                        {showEdit === project.id && (
                            <AddEditForm>
                                <FormInput
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Name"
                                />
                                <FormInput
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Description"
                                />
                                <FormInput
                                    value={form.url}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            url: e.target.value,
                                        })
                                    }
                                    placeholder="URL"
                                />
                                <FormButton
                                    onClick={() => handleEditSubmit(project.id)}
                                >
                                    Save
                                </FormButton>
                                <FormButton onClick={handleCancelEdit}>
                                    Cancel
                                </FormButton>
                            </AddEditForm>
                        )}
                    </ProjectItem>
                ))}

                {/* Unpinned Projects */}
                {unpinnedProjects.map((project) => (
                    <ProjectItem key={project.id}>
                        <ProjectTitle
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {project.name}
                        </ProjectTitle>
                        <ProjectDesc>{project.description}</ProjectDesc>
                        {project.isGitHubRepo && (
                            <small
                                style={{ color: "#666", fontSize: "0.8rem" }}
                            >
                                GitHub Repository
                            </small>
                        )}
                        {isAdmin && (
                            <AdminControls>
                                <AdminButton onClick={() => handlePin(project)}>
                                    Pin
                                </AdminButton>
                                <AdminButton
                                    onClick={() => handleEdit(project)}
                                >
                                    Edit
                                </AdminButton>
                                <AdminButton
                                    onClick={() => handleDelete(project)}
                                >
                                    Delete
                                </AdminButton>
                            </AdminControls>
                        )}
                        {showEdit === project.id && (
                            <AddEditForm>
                                <FormInput
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Name"
                                />
                                <FormInput
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Description"
                                />
                                <FormInput
                                    value={form.url}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            url: e.target.value,
                                        })
                                    }
                                    placeholder="URL"
                                />
                                <FormButton
                                    onClick={() => handleEditSubmit(project.id)}
                                >
                                    Save
                                </FormButton>
                                <FormButton onClick={handleCancelEdit}>
                                    Cancel
                                </FormButton>
                            </AddEditForm>
                        )}
                    </ProjectItem>
                ))}
            </ProjectList>

            {/* Add Project Form */}
            {showAdd && (
                <AddEditForm>
                    <h3>Add Project</h3>
                    <FormInput
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Name"
                    />
                    <FormInput
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        placeholder="Description"
                    />
                    <FormInput
                        value={form.url}
                        onChange={(e) =>
                            setForm({ ...form, url: e.target.value })
                        }
                        placeholder="URL"
                    />
                    <FormButton onClick={handleAdd}>Add</FormButton>
                    <FormButton onClick={handleCancelAdd}>Cancel</FormButton>
                </AddEditForm>
            )}

            {projects.length === 0 && !loading && (
                <div
                    style={{
                        textAlign: "center",
                        color: "#666",
                        margin: "2rem 0",
                    }}
                >
                    <p>No projects found.</p>
                    {isAdmin && (
                        <p>
                            Add a project manually or sync with GitHub to get
                            started.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Projects;
