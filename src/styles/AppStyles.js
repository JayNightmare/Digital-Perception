import styled, { createGlobalStyle } from "styled-components";
import { Link } from "react-router-dom";

export const GlobalStyle = createGlobalStyle`
    * {
                cursor: none !important;
                user-select: none;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                sans-serif;
        }
        
        body {
                margin: 0;
                background: #000;
                color: #fff;
                display: flex;
                flex-direction: column;
                min-height: 100vh;
        }

        footer {
                background: #111;
                color: #ccc;
                padding: 1rem;
                text-align: center;
                font-size: 0.9rem;
                margin-top: auto;

                a {
                        color: #61dafb;
                        text-decoration: none;
                        &:hover {
                                color: #21a1f1;
                        }
                }
        }

        .particles {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: -1;
                overflow: hidden;
        }

        /* Add this to your global CSS file or App.css */
        [data-cursor="true"], 
        .animated-cursor,
        .react-animated-cursor {
            z-index: 999999 !important;
            pointer-events: none !important;
            position: fixed !important;
        }

        /* Target the inner and outer cursor elements specifically */
        [data-cursor="true"] > div,
        .animated-cursor > div {
            z-index: 999999 !important;
        }
`;

export const Nav = styled.nav`
    background: #000;
    border-bottom: 1px solid #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0.5rem 0;
    position: relative;
`;

export const NavList = styled.ul`
    display: flex;
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0 2rem;

    @media (max-width: 550px) {
        display: none;
    }
`;

export const NavItem = styled.li``;

export const NavLink = styled(Link)`
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    &:hover {
        color: #61dafb;
    }
`;

export const LogoutButton = styled.button`
    background: #ff4d4f;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 0.3rem 0.8rem;
    font-weight: 500;
    cursor: pointer;
    &:hover {
        background: #d9363e;
    }
`;

// Mobile Navigation Styles
export const HamburgerButton = styled.button`
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 30px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-left: 2rem;
    z-index: 1001;

    @media (max-width: 550px) {
        display: flex;
    }

    span {
        width: 100%;
        height: 3px;
        background: ${(props) => (props.$isOpen ? "#61dafb" : "#fff")};
        border-radius: 10px;
        transition: all 0.3s linear;
        transform-origin: 1px;

        &:first-child {
            transform: ${(props) =>
                props.$isOpen ? "rotate(45deg)" : "rotate(0)"};
        }

        &:nth-child(2) {
            opacity: ${(props) => (props.$isOpen ? "0" : "1")};
            transform: ${(props) =>
                props.$isOpen ? "translateX(20px)" : "translateX(0)"};
        }

        &:nth-child(3) {
            transform: ${(props) =>
                props.$isOpen ? "rotate(-45deg)" : "rotate(0)"};
        }
    }
`;

export const MobileOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: none;

    @media (max-width: 550px) {
        display: block;
    }
`;

export const MobileSidebar = styled.div`
    position: absolute;
    top: 0;
    right: ${(props) => (props.$isOpen ? "0" : "-300px")};
    width: 280px;
    height: 100%;
    background: #111;
    z-index: 1000;
    transition: right 0.3s ease-in-out;
    border-left: 1px solid #333;
    display: none;

    @media (max-width: 550px) {
        display: block;
    }
`;

export const MobileNavList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 80px 0 0 0;
    display: flex;
    flex-direction: column;
`;

export const MobileNavItem = styled.li`
    border-bottom: 1px solid #333;
`;

export const MobileNavLink = styled(Link)`
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    display: block;
    padding: 1rem 2rem;
    transition: all 0.3s ease;

    &:hover {
        color: #61dafb;
        background: #1a1a1a;
    }
`;

export const MobileLogoutButton = styled.button`
    background: #ff4d4f;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 0.75rem 2rem;
    font-weight: 500;
    cursor: pointer;
    width: calc(100% - 4rem);
    margin: 1rem 2rem;
    transition: background 0.3s ease;

    &:hover {
        background: #d9363e;
    }
`;

export const PageContainer = styled.div`
    max-width: 1200px;
    margin: 2rem auto;
    // border-radius: 12px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
`;
