import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  GlobalStyle,
  Nav,
  NavList,
  NavItem,
  NavLink,
  LogoutButton,
  PageContainer
} from './styles/AppStyles';
import './styles/App.css';
import AnimatedCursor from "react-animated-cursor";

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
      <Router basename="/Digital-Perception">
        <div className="cursor__dot">
          <AnimatedCursor
            innerSize={15}
            outerSize={15}
            color="255, 255 ,255"
            outerAlpha={0.4}
            innerScale={0.7}
            outerScale={5}
          />
        </div>
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
