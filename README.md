# Authentication App

This application consists of two main parts: the frontend (built with React.js) and the backend (built with Nest.js and MongoDB).

## Table of Contents

1. [Project Overview](#project-overview)
2. [Configuration](#configuration)
3. [Running the Application](#running-the-application)
4. [File Tree](#file-tree)
5. [Environment Variables](#environment-variables)
6. [Additional Notes](#additional-notes)

## Project Overview

This application serves as an authentication system, allowing users to register, login securely.

- **Frontend (React.js):** The frontend is responsible for providing a user-friendly interface for authentication actions such as signup, and signin.

- **Backend (Nest.js and MongoDB):** The backend handles authentication logic, user signup and signin, and data storage. It communicates with the frontend to process requests and provide responses securely.

## Configuration

Before running the application, ensure that you have the necessary dependencies installed:

- Node.js
- MongoDB

You'll need to configure both the frontend and backend to work seamlessly together.

### Frontend Configuration

Navigate to the `auth-app` directory and install dependencies:

```
cd auth-app
npm install
```

### Backend Configuration

Navigate to the `auth-backend` directory and install dependencies:

```
cd auth-backend
npm install
```

## Running the Application

Once you've installed the dependencies, you can run the application.

### Frontend

To start the frontend server, run:

```
cd auth-app
npm start
```

The frontend will be accessible at `http://localhost:3000`.

### Backend

To start the backend server, run:

```
cd auth-backend
npm start:dev
```

The backend will be accessible at `http://localhost:8010`.

## File Tree

Here's a simplified file tree structure of the project:

```
├── README.md
├── auth-app
│   ├── README.md
│   ├── babel.config.js
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── components
│   │   │   └── PrivateRoute.tsx
│   │   ├── helper
│   │   │   ├── AxiosInstance.ts
│   │   │   └── Routes.tsx
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── pages
│   │   │   ├── AppPage.tsx
│   │   │   ├── SignIn.tsx
│   │   │   └── SignUp.tsx
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   ├── schema
│   │   │   ├── signInSchema.ts
│   │   │   └── signUpSchema.ts
│   │   └── setupTests.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
└── auth-backend
    ├── README.md
    ├── jest.config.js
    ├── nest-cli.json
    ├── package-lock.json
    ├── package.json
    ├── src
    │   ├── app.controller.spec.ts
    │   ├── app.controller.ts
    │   ├── app.module.ts
    │   ├── app.service.ts
    │   ├── auth
    │   │   ├── auth.controller.spec.ts
    │   │   ├── auth.controller.ts
    │   │   ├── auth.module.ts
    │   │   ├── auth.service.spec.ts
    │   │   ├── auth.service.ts
    │   │   ├── dto
    │   │   │   ├── create-user.dto.ts
    │   │   │   └── sign-in.dto.ts
    │   │   ├── guard
    │   │   │   └── jwt-auth.guard.ts
    │   │   ├── helper
    │   │   │   └── jwt-strategy.helper.ts
    │   │   ├── schemas
    │   │   │   └── user.schema.ts
    │   │   └── types
    │   │       └── sign-in-response.type.ts
    │   └── main.ts
    ├── test
    │   ├── app.e2e-spec.ts
    │   └── jest-e2e.json
    ├── tsconfig.build.json
    └── tsconfig.json

18 directories, 56 files
```

## Environment Variables

The application uses environment variables for configuration. You may need to create a `.env` file in the backend directories to specify variables such as database connection URLs, and secrets.

Refer .env.example file

## Additional Notes

- Make sure MongoDB is running before starting the backend server.
- Ensure that the ports specified for frontend and backend do not conflict with other applications running on your system.