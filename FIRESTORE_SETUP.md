# Firestore Setup Guide

This guide will help you set up Firestore for the Digital Perception project to manage projects with full CRUD functionality.

## Firestore Database Setup

### 1. Enable Firestore in Firebase Console

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to "Firestore Database" in the left sidebar
4. Click "Create database"
5. Choose "Start in test mode" for development (we'll add security rules later)
6. Select a location for your database

### 2. Firestore Security Rules

Once you've set up authentication and tested the functionality, replace the default rules with these production-ready rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Projects collection - only authenticated users can write, anyone can read
    match /projects/{projectId} {
      allow read: if true; // Public read access for viewing projects
      allow write: if request.auth != null; // Only authenticated users can modify
      
      // Validate the data structure
      allow create, update: if request.auth != null 
        && validateProject(request.resource.data);
    }
    
    // Helper function to validate project data
    function validateProject(project) {
      return project.keys().hasAll(['name', 'description', 'url', 'pinned', 'isGitHubRepo', 'createdAt', 'updatedAt']) &&
             project.name is string &&
             project.description is string &&
             project.url is string &&
             project.pinned is bool &&
             project.isGitHubRepo is bool &&
             project.createdAt is timestamp &&
             project.updatedAt is timestamp;
    }
  }
}
```

### 3. Database Structure

The Firestore database will have the following structure:

```
projects (collection)
├── {projectId} (document)
    ├── name: string
    ├── description: string
    ├── url: string
    ├── pinned: boolean
    ├── isGitHubRepo: boolean
    ├── githubData: object (optional)
    │   ├── id: number
    │   ├── full_name: string
    │   ├── stargazers_count: number
    │   ├── language: string
    │   └── updated_at: string
    ├── createdAt: timestamp
    └── updatedAt: timestamp
```

## Initial Setup Steps

### 1. First-time Setup

When you first deploy the application:

1. **Admin Authentication**: Ensure you have at least one authenticated admin user
2. **GitHub Sync**: Use the "Sync with GitHub" button in the admin panel to import existing repositories
3. **Verify Data**: Check that projects are properly imported and displayed

### 2. Environment Variables

Ensure these environment variables are set in your `.env` file:

```env
REACT_APP_API_KEY=your_firebase_api_key
REACT_APP_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=your_app_id
REACT_APP_MEASUREMENT_ID=your_measurement_id
```

## Features Implemented

### CRUD Operations

1. **Create**: Add new projects (admin only)
2. **Read**: Display all projects (public)
3. **Update**: Edit project details, pin/unpin (admin only)
4. **Delete**: Remove projects (admin only)

### GitHub Integration

- **Import**: Import repositories from GitHub organization
- **Sync**: Update existing GitHub projects with latest data
- **Distinction**: Mark projects as GitHub repos vs custom projects

### Admin Features

- **Admin Dashboard**: Comprehensive project management interface
- **Statistics**: View project counts and types
- **Bulk Operations**: Sync all GitHub repositories at once
- **Error Handling**: User-friendly error messages and loading states

## Usage Instructions

### For Admins

1. **Login**: Access the admin panel through `/admin` route
2. **Sync GitHub**: Click "Sync with GitHub" to import/update repositories
3. **Add Projects**: Use "Add Project" to create custom projects
4. **Manage Projects**: Pin important projects, edit details, or delete as needed
5. **Monitor**: Use the admin dashboard to view statistics and manage all projects

### For Users

1. **View Projects**: Visit `/projects` to see all projects
2. **Pinned First**: Pinned projects appear at the top with a 📌 icon
3. **External Links**: Click project names to visit the actual projects
4. **GitHub Badge**: GitHub repositories are marked with a "GitHub Repository" badge

## Error Handling

The implementation includes comprehensive error handling:

- **Network Errors**: Graceful handling of API failures
- **Database Errors**: User-friendly Firestore error messages
- **Validation**: Form validation for required fields
- **Loading States**: Loading indicators for all async operations

## Performance Considerations

- **Efficient Queries**: Uses Firestore ordering and filtering
- **Minimal Reads**: Only fetches data when necessary
- **Error Recovery**: Automatic retry mechanisms for failed operations
- **User Feedback**: Real-time feedback for all operations

## Maintenance

### Regular Tasks

1. **Monitor Usage**: Check Firestore usage in Firebase Console
2. **Review Security**: Regularly review and update security rules
3. **Backup Data**: Consider setting up automated backups
4. **Update Dependencies**: Keep Firebase SDK updated

### Troubleshooting

- **Check Console**: Browser console for detailed error messages
- **Firebase Console**: Monitor Firestore operations and authentication
- **Network Tab**: Check API calls and responses
- **Security Rules**: Verify rules allow necessary operations

This implementation provides a robust, scalable solution for managing projects with Firestore while maintaining the existing GitHub integration.
