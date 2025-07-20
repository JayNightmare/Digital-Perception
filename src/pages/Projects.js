import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import '../styles/projects.css';

const ProjectList = styled.ul`
  list-style: none;
  padding: 0;
`;
const ProjectItem = styled.li`
  background: ${({ pinned }) => (pinned ? '#ffeeba' : '#f4f6fb')};
  border-radius: 8px;
  margin-bottom: 1.2rem;
  padding: 1.2rem 1.5rem;
  box-shadow: 0 1px 6px rgba(0,0,0,0.04);
  position: relative;
`;
const ProjectTitle = styled.a`
  font-size: 1.2rem;
  font-weight: 600;
  color: #222;
  text-decoration: none;
  &:hover { color: #61dafb; }
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
  &:hover { background: #61dafb; color: #222; }
`;
const AddEditForm = styled.div`
  background: #f7f8fa;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  box-shadow: 0 1px 6px rgba(0,0,0,0.04);
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
  &:hover { background: #222; color: #fff; }
`;

function Projects({ isAdmin }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pinned, setPinned] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null); // repo id
  const [form, setForm] = useState({ name: '', description: '', url: '' });

  useEffect(() => {
    fetch('https://api.github.com/orgs/Augmented-Perception/repos')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch repos');
        return res.json();
      })
      .then((data) => {
        setRepos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handlePin = (repo) => {
    setPinned((prev) => prev.find((r) => r.id === repo.id) ? prev : [repo, ...prev]);
  };
  const handleUnpin = (repo) => {
    setPinned((prev) => prev.filter((r) => r.id !== repo.id));
  };
  const handleDelete = (repo) => {
    setRepos((prev) => prev.filter((r) => r.id !== repo.id));
    setPinned((prev) => prev.filter((r) => r.id !== repo.id));
  };
  const handleEdit = (repo) => {
    setShowEdit(repo.id);
    setForm({ name: repo.name, description: repo.description, url: repo.html_url });
  };
  const handleEditSubmit = (id) => {
    setRepos((prev) => prev.map((r) => r.id === id ? { ...r, name: form.name, description: form.description, html_url: form.url } : r));
    setPinned((prev) => prev.map((r) => r.id === id ? { ...r, name: form.name, description: form.description, html_url: form.url } : r));
    setShowEdit(null);
  };
  const handleAdd = () => {
    const newRepo = { id: Date.now(), name: form.name, description: form.description, html_url: form.url };
    setRepos((prev) => [newRepo, ...prev]);
    setForm({ name: '', description: '', url: '' });
    setShowAdd(false);
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  // Pinned first, then others
  const pinnedIds = new Set(pinned.map((r) => r.id));
  const unpinned = repos.filter((r) => !pinnedIds.has(r.id));

  return (
    <div className="projects-page">
      <h1>Projects</h1>
      {isAdmin && <FormButton onClick={() => setShowAdd(true)}>Add Project</FormButton>}
      <ProjectList className="projects-container">
        {pinned.map((repo) => (
          <ProjectItem key={repo.id} pinned>
            <span role="img" aria-label="pinned">📌</span> <ProjectTitle href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</ProjectTitle>
            <ProjectDesc>{repo.description}</ProjectDesc>
            {isAdmin && (
              <AdminControls>
                <AdminButton onClick={() => handleUnpin(repo)}>Unpin</AdminButton>
                <AdminButton onClick={() => handleEdit(repo)}>Edit</AdminButton>
                <AdminButton onClick={() => handleDelete(repo)}>Delete</AdminButton>
              </AdminControls>
            )}
            {showEdit === repo.id && (
              <AddEditForm>
                <FormInput value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" />
                <FormInput value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" />
                <FormInput value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="URL" />
                <FormButton onClick={() => handleEditSubmit(repo.id)}>Save</FormButton>
                <FormButton onClick={() => setShowEdit(null)}>Cancel</FormButton>
              </AddEditForm>
            )}
          </ProjectItem>
        ))}
        {unpinned.map((repo) => (
          <ProjectItem key={repo.id}>
            <ProjectTitle href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</ProjectTitle>
            <ProjectDesc>{repo.description}</ProjectDesc>
            {isAdmin && (
              <AdminControls>
                <AdminButton onClick={() => handlePin(repo)}>Pin</AdminButton>
                <AdminButton onClick={() => handleEdit(repo)}>Edit</AdminButton>
                <AdminButton onClick={() => handleDelete(repo)}>Delete</AdminButton>
              </AdminControls>
            )}
            {showEdit === repo.id && (
              <AddEditForm>
                <FormInput value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" />
                <FormInput value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" />
                <FormInput value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="URL" />
                <FormButton onClick={() => handleEditSubmit(repo.id)}>Save</FormButton>
                <FormButton onClick={() => setShowEdit(null)}>Cancel</FormButton>
              </AddEditForm>
            )}
          </ProjectItem>
        ))}
      </ProjectList>
      {showAdd && (
        <AddEditForm>
          <h3>Add Project</h3>
          <FormInput value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" />
          <FormInput value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" />
          <FormInput value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="URL" />
          <FormButton onClick={handleAdd}>Add</FormButton>
          <FormButton onClick={() => setShowAdd(false)}>Cancel</FormButton>
        </AddEditForm>
      )}
    </div>
  );
}

export default Projects; 