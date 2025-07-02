# Contact Form Email Setup Guide

Your contact form is now ready to accept user input and handle form submissions. Here are the options to actually send emails:

## Option 1: EmailJS (Recommended - Frontend Only)

EmailJS allows you to send emails directly from the frontend without a backend server.

### Setup Steps:

1. **Install EmailJS:**
   ```bash
   npm install @emailjs/browser
   ```

2. **Create EmailJS Account:**
   - Go to [emailjs.com](https://www.emailjs.com/)
   - Create a free account
   - Set up an email service (Gmail, Outlook, etc.)
   - Create an email template
   - Get your Service ID, Template ID, and Public Key

3. **Update Contact.js:**
   ```javascript
   import emailjs from '@emailjs/browser';
   
   // Add to the top of your component
   useEffect(() => {
     emailjs.init('YOUR_PUBLIC_KEY');
   }, []);
   
   // Uncomment and update the EmailJS section in handleSubmit:
   await emailjs.send(
     'YOUR_SERVICE_ID',
     'YOUR_TEMPLATE_ID',
     {
       from_name: formData.name,
       from_email: formData.email,
       message: formData.message,
     }
   );
   ```

4. **Email Template Variables:**
   In your EmailJS template, use these variables:
   - `{{from_name}}` - User's name
   - `{{from_email}}` - User's email
   - `{{message}}` - User's message

## Option 2: Backend API

If you prefer a backend solution, you can create an API endpoint.

### Node.js/Express Example:

1. **Install dependencies:**
   ```bash
   npm install nodemailer express cors
   ```

2. **Create server.js:**
   ```javascript
   const express = require('express');
   const nodemailer = require('nodemailer');
   const cors = require('cors');
   
   const app = express();
   app.use(cors());
   app.use(express.json());
   
   app.post('/api/contact', async (req, res) => {
     const { name, email, message } = req.body;
     
     // Configure your email transporter
     const transporter = nodemailer.createTransporter({
       service: 'gmail',
       auth: {
         user: 'your-email@gmail.com',
         pass: 'your-app-password'
       }
     });
     
     try {
       await transporter.sendMail({
         from: 'your-email@gmail.com',
         to: 'your-email@gmail.com',
         subject: `Contact Form: ${name}`,
         text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
       });
       
       res.status(200).json({ success: true });
     } catch (error) {
       res.status(500).json({ error: 'Failed to send email' });
     }
   });
   
   app.listen(3001, () => {
     console.log('Server running on port 3001');
   });
   ```

3. **Update Contact.js:**
   Uncomment the backend API section in the handleSubmit function.

## Option 3: Third-Party Services

### Formspree
- Go to [formspree.io](https://formspree.io/)
- Create a form and get the form ID
- Update your form action to point to Formspree

### Netlify Forms (if hosting on Netlify)
- Add `netlify` attribute to your form
- Add a hidden input with `name="form-name"`

## Current Status

The contact form is now set up with:
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Success feedback
- ✅ Form reset functionality
- ✅ EmailJS integration (implemented and ready to use)

### EmailJS Setup Required

To use the contact form, you need to:

1. **Create EmailJS Account:**
   - Go to [emailjs.com](https://www.emailjs.com/)
   - Create a free account
   - Set up an email service (Gmail, Outlook, etc.)
   - Create an email template with variables: `{{from_name}}`, `{{from_email}}`, `{{message}}`
   - Get your Service ID, Template ID, and Public Key

2. **Configure Environment Variables:**
   Create a `.env` file in the project root with:
   ```
   REACT_APP_EMAILJS_SERVICE_ID=your-service-id
   REACT_APP_EMAILJS_TEMPLATE_ID=your-template-id
   REACT_APP_EMAILJS_PUBLIC_KEY=your-public-key
   ```

3. **Deploy:**
   The contact form will automatically send emails to your configured reply email address!

## Environment Variables

For any option you choose, remember to use environment variables for sensitive data:

```javascript
// .env
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

Then use them in your code:
```javascript
process.env.REACT_APP_EMAILJS_SERVICE_ID
```

Choose the option that best fits your needs and follow the setup instructions above!
