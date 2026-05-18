# GigFlow - Smart Leads Dashboard

A full-stack Lead Management Dashboard built with a clean MERN-style architecture, TypeScript, Docker, and a polished responsive UI.

This project was created as a submission for a Full Stack Internship assignment and includes authentication, role-based access, lead CRUD operations, search/filtering, pagination, and CSV export.

## 🚀 Live Deployment
- **Frontend:** [https://gig-flow-frontend-lovat.vercel.app/]
- **Backend API:** [https://gigflow-backend-to15.onrender.com]

## 💻 Tech Stack
- **Frontend:** React, Vite, TypeScript, TailwindCSS, Context API, React Router, Axios, Lucide React
- **Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Zod
- **Infrastructure:** Docker, Docker Compose, Nginx

## ✨ Core Features
- JWT-based authentication with secure password hashing
- Role-Based Access Control (RBAC): `Admin` and `Sales` roles
- CRUD for leads: create, read, update, delete
- Search, filter by status/source, and pagination
- CSV export endpoint for lead data
- Responsive UI with loading, error, and empty states
- Dockerized backend and frontend for easy local setup

## 📦 What’s Included
- `backend/` — Express API with authentication, validation, and lead management
- `frontend/` — React TypeScript dashboard with auth, data grid, filters, and modals
- `docker-compose.yml` — Compose setup for local container development

## 🛠️ Local Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas cluster or local MongoDB instance
- Docker Desktop (optional, but recommended)

### 1. Backend Environment
Create a `.env` file inside `backend/` with:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

### 2. Frontend Environment
Create a `.env` file inside `frontend/` with:

```env
VITE_API_URL=http://localhost:8000/api
```

### 3. Running with Docker (Recommended)
From the project root directory:

```bash
docker-compose up --build -d
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api

### 4. Running Locally Without Docker

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🚀 Available Scripts

### Backend
- `npm run dev` — start backend in development mode with `tsx watch`
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run the built backend server

### Frontend
- `npm run dev` — start the Vite development server
- `npm run build` — build the production frontend bundle
- `npm run preview` — preview the production build locally

## 🧠 Authentication Flow
- `Sales` and `Admin` users can log in and manage leads
- Only users with role `Admin` can delete leads
- Auth state is stored in local storage and sent in `Authorization: Bearer <token>` headers

## 📡 API Documentation

### Auth Routes
Base URL: `/api/users`

| Method | Endpoint   | Description                     | Request Body | Auth Required |
|--------|------------|---------------------------------|--------------|---------------|
| POST   | `/register`| Register a new user             | `name`, `email`, `password`, `role` (optional) | No |
| POST   | `/login`   | Authenticate and receive a JWT  | `email`, `password` | No |

### Lead Routes
Base URL: `/api/leads` (protected)

| Method | Endpoint              | Description | Query / Body | Auth Required |
|--------|-----------------------|-------------|--------------|---------------|
| GET    | `/`                   | Get paginated leads with filters | `page`, `search`, `status`, `source`, `sort` | Yes |
| GET    | `/export/csv`         | Export lead data as CSV | none | Yes |
| POST   | `/`                   | Create a new lead | `name`, `email`, `status`, `source` | Yes |
| GET    | `/:id`                | Get lead by ID | none | Yes |
| PUT    | `/:id`                | Update a lead | any lead fields | Yes |
| DELETE | `/:id`                | Delete a lead | none | Yes, Admin only |

### Important Request Shapes
#### Register
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "strongpassword",
  "role": "Admin"
}
```

#### Login
```json
{
  "email": "jane@example.com",
  "password": "strongpassword"
}
```

#### Create Lead
```json
{
  "name": "Acme Corp",
  "email": "lead@example.com",
  "status": "New",
  "source": "Website"
}
```

#### Update Lead
```json
{
  "status": "Contacted",
  "source": "Referral"
}
```

## ✅ Notes
- The backend validates all payloads using Zod schemas.
- The frontend uses debounced search and client-side filters to minimize API load.
- Admin users can delete leads; Sales users can view and edit.

## 📚 Folder Structure

- `backend/`
  - `src/server.ts` — app entrypoint
  - `src/routes/` — route definitions
  - `src/controllers/` — request handlers
  - `src/models/` — Mongoose schemas
  - `src/middlewares/` — auth and validation middleware
  - `src/validators/` — Zod schema validation

- `frontend/`
  - `src/main.tsx` — React app bootstrap
  - `src/pages/` — Login and Dashboard pages
  - `src/components/` — reusable UI components
  - `src/context/` — authentication context
  - `src/utils/` — Axios API client

---