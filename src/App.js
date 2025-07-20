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
    HamburgerButton,
    MobileSidebar,
    MobileOverlay,
    MobileNavList,
    MobileNavItem,
    MobileNavLink,
    MobileLogoutButton,
} from "./styles/AppStyles";
import "./styles/App.css";
import AnimatedCursor from "react-animated-cursor";
import Particles from "./components/particles";

function App() {
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setAuthChecked(true);
        });
        return () => unsubscribe();
    }, []);

    // Handle body scroll locking for mobile menu
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add("mobile-menu-open");
        } else {
            document.body.classList.remove("mobile-menu-open");
        }

        // Cleanup on component unmount
        return () => {
            document.body.classList.remove("mobile-menu-open");
        };
    }, [isMobileMenuOpen]);

    const handleLogout = () => {
        signOut(auth);
        setIsMobileMenuOpen(false); // Close mobile menu after logout
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
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
                        innerStyle={{
                            zIndex: 999999,
                        }}
                        outerStyle={{
                            zIndex: 999999,
                        }}
                    />
                </div>
                <Nav className="nav">
                    {/* Desktop Navigation */}
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

                    {/* Mobile Hamburger Button */}
                    <HamburgerButton
                        onClick={toggleMobileMenu}
                        $isOpen={isMobileMenuOpen}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </HamburgerButton>
                </Nav>

                {/* Mobile Sidebar Menu */}
                {isMobileMenuOpen && (
                    <MobileOverlay onClick={closeMobileMenu} />
                )}
                <MobileSidebar
                    $isOpen={isMobileMenuOpen}
                    className="mobile-sidebar"
                >
                    <MobileNavList>
                        <MobileNavItem>
                            <MobileNavLink to="/" onClick={closeMobileMenu}>
                                Home
                            </MobileNavLink>
                        </MobileNavItem>
                        <MobileNavItem>
                            <MobileNavLink
                                to="/projects"
                                onClick={closeMobileMenu}
                            >
                                Projects
                            </MobileNavLink>
                        </MobileNavItem>
                        <MobileNavItem>
                            <MobileNavLink
                                to="/about"
                                onClick={closeMobileMenu}
                            >
                                About
                            </MobileNavLink>
                        </MobileNavItem>
                        <MobileNavItem>
                            <MobileNavLink
                                to="/contact"
                                onClick={closeMobileMenu}
                            >
                                Contact
                            </MobileNavLink>
                        </MobileNavItem>
                        <MobileNavItem>
                            <MobileNavLink
                                to="/admin"
                                onClick={closeMobileMenu}
                            >
                                Admin
                            </MobileNavLink>
                        </MobileNavItem>
                        {user && (
                            <MobileNavItem>
                                <MobileLogoutButton onClick={handleLogout}>
                                    Logout
                                </MobileLogoutButton>
                            </MobileNavItem>
                        )}
                    </MobileNavList>
                </MobileSidebar>
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
