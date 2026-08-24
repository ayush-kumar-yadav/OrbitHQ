# OrbitHQ

> **Phase-0 MVP — Production-Deployed Multi-Tenant SaaS Project Management Platform**

OrbitHQ is a multi-tenant project management platform designed around organizations, projects, tasks, role-based access control, caching, background jobs, and real-time notifications.

## 🚀 Live Demo

- **Live Application:** https://orbit-hq-two.vercel.app/
- **Backend API:** https://orbithq-backend.onrender.com/
- **Source Code:** https://github.com/ayush-kumar-yadav/OrbitHQ

> The current deployment represents the Phase-0 MVP. The platform is intentionally focused on a working, deployable core rather than a complete Jira/Asana replacement.

---

## ✨ Core Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Access and refresh token support
- Protected API routes
- Role-based access control (RBAC)
- Organization-level permissions
- Supported organization roles include Owner, Admin, Manager, Developer, and Viewer

### 🏢 Multi-Tenancy

- Organization-based tenant isolation
- Organization ownership
- Organization membership management
- Organization-scoped projects and tasks
- Tenant-aware authorization

### 📁 Project Management

- Create, read, update, and delete projects
- Project search and pagination
- Organization-level project isolation
- Project soft deletion
- RBAC-protected project operations

### ✅ Task Management

- Create and manage tasks
- Task status and priority
- Task assignment
- Project-specific task views
- Pagination and filtering
- Task comments
- Task activity history

### 🔔 Notifications & Real-Time Updates

- In-app notifications
- Unread notification count
- Real-time Socket.IO communication
- User and organization socket rooms
- Redis-backed Socket.IO Pub/Sub
- BullMQ-based background notification processing
- Notification worker runs in-process with the main backend service for the current Phase-0 deployment

### ⚡ Performance & Infrastructure

- Redis caching for frequently accessed resources
- Cache invalidation for changed data
- BullMQ background job processing
- MongoDB Atlas persistence
- Upstash Redis
- Docker-based local development
- Production deployment using Vercel and Render

---

## 🏗️ Architecture

```text
                    ┌─────────────────────────┐
                    │       React Frontend     │
                    │      TypeScript / UI     │
                    └────────────┬────────────┘
                                 │
                     REST API + Socket.IO
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Node.js / Express API │
                    │       TypeScript        │
                    └───────┬─────────┬───────┘
                            │         │
              ┌─────────────┘         └──────────────┐
              ▼                                      ▼
     ┌─────────────────┐                    ┌─────────────────┐
     │   MongoDB Atlas │                    │  Upstash Redis  │
     │   Application   │                    │ Cache + Pub/Sub │
     │      Data       │                    └────────┬────────┘
     └─────────────────┘                             │
                                                     │
                                                     ▼
                                           ┌─────────────────┐
                                           │     BullMQ      │
                                           │ Notification    │
                                           │     Worker      │
                                           └─────────────────┘
```

### Production deployment

```text
Vercel
  │
  │ HTTPS / REST / Socket.IO
  ▼
Render Web Service
  │
  ├── Express API
  ├── Socket.IO
  └── Notification Worker
       │
       ├── MongoDB Atlas
       └── Upstash Redis
```

The current Phase-0 deployment runs the HTTP server, Socket.IO layer, and notification worker in a single Render service. This keeps the MVP inexpensive while retaining the option to split workers into a dedicated service later.

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Socket.IO client

### Backend

- Node.js
- TypeScript
- Express 5
- MongoDB
- Mongoose
- JWT
- bcrypt
- Zod
- Socket.IO
- Winston
- Morgan

### Infrastructure

- MongoDB Atlas
- Redis
- Upstash Redis
- BullMQ
- Docker / Docker Compose
- Vercel
- Render

---

## 📂 Project Structure

```text
OrbitHQ/
│
├── frontend/                 # React frontend
│
├── backend/                  # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── workers/
│   │   └── server.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml
└── README.md
```

> Directory names may evolve as the project grows; the structure above describes the main application layers and deployment components.

---

## 🔄 Request Flow

A typical authenticated API request follows this architecture:

```text
Client
  ↓
Route
  ↓
Authentication Middleware
  ↓
Authorization / RBAC Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository / Cache
  ↓
MongoDB
```

For notification-producing actions:

```text
API Action
   ↓
Create / Update Data
   ↓
Queue Background Job
   ↓
BullMQ
   ↓
Notification Worker
   ↓
MongoDB + Redis / Socket.IO
   ↓
Connected User
```

---

## 🧑‍💻 Local Development

### Prerequisites

- Node.js
- npm
- Docker Desktop
- MongoDB or MongoDB Atlas
- Redis or a compatible Redis provider

### 1. Clone the repository

```bash
git clone https://github.com/ayush-kumar-yadav/OrbitHQ.git
cd OrbitHQ
```

### 2. Start infrastructure services

If using the included Docker Compose configuration:

```bash
docker compose up -d
```

### 3. Configure the backend

Create:

```text
backend/.env
```

Example:

```env
NODE_ENV=development
PORT=5000

MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

CLIENT_URL=http://localhost:3000
```

Never commit real secrets to GitHub.

### 4. Install backend dependencies

```bash
cd backend
npm install
```

### 5. Start the backend

```bash
npm run dev
```

The backend runs on the configured port, typically:

```text
http://localhost:5000
```

### 6. Configure the frontend

Create the frontend environment file expected by the application and set:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 7. Start the frontend

From the frontend directory, install dependencies and run the project's development command.

```bash
npm install
npm run dev
```

---

## ☁️ Production Deployment

### Frontend

The frontend is deployed on Vercel.

Production environment variable:

```env
VITE_API_URL=https://orbithq-backend.onrender.com/api/v1
```

### Backend

The backend is deployed as a Render Web Service.

Build command:

```bash
npm ci --include=dev && npm run build
```

Start command:

```bash
npm start
```

The backend uses environment variables for MongoDB, Redis, JWT secrets, and frontend CORS configuration.

### Production services

| Component | Service |
|---|---|
| Frontend | Vercel |
| Backend API | Render |
| Database | MongoDB Atlas |
| Redis | Upstash Redis |
| Background jobs | BullMQ |
| Real-time communication | Socket.IO + Redis Pub/Sub |

---

## 🔑 Environment Variables

### Backend

```env
NODE_ENV=production
PORT=5000
MONGO_URI=...
REDIS_URL=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
CLIENT_URL=...
```

### Frontend

```env
VITE_API_URL=...
```

**Never commit `.env` files, database passwords, Redis tokens, JWT secrets, or other credentials.**

---

## 🧪 Production Verification Checklist

The Phase-0 deployment has been verified for the following infrastructure components:

- [x] Frontend deployed
- [x] Backend deployed
- [x] TypeScript production build
- [x] MongoDB connection
- [x] Redis connection
- [x] BullMQ connection
- [x] Socket.IO Pub/Sub
- [x] In-process notification worker
- [x] Production authentication/API communication
- [x] Frontend-to-backend communication

Application-level testing should continue as new features are added.

---

## 📌 Current Phase-0 Scope

OrbitHQ's current goal is to provide a working foundation for a multi-tenant SaaS project-management product.

### Included

- Authentication
- Organizations
- RBAC
- Projects
- Tasks
- Comments
- Activity tracking
- Notifications
- Redis caching
- Background jobs
- Real-time communication
- Production deployment

### Planned for future phases

- Advanced analytics
- More sophisticated project views
- Advanced search
- File attachments
- Email notification workflows
- More integrations
- Dedicated worker infrastructure
- Automated CI/CD pipelines
- Expanded observability and monitoring
- More advanced collaboration features

---

## 🎯 Why OrbitHQ?

OrbitHQ is built as a learning and portfolio project around the architecture of a real multi-tenant SaaS application rather than a simple CRUD todo application.

The project focuses on concepts that become important as applications scale:

- Tenant isolation
- Authorization boundaries
- Layered backend architecture
- Caching and invalidation
- Asynchronous background processing
- Real-time communication
- Production environment configuration
- Containerized local development
- Cloud deployment

---

## 📄 License

This project is currently maintained as a personal portfolio/project implementation.

---

## 👤 Author

**Ayush Kumar Yadav**

GitHub: https://github.com/ayush-kumar-yadav

---

## ⭐ Project Status

**Phase-0 MVP — Deployed and functional.**

The project is actively evolving toward a more complete production-grade SaaS platform.
