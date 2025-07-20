# Firestore 400 Error Troubleshooting Guide

The 400 error you're seeing suggests a Firestore configuration or permission issue. Here's how to fix it:

## Step 1: Verify Firebase Console Setup

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `digital-perception-61a1f`
3. **Check Firestore Database**:
   - Go to "Firestore Database" in the left sidebar
   - If you see "Create database" button, Firestore is NOT set up yet
   - If you see the database interface, it's already set up

## Step 2: Create Firestore Database (if needed)

If Firestore isn't set up:

1. Click "Create database"
2. **Start in test mode** (for now)
3. Choose a location (any location is fine)
4. Wait for creation to complete

## Step 3: Check Security Rules

Go to "Firestore Database" → "Rules" tab. You should see something like:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access on all documents to any user signed in to the application
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**For testing purposes, temporarily use these permissive rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Temporary: Allow read/write access to all users
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **IMPORTANT**: These rules are for testing only. Change them back to require authentication in production.

## Step 4: Verify Environment Variables

Check your `.env` file has all required variables:

```env
REACT_APP_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=digital-perception-61a1f.firebaseapp.com
REACT_APP_PROJECT_ID=digital-perception-61a1f
REACT_APP_STORAGE_BUCKET=digital-perception-61a1f.appspot.com
REACT_APP_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_APP_ID=your_app_id
REACT_APP_MEASUREMENT_ID=your_measurement_id
```

## Step 5: Test the Connection

1. **Restart your development server**: `npm start`
2. **Open the Projects page**
3. **Check the debug panel** (should appear if there are errors)
4. **Check browser console** for detailed error messages

## Common Error Solutions

### "permission-denied"
- Firestore security rules are too restrictive
- Use the test rules above temporarily
- Make sure you're authenticated if rules require it

### "failed-precondition"
- Firestore database doesn't exist
- Create the database in Firebase Console
- Wait a few minutes for it to be fully provisioned

### "unavailable"
- Network connectivity issue
- Firebase service temporarily down
- Check your internet connection

### "unauthenticated"
- Security rules require authentication
- Either authenticate as admin or use permissive test rules

## Step 6: Quick Test

If the debug panel shows errors, try this in your browser console:

```javascript
// Test Firebase config
console.log('Firebase config:', JSON.stringify({
  projectId: process.env.REACT_APP_PROJECT_ID,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN
}, null, 2));
```

## Need More Help?

If the error persists:

1. **Check Firebase Console Logs**:
   - Go to Firebase Console → "Usage and billing" → "Usage"
   - Look for error logs or quota issues

2. **Share these details**:
   - Exact error message from browser console
   - Output from the debug panel
   - Your Firebase project ID
   - Whether Firestore database exists in console

The debug panel in the Projects page will help identify the exact issue!
