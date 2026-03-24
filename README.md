# 🦅 EagleRide - Juniata College Carpooling
 
EagleRide is a carpooling platform designed for Juniata College students to share rides, reduce costs, and build community.
 
## Project Structure
 
```text
eagleride/
├── backend/            # Node.js + Express API
│   ├── .env            # Database credentials (hidden)
│   └── server.js       # API Entry point
└── frontend/           # Vue.js 3 + Vite Application
    ├── src/
    │   ├── api.js      # Centralized API service
    │   ├── assets/     # Global CSS and Juniata branding
    │   ├── components/ # Reusable UI parts (NavBar, Footer)
    │   ├── layouts/    # Page structures (Main vs Auth)
    │   ├── views/      # Application pages
    │   └── stores/     # Pinia State Management
    └── .env            # Backend URL configuration
```
 
## Getting Started
 
### Prerequisites
 
- **Node.js** (v18 or higher) — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **Yarn**
- **Vue.js 3** (Managed via Vite in this project)
- **MySQL** (Local or Alwaysdata access)
- **Git** (To push/pull from this repository)
 
### 1. Backend Setup
 
```bash
cd backend
npm install
node server.js
```
 
### 2. Frontend Setup
 
```bash
cd frontend
npm install
npm run dev
```

## API Documentation
 
All endpoints are prefixed with `/api`.
 
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | List all users |
| `GET` | `/api/rides` | List available journeys |
| `POST` | `/api/auth/login` | Authenticate a user |
 
## Contributing
 
1. Create a branch: `git checkout -b feature/name-of-task`
2. Commit your changes: `git commit -m "description"`
3. Push to the branch: `git push origin feature/name-of-task`
4. Open a **Pull Request** on GitHub.
 
