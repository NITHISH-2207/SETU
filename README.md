# SETU

### Connecting Citizens, Institutions, Industries, and Government for Collaborative Civic Action.

SETU is a multi-stakeholder digital platform designed to improve how civic and community issues are reported, managed, supported, and resolved.

The platform creates a collaborative ecosystem connecting **Citizens, Government Departments, Universities, and Industries/CSR partners**, enabling the right stakeholders to contribute toward resolving real-world community issues.

---

## Overview

Civic issues often involve multiple stakeholders, but communication and coordination between them can be fragmented.

SETU provides a unified platform where:

- Citizens can report and track community issues.
- Communities can support common issues through upvotes.
- Government departments can manage issues relevant to their category.
- Universities can contribute research, expertise, and academic support.
- Industries and CSR partners can contribute resources and implementation support.

The goal is to create a more collaborative, transparent, and structured approach to civic issue resolution.

---

## Key Features

### Citizen Portal

- Report community and civic issues.
- Add descriptions, location details, and supporting evidence.
- View common issues reported by other citizens.
- Filter issues by category.
- Support important community issues through upvotes.
- Track personally submitted complaints.
- View complaint progress and resolution updates.
- Voice-to-text support for complaint descriptions.

### Common Issues

The Common Issues section allows citizens to discover complaints reported by others.

- Browse complaints by category.
- Search community issues.
- View complaint information and submitted details.
- Support issues through upvotes.

Citizens can support community issues, while detailed complaint management and tracking remain accessible to the original complaint owner.

### Government Portal

Government departments have a dedicated workspace for managing complaints relevant to their assigned category.

Features include:

- Department-specific complaint access.
- Complaint overview and operational dashboard.
- Complaint priority management.
- Urgency and severity classification.
- Status lifecycle management.
- Submitted evidence and document viewing.
- Department operational notes.
- Resolution timeline monitoring.
- Secure complaint resolution workflow.

A complaint can only be marked as resolved after password verification.

### Multi-Stakeholder Collaboration

SETU is designed to support collaboration beyond the citizen-government workflow.

The platform includes areas for:

- **Universities** to contribute research, academic expertise, and technical recommendations.
- **Industries and CSR partners** to contribute resources, materials, and implementation support.
- **Government departments** to coordinate and manage the resolution process.

---

## How SETU Works

```text
Citizen Reports an Issue
          │
          ▼
Issue is Categorized
          │
          ▼
Relevant Government Department Receives It
          │
          ├───────────────┐
          ▼               ▼
   Community Support   Additional Contributions
      & Upvotes        University / Industry / CSR
          │               │
          └───────┬───────┘
                  ▼
          Issue Management
                  │
                  ▼
          Resolution Process
                  │
                  ▼
             Resolved
```

---

## Project Structure

```text
SETU/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
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

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- JavaScript / JSX

### Backend

Backend services and integrations are maintained separately within the `backend/` directory.

---

## Application Modules

| Module | Purpose |
|---|---|
| **Citizen** | Report issues, explore common complaints, support issues, and track submitted complaints |
| **Government** | Manage department-specific complaints and oversee the resolution process |
| **University** | Provide research, academic expertise, and technical contributions |
| **Industry / CSR** | Support civic issue resolution through resources and implementation contributions |
| **Auth** | User authentication and role-based access |
| **Landing** | Public-facing platform entry and role selection |

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 18 or later
- npm

### Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the frontend directory:

```bash
cd SETU/frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at the local development URL displayed in your terminal.

### Production Build

To create a production build:

```bash
npm run build
```

---

## Collaboration Guidelines

To maintain a clean and organized codebase:

- Pull the latest changes from `main` before starting work.
- Create descriptive feature branches.

Example:

```text
feature/citizen-dashboard
feature/government-portal
feature/common-issues
feature/complaint-management
```

- Keep module-specific code inside its respective application area.
- Avoid modifying unrelated files.
- Keep commits focused and meaningful.
- Do not commit unnecessary build files or temporary files.

---

## Project Vision

SETU aims to transform civic issue reporting from an isolated complaint process into a collaborative resolution ecosystem.

By connecting citizens with government departments, universities, and industry partners, SETU creates a structured pathway for community issues to receive the attention, expertise, resources, and coordination needed for meaningful action.

---

## Team

Built as part of **Smart India Hackathon 2026**.

---

**SETU — Turning Community Concerns into Collaborative Action.**
