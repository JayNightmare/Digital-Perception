import React from "react";
import "../styles/about.css";
import { Link } from "react-router-dom";

function About() {
    return (
        <div className="about-container">
            <div className="about-content">
                <h1>About Augmented Perception</h1>
                <p>
                    Augmented Perception is a group of developers dedicated to
                    invention and innovation in technology. Based in the United
                    Kingdom.
                </p>
                <p>
                    Find us on{" "}
                    <a
                        href="https://github.com/Augmented-Perception"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                    .
                </p>

                <div className="about-card about-mission-section">
                    <h2>Our Mission</h2>
                    <p>
                        We strive to push the boundaries of what's possible in
                        technology, creating innovative solutions that enhance
                        human perception and interaction with digital
                        environments.
                    </p>
                    {/* Talk about AR glasses and software development. */}
                    <p>
                        Our main focus is to develop software for augmented
                        reality glasses, enabling users to experience a seamless
                        blend of the digital and physical worlds. We believe in
                        the transformative power of AR technology and its
                        potential to revolutionize how we interact with
                        information and our surroundings. Currently, building
                        the hardware is a challenge, due to lack of funding and
                        resources, but we are committed to overcoming these
                        obstacles through innovation and collaboration.
                    </p>

                    {/* Link to Mission Statement */}
                    <p>
                        You can find out more about our mission{" "}
                        <Link to="/mission">here</Link>
                    </p>
                </div>

                <div className="about-card about-team-section">
                    <h2>The Team</h2>

                    <p>
                        Currently, Augmented Perception is managed, developed,
                        and designed by a solo developer, but we are actively
                        looking to expand the team with passionate individuals
                        who share our vision for design, software developement
                        and AR technology.
                    </p>

                    <p align="center">
                        <strong>Want to be a part of the team?</strong>
                    </p>

                    <p>
                        Join us on{" "}
                        <a href="https://github.com/Augmented-Perception">
                            GitHub
                        </a>{" "}
                        and contribute to our projects. Whether you're a
                        seasoned developer or just starting out, we welcome all
                        who share our passion for technology and innovation.
                    </p>

                    <p>
                        Want to Join the team?{" "}
                        <Link to="/hire">Continue Here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;
