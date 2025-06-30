<div align=center>

<img src="./public/ap-eye-animated.gif">

# Augmented Perception Website

</div>


React website for Augmented Perception, an Open-Source Organisation that provides AI-powered solutions to the AR/VR community. This website is designed to show off the orgs capabilities and provide a platform for users to learn more about the org and its projects.

## Features

- **Homepage**: Welcome page introducing the organization
- **Projects Page**: Displays all repositories from the Augmented Perception GitHub organization
- **About Page**: Information about the organization and team
- **Contact Page**: Contact form for reaching out
- **Admin Dashboard**: Protected admin area with project management capabilities
- **Authentication**: Secure admin login using Firebase Authentication
- **Project Management**: Admins can pin, edit, delete, and add projects
- **Modern UI**: Clean, responsive design using styled-components

## Tech Stack

- **Frontend**: React 18 with React Router for navigation
- **Styling**: styled-components for modern CSS-in-JS
- **Authentication**: Firebase Authentication (Email/Password)
- **Build Tool**: Create React App with PWA template
- **Package Manager**: npm

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Firebase project (for authentication)

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
   ```

5. **Create admin user**
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
│   ├── Home.js      # Homepage
│   ├── Projects.js  # Projects listing with admin controls
│   ├── About.js     # About page
│   ├── Contact.js   # Contact form
│   └── Login.js     # Admin login
├── App.js           # Main app component with routing
├── firebase.js      # Firebase configuration
└── index.js         # App entry point
```

## Admin Features

### Authentication
- Secure login using Firebase Authentication
- Protected admin routes
- Automatic session management

### Project Management
- **Pin Projects**: Pin important projects to appear at the top
- **Edit Projects**: Modify project name, description, and URL
- **Delete Projects**: Remove projects from the listing
- **Add Projects**: Create new projects (stored locally for demo)

### Access Control
- Admin controls are only visible to authenticated users
- Non-admin users can view projects but cannot modify them

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