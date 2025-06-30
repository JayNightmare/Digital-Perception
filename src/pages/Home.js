import React from 'react';
import '../styles/home.css';

function Home() {
  return (
    <div className="home-container">
      <div className='home-header'>
        <img src={require('../assets/ap-eye-animated.gif')} height="128px" alt="Animated eye representing augmented perception" />
        <h1>Welcome to Augmented Perception</h1>
        <p>Developers dedicated to Invention and Innovation to technology.</p>
        <p>Explore our projects, learn about us, or get in touch!</p>
      </div>

      {/* Quick Nav Links */ }
      <div className="quick-nav">
        <a href="/Digital-Perception/projects" className="quick-link">Projects</a>
        <a href="/Digital-Perception/about" className="quick-link">About Us</a>
        <a href="/Digital-Perception/contact" className="quick-link">Contact</a>
      </div>

      {/* Coming Soon */}
      <div className="coming-soon">
        <h2>Coming Soon</h2>
        <p>Stay tuned for more exciting features and updates!</p>
      </div>
    </div>
  );
}

export default Home;