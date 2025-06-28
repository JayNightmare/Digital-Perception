import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import logo from './logo.svg';
import './App.css';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
    background: #f7f8fa;
    color: #222;
  }
`;

const Nav = styled.nav`
  background: #222;
  padding: 0.5rem 0;
`;
const NavList = styled.ul`
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0 2rem;
`;
const NavItem = styled.li``;
const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  &:hover {
    color: #61dafb;
  }
`;
const LogoutButton = styled.button`
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.8rem;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background: #d9363e;
  }
`;
const PageContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  padding: 2rem 2.5rem;
`;

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <>
      <GlobalStyle />
      <Router>
        <Nav>
          <NavList>
            <NavItem><NavLink to="/">Home</NavLink></NavItem>
            <NavItem><NavLink to="/projects">Projects</NavLink></NavItem>
            <NavItem><NavLink to="/about">About</NavLink></NavItem>
            <NavItem><NavLink to="/contact">Contact</NavLink></NavItem>
            <NavItem><NavLink to="/admin">Admin</NavLink></NavItem>
            {user && <NavItem><LogoutButton onClick={handleLogout}>Logout</LogoutButton></NavItem>}
          </NavList>
        </Nav>
        <PageContainer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects isAdmin={!!user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={
              authChecked ? (user ? <AdminDashboard /> : <Login onLogin={() => window.location.reload()} />) : <div>Loading...</div>
            } />
          </Routes>
        </PageContainer>
      </Router>
    </>
  );
}

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Manage projects: add, edit, delete, or pin projects to the Projects page.</p>
    </div>
  );
}

export default App;
