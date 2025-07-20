<div align=center>

<img src="./src/assets/ap-eye-animated.gif" width="100" height="100" alt="Animated Eye Icon">

# Augmented Perception Website

</div>


React website for Augmented Perception, an Open-Source Organisation that provides AI-powered solutions to the AR/VR community. This website is designed to show off the orgs capabilities and provide a platform for users to learn more about the org and its projects.

## Features

- **Homepage**: Welcome page introducing the organization
- **Projects Page**: Displays projects from Firestore database with GitHub integration
- **About Page**: Information about the organization and team
- **Contact Page**: Contact form for reaching out
- **Admin Dashboard**: Protected admin area with comprehensive project management
- **Authentication**: Secure admin login using Firebase Authentication
- **Project Management**: Full CRUD operations - create, read, update, delete projects
- **GitHub Integration**: Sync projects with GitHub repositories automatically
- **Pin Projects**: Highlight important projects at the top
- **Modern UI**: Clean, responsive design using styled-components
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Real-time Updates**: Live project data from Firestore

## Tech Stack

- **Frontend**: React 18 with React Router for navigation
- **Database**: Firebase Firestore for project data storage
- **Styling**: styled-components for modern CSS-in-JS
- **Authentication**: Firebase Authentication (Email/Password)
- **API Integration**: GitHub API for repository synchronization
- **Build Tool**: Create React App with PWA template
- **Package Manager**: npm

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Firebase project (for authentication and Firestore)
- GitHub organization access (for repository sync)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Augmented-Perception/Digital-Perception.git
   cd Digital-Perception
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication with Email/Password sign-in method
   - Enable Firestore Database (start in test mode for development)
   - Add a web app to your project
   - Copy the Firebase configuration

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_KEY=your_api_key
   REACT_APP_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_PROJECT_ID=your_project_id
   REACT_APP_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_APP_ID=your_app_id
   REACT_APP_MEASUREMENT_ID=your_measurement_id
   ```

5. **Set up Firestore (Optional)**
   For detailed Firestore setup instructions including security rules, see [FIRESTORE_SETUP.md](./FIRESTORE_SETUP.md)

6. **Create admin user**
   - In Firebase Console, go to Authentication > Users
   - Add a new user with email and password
   - This user will have admin access to the dashboard

## Development

**Start the development server**
```bash
npm run start
```

The app will open at [http://localhost:3000](http://localhost:3000).

**Available Scripts**
- `npm run start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── pages/           # Page components
├── src/
│   ├── components/
│   │   ├── particles.js          # Animated background particles
│   │   ├── AdminProjectDashboard.js # Comprehensive admin interface
│   │   └── ErrorBoundary.js      # Error handling component
│   ├── pages/
│   │   ├── Home.js     # Homepage
│   │   ├── Projects.js # Projects listing with Firestore integration
│   │   ├── About.js    # About page
│   │   ├── Contact.js  # Contact form
│   │   └── Login.js    # Admin login
│   ├── utils/
│   │   ├── projectService.js # Firestore CRUD operations
│   │   ├── testFirestore.js  # Testing utilities
│   │   └── mouse.js          # Mouse tracking utilities
│   ├── App.js          # Main app component with routing
│   ├── firebase.js     # Firebase configuration
│   └── index.js        # App entry point
├── FIRESTORE_SETUP.md  # Detailed Firestore setup guide
└── README.md           # This file
```

## Admin Features

### Authentication
- Secure login using Firebase Authentication
- Protected admin routes with error boundaries
- Automatic session management

### Project Management Dashboard
- **Comprehensive Statistics**: View total, pinned, GitHub, and custom project counts
- **GitHub Synchronization**: Import and sync repositories from GitHub organization
- **Real-time Updates**: Live project data from Firestore database
- **Bulk Operations**: Manage multiple projects efficiently

### CRUD Operations
- **Create**: Add new custom projects with full validation
- **Read**: View all projects with filtering and sorting
- **Update**: Edit project details, descriptions, and URLs
- **Delete**: Remove projects with confirmation dialogs
- **Pin/Unpin**: Highlight important projects

### GitHub Integration
- **Auto-Import**: Import all repositories from GitHub organization
- **Data Sync**: Update existing GitHub projects with latest repository data
- **Repository Tracking**: Distinguish between GitHub repos and custom projects
- **Metadata Storage**: Store GitHub-specific data (stars, language, etc.)

### Error Handling & UX
- **Error Boundaries**: Graceful handling of component crashes
- **Loading States**: User feedback during async operations
- **Success/Error Messages**: Clear feedback for all actions
- **Form Validation**: Prevent invalid data submission

### Access Control
- Admin controls are only visible to authenticated users
- Non-admin users can view projects but cannot modify them
- Protected routes with automatic redirection

## Deployment

### GitHub Pages (Recommended)
The project includes GitHub Actions workflows for automatic deployment:

1. **CI/CD Pipeline**: Runs on every push to main branch
   - Lints code
   - Runs tests
   - Builds the project

2. **Deployment**: Automatically deploys to GitHub Pages
   - Builds the project
   - Deploys to `gh-pages` branch

3. **Releases**: Creates releases for tagged versions
   - Triggers on version tags (e.g., `v1.0.0`)
   - Builds and packages the app

### Manual Deployment
```bash
npm run build
```

The built files will be in the `build/` directory, ready for deployment to any static hosting service.

### SPA Routing Fix

This project includes a fix for Single Page Application (SPA) routing issues on GitHub Pages. When users refresh the page on any route other than the root (e.g., `/about`, `/contact`), GitHub Pages would normally show a 404 error because it looks for physical files at those paths.

**Solution implemented:**
- `public/404.html`: Redirects 404 errors to the main page with the original path preserved
- `public/index.html`: Contains a script that restores the correct URL from the redirect

This ensures that all routes work correctly when users refresh the page or access URLs directly. The solution is based on the [spa-github-pages](https://github.com/rafgraph/spa-github-pages) approach.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_KEY` | Firebase API key | Yes |
| `REACT_APP_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `REACT_APP_PROJECT_ID` | Firebase project ID | Yes |
| `REACT_APP_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `REACT_APP_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `REACT_APP_APP_ID` | Firebase app ID | Yes |
| `REACT_APP_MEASUREMENT_ID` | Firebase measurement ID | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact the Augmented Perception team or create an issue in this repository.

## Links

- [Augmented Perception GitHub Organization](https://github.com/Augmented-Perception)
- [Live Demo](https://augmented-perception.github.io/Digital-Perception) (after deployment) 