# Khelega 🏏 - Day 1

## Goal
Setup project and start React development.

---

# Project Structure

```text
Khelega/
├── frontend/   → React application
├── backend/    → Server and APIs
├── docs/       → Notes and documentation
└── README.md   → Project introduction
```

---

# Git Setup

### Initialize Git
```bash
git init
```
Creates a Git repository.

### Check Status
```bash
git status
```
Shows changed/untracked files.

### First Commit
```bash
git add .
git commit -m "Initial project structure"
```

- `git add .` → Stage files.
- `git commit` → Save a snapshot.

Think of commits as **save points in a game**.

---

# Node.js

Allows JavaScript to run outside the browser.

Without Node.js:
- Cannot install React
- Cannot build backend

---

# npm

**Node Package Manager**

Used to install libraries.

Examples:
- React
- Express
- Tailwind

Think of npm as:
> App Store for JavaScript.

---

# Vite

Modern frontend build tool.

Responsibilities:
- Create React project
- Run development server
- Hot reloading
- Production build

Why Vite?
- Fast
- Lightweight
- Modern

---

# Create React Project

```bash
npm create vite@latest .
```

`.` means:

> Create the project in the current folder.

Selected:
- Framework → React
- Variant → JavaScript
- Linter → ESLint

---

# ESLint

Code checker.

Helps:
- Find mistakes
- Maintain code quality
- Follow best practices

---

# Install Dependencies

```bash
npm install
```

Dependencies = external packages needed by the project.

Stored in:

```text
node_modules/
```

Never edit manually.

---

# Start Development Server

```bash
npm run dev
```

Usually runs on:

```text
http://localhost:5173
```

---

# localhost

Your own computer acting as a server.

Only you can access it.

---

# Port

A room number inside your computer.

```text
Computer
└── Port 5173
    └── React App
```

---

# React

JavaScript library for building user interfaces.

Built using **components**.

Examples:
- Navbar
- Button
- Profile Card

---

# JSX

HTML inside JavaScript.

Example:

```jsx
function App() {
  return <h1>Hello</h1>;
}
```

---

# HMR (Hot Module Replacement)

```text
Write Code
↓
Save
↓
Browser updates automatically
```

No manual refresh needed.

---

# Important Files

## package.json
Project info, dependencies, scripts.

## src/
Main source code.

## App.jsx
Main component.

## main.jsx
Entry point of React app.

---

# Commands Learned

```bash
git init
git status
git add .
git commit -m "message"

npm create vite@latest .
npm install
npm run dev
```

---

# What I Achieved Today

✅ Created project structure

✅ Initialized Git

✅ Created React app with Vite

✅ Learned:
- Git
- Node.js
- npm
- Vite
- React basics
- ESLint
- localhost
- HMR

---

# Next Step

- Clean boilerplate code
- Understand React file structure
- Create pages
- Learn React Router