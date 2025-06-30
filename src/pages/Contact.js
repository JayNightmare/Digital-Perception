import React, { useState } from 'react';
import '../styles/contact.css';

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <h1>Contact Us</h1>
        {submitted ? (
          <div className="contact-success">
            <p>Thank you for reaching out! We'll get back to you soon.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input placeholder='Enter Name' type="text" required />
            </div>
            <div>
              <label>Email:</label>
              <input placeholder='Enter Email' type="email" required />
            </div>
            <div>
              <label>Message:</label>
              <textarea placeholder='Enter Message' required />
            </div>
            <button type="submit">Send</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;