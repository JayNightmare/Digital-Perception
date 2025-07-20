import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "../styles/contact.css";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Initialize EmailJS
    useEffect(() => {
        emailjs.init(
            process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "your-public-key"
        );
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Send email using EmailJS
            await emailjs.send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID || "your-service-id",
                process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "your-template-id",
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                }
            );

            setSubmitted(true);
            setLoading(false);
        } catch (err) {
            console.error("EmailJS Error:", err);
            setError("Failed to send message. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="contact-container">
            <div className="contact-content">
                <h1>Contact Us</h1>
                {submitted ? (
                    <div className="contact-success">
                        <p>
                            Thank you for reaching out! We'll get back to you
                            soon.
                        </p>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setFormData({
                                    name: "",
                                    email: "",
                                    message: "",
                                });
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
                                placeholder="Enter Name"
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
                                placeholder="Enter Email"
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
                                placeholder="Enter Message"
                                required
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Contact;
