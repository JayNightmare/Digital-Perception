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
`;

export const Nav = styled.nav`
    background: #000;
    border-bottom: 1px solid #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0.5rem 0;
`;

export const NavList = styled.ul`
    display: flex;
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0 2rem;
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
