import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Hire from "./pages/Hire";
import Mission from "./pages/Mission";
import AdminProjectDashboard from "./components/AdminProjectDashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
    GlobalStyle,
    Nav,
    NavList,
    NavItem,
    NavLink,
    LogoutButton,
    PageContainer,
} from "./styles/AppStyles";
import "./styles/App.css";
import AnimatedCursor from "react-animated-cursor";
import Particles from "./components/particles";

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
                        outerScale={3}
                    />
                </div>
                <Nav>
                    <NavList>
                        <NavItem>
                            <NavLink to="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/projects">Projects</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/about">About</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/contact">Contact</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/admin">Admin</NavLink>
                        </NavItem>
                        {user && (
                            <NavItem>
                                <LogoutButton onClick={handleLogout}>
                                    Logout
                                </LogoutButton>
                            </NavItem>
                        )}
                    </NavList>
                </Nav>
                <PageContainer>
                    <Particles className="particles" quantity={100} />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/projects"
                            element={
                                <ErrorBoundary>
                                    <Projects isAdmin={!!user} />
                                </ErrorBoundary>
                            }
                        />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route
                            path="/admin"
                            element={
                                authChecked ? (
                                    user ? (
                                        <ErrorBoundary>
                                            <AdminDashboard />
                                        </ErrorBoundary>
                                    ) : (
                                        <Login
                                            onLogin={() =>
                                                window.location.reload()
                                            }
                                        />
                                    )
                                ) : (
                                    <div>Loading...</div>
                                )
                            }
                        />
                        <Route path="/hire" element={<Hire />} />
                        <Route path="/mission" element={<Mission />} />
                    </Routes>
                </PageContainer>
                {/* Footer */}
                <footer className="footer">
                    <p>
                        &copy; {new Date().getFullYear()} Digital Perception.
                        All rights reserved.
                    </p>
                    <p>
                        Follow us on{" "}
                        <Link to="https://github.com/Augmented-Perception">
                            GitHub
                        </Link>{" "}
                        and <Link to="">Twitter</Link>.
                    </p>
                    <nav className="footer-nav">
                        <Link to="/hire">Careers</Link> |{" "}
                        <Link to="">Terms</Link> |{" "}
                        <Link to="/contact">Contact</Link>
                    </nav>
                </footer>
            </Router>
        </>
    );
}

function AdminDashboard() {
    return <AdminProjectDashboard />;
}

export default App;
