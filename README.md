# SETU

SETU is a multi-stakeholder collaborative web platform connecting Citizens, Universities, Industries, and Government.

---

## Project Structure

```
SETU/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── layout/
│   │   │
│   │   ├── pages/
│   │   │   ├── Splash/
│   │   │   ├── Landing/
│   │   │   ├── Auth/
│   │   │   ├── Citizen/
│   │   │   ├── University/
│   │   │   ├── Industry/
│   │   │   └── Government/
│   │   │
│   │   ├── routes/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── other configuration files
│
├── backend/
│
├── .gitignore
└── README.md
```

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, JavaScript / JSX
- **Backend**: (To be configured by backend team)

---

## Module Guidelines

The `frontend/src/pages/` directory is modularized by application area:

| Folder | Purpose |
|---|---|
| `Splash/` | Future splash screen |
| `Landing/` | Future public landing page |
| `Auth/` | Future authentication (login, registration) |
| `Citizen/` | Citizen module & dashboard |
| `University/` | University module & dashboard |
| `Industry/` | Industry module & dashboard |
| `Government/` | Government module & dashboard |

### Shared Folders

- `components/common/`: Reusable, generic UI components (buttons, modals, inputs, etc.)
- `components/layout/`: Shared layout wrappers (navbars, sidebars, footers)
- `routes/`: Centralized routing configuration
- `services/`: API integration services and network clients
- `context/`: React context providers for shared application state
- `hooks/`: Custom reusable React hooks
- `utils/`: Helper functions, formatting tools, and constants

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## Collaboration & Git Workflow

- Always pull the latest changes from `main` before starting new feature development.
- Create feature branches with descriptive names (e.g., `feature/citizen-dashboard`, `feature/auth-login`).
- Keep role-specific code contained within its respective folder under `pages/`.
- Ensure clean commits without unnecessary build artifacts or temporary files.
