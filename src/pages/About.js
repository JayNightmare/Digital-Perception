import React from 'react';
import '../styles/about.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About Augmented Perception</h1>
        <p>Augmented Perception is a group of developers dedicated to invention and innovation in technology. Based in the United Kingdom.</p>
        <p>Find us on <a href="https://github.com/Augmented-Perception" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
        
        <div className="about-team-section">
          <h2>Our Mission</h2>
          <p>We strive to push the boundaries of what's possible in technology, creating innovative solutions that enhance human perception and interaction with digital environments.</p>
        </div>
      </div>
    </div>
  );
}

export default About; 