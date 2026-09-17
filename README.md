# OmniTask - Full-Stack React Native To-Do App

A production-ready, full-stack task management application built with **React Native CLI (TypeScript)** on the frontend and a custom **Node.js, Express, and MongoDB** backend featuring secure **JWT authentication**.

## 📱 Overview

**OmniTask** is a feature-complete task management application designed for mobile platforms (Android/iOS).

The app demonstrates a robust full-stack architecture, utilizing a custom RESTful API for secure authentication and data persistence, combined with an intelligent task sorting system that organizes tasks based on deadline urgency and priority.

## ✨ Features

### Core Functionality

* 🔐 **User Authentication (JWT)**

  * Secure user registration and login with hashed passwords using `bcrypt`
  * JSON Web Token (JWT) session management
  * Persistent local session storage using `AsyncStorage`

* 📝 **Task Management (CRUD)**

  * Full create, read, update, and delete task operations
  * Comprehensive task attributes:

    * Title and description
    * Start date/time and deadline
    * Priority level: Low, Medium, High
    * Category: Work, Personal, Study, Other
    * Completion status

* 🧠 **Smart Task Organization**

  * **Intelligent Priority Algorithm:** Tasks are automatically sorted using a weighted scoring system combining priority weights, overdue/urgency bonuses, and remaining time until the deadline.
  * Completed tasks automatically move to the bottom of the list.
  * Filter tasks by status:

    * All tasks
    * Active only
    * Completed only

### User Experience

* 🎨 **Modern UI/UX**

  * Clean, Material Design-inspired interface
  * Priority-colored visual indicators
  * Overdue task highlighting
  * Smooth navigation flows using React Navigation

## 🏗️ Architecture & Tech Stack

### Frontend

* React Native CLI
* TypeScript
* Axios - HTTP client for API communication
* React Navigation - Native Stack navigation
* AsyncStorage - Local token persistence

### Backend

* Node.js
* Express
* TypeScript
* MongoDB
* Mongoose - MongoDB ODM
* JSON Web Tokens (JWT)
* Bcrypt - Password hashing

## 📁 Project Structure

```text
OmniTask/
├── mobile/                         # React Native Frontend
│   ├── src/
│   │   ├── api/                    # Axios task & auth services
│   │   ├── components/             # Reusable UI components
│   │   ├── context/                # Auth & Task Context Providers
│   │   ├── navigation/             # Root & Stack navigators
│   │   ├── screens/                # Login, Register, TaskList screens
│   │   ├── theme/                  # Design system
│   │   └── types/                  # TypeScript interfaces & enums
│   └── App.tsx
│
└── server/                         # Node.js / Express Backend
    ├── src/
    │   ├── config/                 # Database & environment config
    │   ├── middleware/             # Error handling & JWT verification
    │   ├── models/                 # Mongoose schemas
    │   ├── routes/                 # API endpoints
    │   └── index.ts                # Server entry point
    └── .env                         # Environment variables
```

## 🚀 Setup & Installation

### Prerequisites

Make sure the following are installed:

* **Node.js** v16 or higher
* **MongoDB** installed locally or a cloud MongoDB URI
* **Android Studio** for Android development
* **Xcode** for iOS development on macOS

### 1. Backend Setup

Navigate to the server directory:

```bash
cd OmniTask/server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `server` root directory:

```env
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/omnitask

JWT_SECRET=omnitask_secure_jwt_secret_2026!
JWT_AUDIENCE=omnitask_users
JWT_ISSUER=omnitask_api

API_PREFIX=api
```

Start the backend development server:

```bash
npm start
```

The server should connect to MongoDB and listen on port `5000`.

### 2. Frontend Setup

Open a new terminal and navigate to the mobile directory:

```bash
cd OmniTask/mobile
```

Install dependencies:

```bash
npm install
```

### API Configuration

Ensure the API URL points to your local backend server.

#### Android Emulator

```text
http://10.0.2.2:5000/api
```

`10.0.2.2` maps to the host machine from an Android emulator.

#### Physical Android Device

Replace `10.0.2.2` with your computer's local Wi-Fi IP address:

```text
http://YOUR_LOCAL_IP:5000/api
```

Make sure both the phone and computer are connected to the same network.

### 3. Run the Android Application

Start the Metro bundler:

```bash
npm start
```

In a separate terminal, run:

```bash
cd OmniTask/mobile
npm run android
```

## 📝 Usage

### Register

Open the app and create a new account using your email and password.

### Login

Authenticate using your credentials. Your JWT token is stored locally on the device using `AsyncStorage`, allowing persistent sessions.

### Manage Tasks

After logging in, you can:

* Create new tasks
* Edit existing tasks
* Mark tasks as completed
* Delete tasks
* Set task priorities
* Assign categories
* Set start dates and deadlines
* Filter tasks by completion status

All task operations are synchronized with the MongoDB database through the Express REST API.

## 🔐 Authentication Flow

The application uses JWT-based authentication:

```text
User
 │
 ▼
React Native App
 │
 │ Login / Register
 ▼
Express REST API
 │
 ├── bcrypt password hashing
 │
 ├── JWT generation
 │
 ▼
MongoDB
 │
 └── User & Task Data
```

After successful authentication:

```text
JWT Token
    │
    ▼
AsyncStorage
    │
    ▼
Authenticated API Requests
    │
    ▼
JWT Verification Middleware
    │
    ▼
Protected Task Routes
```

## 🧠 Intelligent Task Sorting

OmniTask uses a weighted scoring system to organize tasks based on their urgency and importance.

The scoring considers factors such as:

* Task priority
* Deadline urgency
* Overdue status
* Remaining time
* Completion status

Completed tasks are automatically moved toward the bottom of the list, while urgent and high-priority tasks receive greater importance.

## 🔌 API Overview

The backend exposes RESTful API endpoints for authentication and task management.

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Tasks

```http
GET    /api/tasks/user/:userId
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

Protected endpoints require a valid JWT token via the `Authorization` header:

```http
Authorization: Bearer <token>
```

## 📦 Main Technologies

| Layer             | Technologies                 |
| ----------------- | ---------------------------- |
| Mobile            | React Native CLI, TypeScript |
| Navigation        | React Navigation             |
| State Management  | Context API, useReducer      |
| HTTP Client       | Axios                        |
| Local Storage     | AsyncStorage                 |
| Backend           | Node.js, Express, TypeScript |
| Database          | MongoDB, Mongoose            |
| Authentication    | JWT                          |
| Password Security | Bcrypt                       |

## 📄 License

Created for **educational and portfolio purposes**.
