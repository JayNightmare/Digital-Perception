// src/components/AdminProjectDashboard.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { projectService } from "../utils/projectService";

const DashboardContainer = styled.div`
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
`;

const StatCard = styled.div`
    background: var(--secondary-color);
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #333;
    text-align: center;
`;

const StatNumber = styled.div`
    font-size: 2rem;
    font-weight: bold;
    color: #61dafb;
    margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
    color: var(--text-color);
    font-size: 0.9rem;
`;

const ActionButton = styled.button`
    background: #61dafb;
    color: #000;
    border: none;
    border-radius: 4px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    margin: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background: #4fa8c5;
    }

    &:disabled {
        background: #666;
        cursor: not-allowed;
    }
`;

const ProjectTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: var(--secondary-color);
    border-radius: 8px;
    overflow: hidden;
    margin-top: 2rem;
`;

const TableHeader = styled.th`
    background: #333;
    color: var(--text-color);
    padding: 1rem;
    text-align: left;
    font-weight: 600;
`;

const TableCell = styled.td`
    padding: 1rem;
    border-bottom: 1px solid #444;
    color: var(--text-color);
`;

const ProjectLink = styled.a`
    color: #61dafb;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const Badge = styled.span`
    background: ${(props) =>
        props.variant === "github" ? "#24292e" : "#61dafb"};
    color: ${(props) => (props.variant === "github" ? "#fff" : "#000")};
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
`;

const ErrorMessage = styled.div`
    background: #ffe6e6;
    color: #d63031;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
`;

const SuccessMessage = styled.div`
    background: #e6ffe6;
    color: #00b894;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
`;

function AdminProjectDashboard() {
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pinned: 0,
        github: 0,
        custom: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [syncing, setSyncing] = useState(false);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const allProjects = await projectService.getProjects();
            setProjects(allProjects);

            // Calculate stats
            const stats = {
                total: allProjects.length,
                pinned: allProjects.filter((p) => p.pinned).length,
                github: allProjects.filter((p) => p.isGitHubRepo).length,
                custom: allProjects.filter((p) => !p.isGitHubRepo).length,
            };
            setStats(stats);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleSync = async () => {
        try {
            setSyncing(true);
            setError(null);
            setSuccess(null);

            const response = await fetch(
                "https://api.github.com/orgs/Augmented-Perception/repos"
            );
            if (!response.ok) throw new Error("Failed to fetch GitHub repos");
            const gitHubRepos = await response.json();

            const existingProjects = await projectService.getProjects();

            if (existingProjects.length === 0) {
                const result = await projectService.importGitHubRepos(
                    gitHubRepos
                );
                setSuccess(
                    `Imported ${result.successful} projects from GitHub${
                        result.failed > 0 ? ` (${result.failed} failed)` : ""
                    }`
                );
            } else {
                const syncedCount = await projectService.syncGitHubData(
                    gitHubRepos
                );
                setSuccess(
                    `Synced ${syncedCount} GitHub projects with latest data`
                );
            }

            await loadProjects();
        } catch (err) {
            setError(err.message);
        } finally {
            setSyncing(false);
        }
    };

    const handleTogglePin = async (project) => {
        try {
            await projectService.togglePin(project.id, !project.pinned);
            await loadProjects();
            setSuccess(
                `${project.pinned ? "Unpinned" : "Pinned"} "${project.name}"`
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (project) => {
        if (
            !window.confirm(
                `Are you sure you want to delete "${project.name}"?`
            )
        ) {
            return;
        }

        try {
            await projectService.deleteProject(project.id);
            await loadProjects();
            setSuccess(`Deleted "${project.name}"`);
        } catch (err) {
            setError(err.message);
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    if (loading) {
        return (
            <DashboardContainer>
                <h1>Loading Admin Dashboard...</h1>
            </DashboardContainer>
        );
    }

    return (
        <DashboardContainer>
            <h1>Project Management Dashboard</h1>

            {error && (
                <ErrorMessage onClick={clearMessages}>
                    {error} (Click to dismiss)
                </ErrorMessage>
            )}

            {success && (
                <SuccessMessage onClick={clearMessages}>
                    {success} (Click to dismiss)
                </SuccessMessage>
            )}

            <StatsGrid>
                <StatCard>
                    <StatNumber>{stats.total}</StatNumber>
                    <StatLabel>Total Projects</StatLabel>
                </StatCard>
                <StatCard>
                    <StatNumber>{stats.pinned}</StatNumber>
                    <StatLabel>Pinned Projects</StatLabel>
                </StatCard>
                <StatCard>
                    <StatNumber>{stats.github}</StatNumber>
                    <StatLabel>GitHub Repos</StatLabel>
                </StatCard>
                <StatCard>
                    <StatNumber>{stats.custom}</StatNumber>
                    <StatLabel>Custom Projects</StatLabel>
                </StatCard>
            </StatsGrid>

            <div>
                <ActionButton onClick={handleSync} disabled={syncing}>
                    {syncing ? "Syncing..." : "Sync with GitHub"}
                </ActionButton>
                <ActionButton onClick={loadProjects}>
                    Refresh Projects
                </ActionButton>
            </div>

            <ProjectTable>
                <thead>
                    <tr>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>Type</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader>Created</TableHeader>
                        <TableHeader>Actions</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <TableCell>
                                <ProjectLink
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {project.name}
                                </ProjectLink>
                                <br />
                                <small style={{ color: "#999" }}>
                                    {project.description}
                                </small>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        project.isGitHubRepo
                                            ? "github"
                                            : "custom"
                                    }
                                >
                                    {project.isGitHubRepo ? "GitHub" : "Custom"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {project.pinned && <Badge>📌 Pinned</Badge>}
                            </TableCell>
                            <TableCell>
                                {project.createdAt.toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <ActionButton
                                    onClick={() => handleTogglePin(project)}
                                    style={{
                                        fontSize: "0.8rem",
                                        padding: "0.25rem 0.5rem",
                                        backgroundColor: project.pinned
                                            ? "#ff6b6b"
                                            : "#51cf66",
                                    }}
                                >
                                    {project.pinned ? "Unpin" : "Pin"}
                                </ActionButton>
                                <ActionButton
                                    onClick={() => handleDelete(project)}
                                    style={{
                                        fontSize: "0.8rem",
                                        padding: "0.25rem 0.5rem",
                                        backgroundColor: "#ff6b6b",
                                    }}
                                >
                                    Delete
                                </ActionButton>
                            </TableCell>
                        </tr>
                    ))}
                </tbody>
            </ProjectTable>

            {projects.length === 0 && (
                <div
                    style={{
                        textAlign: "center",
                        margin: "2rem 0",
                        color: "#666",
                    }}
                >
                    <p>No projects found. Sync with GitHub to get started.</p>
                </div>
            )}
        </DashboardContainer>
    );
}

export default AdminProjectDashboard;
