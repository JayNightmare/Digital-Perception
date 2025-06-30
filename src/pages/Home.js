import React from 'react';
import { Link } from 'react-router-dom';
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
        <Link to="/projects" className="quick-link">Projects</Link>
        <Link to="/about" className="quick-link">About Us</Link>
        <Link to="/contact" className="quick-link">Contact</Link>
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