import React, { useState } from 'react';
import '../styles/contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Option 1: EmailJS (uncomment after setup)
      // await emailjs.send(
      //   'YOUR_SERVICE_ID',
      //   'YOUR_TEMPLATE_ID',
      //   {
      //     from_name: formData.name,
      //     from_email: formData.email,
      //     message: formData.message,
      //   },
      //   'YOUR_PUBLIC_KEY'
      // );

      // Option 2: Your own backend API (uncomment when ready)
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to send message');
      // }

      // For now, just simulate success
      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
      }, 1000);

    } catch (err) {
      setError('Failed to send message. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <h1>Contact Us</h1>
        {submitted ? (
          <div className="contact-success">
            <p>Thank you for reaching out! We'll get back to you soon.</p>
            <button 
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', message: '' });
              }}
              className="reset-button"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div>
              <label>Name:</label>
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder='Enter Name' 
                type="text" 
                required 
                disabled={loading}
              />
            </div>
            <div>
              <label>Email:</label>
              <input 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder='Enter Email' 
                type="email" 
                required 
                disabled={loading}
              />
            </div>
            <div>
              <label>Message:</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder='Enter Message' 
                required 
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;