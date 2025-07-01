import React from 'react';
import '../styles/about.css';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About Augmented Perception</h1>
        <p>Augmented Perception is a group of developers dedicated to invention and innovation in technology. Based in the United Kingdom.</p>
        <p>Find us on <a href="https://github.com/Augmented-Perception" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
        
        <div className="about-card about-mission-section">
          <h2>Our Mission</h2>
          <p>We strive to push the boundaries of what's possible in technology, creating innovative solutions that enhance human perception and interaction with digital environments.</p>
        </div>

        <div className="about-card about-team-section">
          <h2>The Team</h2>
          <p>We are a diverse team of developers, designers, and innovators, each bringing unique skills and perspectives to our projects. Together, we aim to create impactful technology that makes a difference.</p>
          <p align="center"><strong>Want to be a part of the team?</strong></p>
          <p>Join us on <a href="">GitHub</a> and contribute to our projects. Whether you're a seasoned developer or just starting out, we welcome all who share our passion for technology and innovation.</p>
          <Link to="/hire">For more information, go </Link>
        </div>
      </div>
    </div>
  );
}

export default About;