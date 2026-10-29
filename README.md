# Command Todo

[![Repo](https://img.shields.io/badge/github-repo-blue?logo=github)](https://github.com/PressmenX/commad-to-do-app)

A full-stack to-do list app built as an installable Progressive Web App (PWA). The frontend is built with React and Vite, backed by a NestJS REST API with PostgreSQL and Prisma.

## 📋 Table of Contents

- [🚀 Main Features](#-main-features)
- [🤖 Application of AI](#-application-of-ai)
- [📚 STACK](#-stack)
- [🔧 TOOLS](#-tools)
- [⚡ Installation & How to Run](#-installation--how-to-run)
- [🌐 API Overview](#-api-overview)
- [📁 Structure Directory](#-structure-directory)

## 🚀 Main Features

- **User Authentication**: Registration and login with JWT stored in `httpOnly` cookies and password hashing with bcrypt. Uses a short-lived access token (15 minutes) and a rotating refresh token (7 days) stored as a hash in the database. If a used refresh token is replayed, the whole token family is revoked.
- **Task Management**: Create, read, update, and delete tasks with a name, details, priority (None, Low, Medium, High), category, and completion status. Every task also gets a short unique key (`taskKey`) that is unique per user.
- **Multiple Views & Sorting**: Switch between card, list, and table views. Sort by created date, updated date, priority, or name in ascending or descending order. The chosen view and sorting are remembered in the browser.
- **Bulk Actions**: Select several tasks at once to mark them as done or delete them, with a confirmation step before deleting.
- **Progress Overview**: A progress card shows completed vs. total tasks with a percentage, plus the number of pending tasks per priority.
- **Settings**: Toggle dark or light theme, clear all completed tasks, and log out.
- **Installable PWA**: Can be installed on a phone or desktop. The service worker updates the app automatically. An offline banner appears when there is no connection, and task changes are blocked with a clear notice while offline.
- **Input Validation**: Request payloads are validated with `class-validator`. Unknown fields are rejected.
- **Centralized Error Handling & Response Format**: A global exception filter and response interceptor keep API responses uniform.
- **Structured Logging**: HTTP and application logs through `pino`.
- **Health Check**: A simple endpoint to check that the API is running.
- **Serverless Deployment**: The backend runs as a serverless function on Vercel and connects to a serverless PostgreSQL database (Neon) through Prisma's driver adapter.
- **Developer Test Panel**: In development mode only, a panel for testing login and task requests, viewing an on-screen console, and generating fake tasks with Faker.

## 🤖 Application of AI

![AI-Generated](https://img.shields.io/badge/AI--Generated-orange)
AI generated these parts almost entirely:

- **Tooling configuration**: TypeScript, ESLint, and Prettier setup for both frontend and backend.
- **Database layer**: Prisma schema and migrations.
- **Session security**: Refresh token rotation and cookie handling on the backend.
- **Frontend auth & API layer**: `AuthContext` and the Axios client with automatic token refresh.
- **PWA & offline support**: `vite-plugin-pwa` setup, the offline banner, and online status detection.
- **Bug fixes made through AI chat**: Start Menu session-check states, the empty scroll area in the installed PWA, and the app version label.

![AI-Assisted](https://img.shields.io/badge/AI--Assisted-blue)
For the rest of the project, AI was used as a development partner and learning aid:

- **Explaining concepts**: for example how JWT, cookies, and data fetching libraries work.
- **Debugging**: helping find the cause of errors and unexpected behavior.
- **Code review**: suggesting improvements to code I had already written.
- **Architecture ideas**: suggesting how to structure modules, folders, and data flow.

## 📚 STACK

[![My Skills](https://skillicons.dev/icons?i=react,vite,ts,tailwind,nestjs,prisma,postgres)](https://skillicons.dev)

| Layer          | Technologies                                                                                              |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| **Frontend**   | React 19, Vite, TypeScript, Tailwind CSS 4, daisyUI, TanStack Query, React Router, Axios, vite-plugin-pwa |
| **Backend**    | NestJS 11, TypeScript, Prisma, Passport (JWT & local), class-validator, bcrypt, pino                      |
| **Database**   | PostgreSQL (Neon serverless & Docker)                                                                     |
| **Deployment** | Vercel (frontend and backend)                                                                             |

## 🔧 TOOLS

[![My Tools](https://skillicons.dev/icons?i=vscode,github,git,vercel,docker)](https://skillicons.dev)

## ⚡ Installation & How to Run

**Prerequisites**: Node.js and a PostgreSQL database. The backend connects through Prisma's Neon adapter, so a [Neon](https://neon.tech) database is the simplest option.

1. Clone this repository:

```bash
git clone <!-- URL repo -->
```

2. Go to the project directory:

```bash
cd <!-- folder name -->
```

3. Install dependencies (root, backend, and frontend):

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

4. Configure the backend environment variables by creating `backend/.env`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@host/database_name?sslmode=require"
JWT_ACCESS_SECRET="your-jwt-secret-min-32-chars"
```

5. Configure the frontend environment variables by creating `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

6. Apply the database migrations:

```bash
npm run prisma:migrate:deploy --prefix backend
```

7. Run the backend and frontend together:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` (Vite default) and the backend at `http://localhost:3000`.

**Other useful commands**

| Command                                  | Description                                      |
| ---------------------------------------- | ------------------------------------------------ |
| `npm run dev:be`                         | Run only the backend                             |
| `npm run dev:fe`                         | Run only the frontend                            |
| `npm run build --prefix frontend`        | Build the frontend for production                |
| `npm run build --prefix backend`         | Generate the Prisma client and build the backend |
| `npm run prisma:studio --prefix backend` | Open Prisma Studio to browse the database        |

**Deployment notes (Vercel)**

- The backend uses `backend/vercel.json`. Set `DATABASE_URL`, `JWT_ACCESS_SECRET`, and `NODE_ENV=production` in the project settings.
- The frontend reads `VITE_API_URL` at build time, so set it to the deployed backend URL **before** building.
- In production the auth cookies use `SameSite=None; Secure` because the frontend and backend are served from different domains.

## 🌐 API Overview

| Method   | Endpoint         | Description                                     | Auth required  |
| -------- | ---------------- | ----------------------------------------------- | -------------- |
| `POST`   | `/auth/register` | Register a new user                             | No             |
| `POST`   | `/auth/login`    | Log in and receive auth cookies                 | No             |
| `POST`   | `/auth/refresh`  | Get a new access token using the refresh cookie | Refresh cookie |
| `POST`   | `/auth/logout`   | Log out and clear cookies                       | Yes            |
| `GET`    | `/auth/profile`  | Get the current user                            | Yes            |
| `POST`   | `/task`          | Create a task                                   | Yes            |
| `GET`    | `/task`          | List the current user's tasks                   | Yes            |
| `GET`    | `/task/:id`      | Get a task by ID                                | Yes            |
| `PATCH`  | `/task/:id`      | Update a task                                   | Yes            |
| `DELETE` | `/task/:id`      | Delete a task                                   | Yes            |
| `GET`    | `/health/check`  | Check that the API is running                   | No             |

Ready-to-run request examples are available in the `restapi/` folder (`.http` files).

## 📁 Structure Directory

```text
.
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   │   └── current-user.decorator.ts
│   │   │   ├── dto/
│   │   │   │   └── user-response.dto.ts
│   │   │   └── guard/
│   │   │       ├── jwt-auth.guard.ts
│   │   │       └── local-auth.guard.ts
│   │   ├── core/
│   │   │   ├── config/
│   │   │   │   ├── env.config.ts
│   │   │   │   └── logger.config.ts
│   │   │   ├── filters/
│   │   │   │   └── http-error/
│   │   │   │       └── http-error.filter.ts
│   │   │   └── interceptors/
│   │   │       └── transform/
│   │   │           └── transform.interceptor.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── dto/
│   │   │   │   │   ├── login.dto.ts
│   │   │   │   │   └── register.dto.ts
│   │   │   │   ├── strategies/
│   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   └── local.strategy.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── health/
│   │   │   │   ├── health.controller.ts
│   │   │   │   ├── health.module.ts
│   │   │   │   └── health.service.ts
│   │   │   ├── prisma/
│   │   │   │   ├── prisma.module.ts
│   │   │   │   └── prisma.service.ts
│   │   │   └── task/
│   │   │       ├── dto/
│   │   │       │   ├── create-task.dto.ts
│   │   │       │   └── update-task.dto.ts
│   │   │       ├── utils/
│   │   │       │   └── generate-task-key.util.ts
│   │   │       ├── task.controller.ts
│   │   │       ├── task.module.ts
│   │   │       └── task.service.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
├── docs/                       # Early planning notes
├── frontend/
│   ├── public/                 # PWA icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── AuthModal.tsx
│   │   │   ├── task/
│   │   │   │   ├── modal/
│   │   │   │   │   ├── AddTaskModal.tsx
│   │   │   │   │   └── ConfirmDeleteModal.tsx
│   │   │   │   ├── views/
│   │   │   │   │   ├── TaskCard.tsx
│   │   │   │   │   ├── TaskItem.tsx
│   │   │   │   │   └── TaskTable.tsx
│   │   │   │   ├── BulkActionBar.tsx
│   │   │   │   ├── TaskList.tsx
│   │   │   │   ├── TaskListContent.tsx
│   │   │   │   └── TaskListToolbar.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── ButtonWithId.tsx
│   │   │   ├── ConsoleDisplay.tsx
│   │   │   ├── NetworkStatusBanner.tsx
│   │   │   ├── TestTools.tsx
│   │   │   └── UserProgressCard.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   ├── useBulkTaskActions.ts
│   │   │   ├── useDeleteTask.ts
│   │   │   ├── useGetTask.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useOnlineStatus.ts
│   │   │   └── useToggleTask.ts
│   │   ├── pages/
│   │   │   ├── MainMenu.tsx
│   │   │   ├── SettingMenu.tsx
│   │   │   └── StartMenu.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── authApi.ts
│   │   │   ├── seed-data.ts
│   │   │   └── taskApi.ts
│   │   ├── utils/
│   │   │   └── sortTasks.ts
│   │   ├── App.tsx
│   │   ├── app-version.d.ts
│   │   ├── index.css
│   │   ├── index.ts
│   │   └── main.tsx
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── restapi/
│   ├── auth.http
│   ├── task.http
│   └── test.http
├── docker-compose.yml
└── package.json
```

## 📸 Preview

<h3 align="center">Mobile View</h3>
<p align="center">
<img  width="30%" height="1536" alt="5f20236a-70a7-4e2d-89ff-a47ba2577f26" src="https://github.com/user-attachments/assets/2c3003d5-0f78-4ad5-8a79-5a7c79b415da" />
<img width="30%" height="1546" alt="9cad0b8e-6d43-4045-8e09-0569a0fe4018" src="https://github.com/user-attachments/assets/ee5d6f86-d150-4b2f-a5ce-968de44a65a2" />

</p>
