# Currency Converter Frontend

This is the React + Vite frontend for the Fullstack Currency Converter project.

## Overview

The frontend provides a good-looking currency conversion interface with a dark theme and responsive layout. It connects to the backend API to convert currencies in real time.

## Features

- Convert amounts between supported currencies
- Responsive layout for desktop and mobile
- Dark glassmorphism-inspired UI with gradient accents
- Integration with Express backend via `axios`

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs frontend dependencies.

### `npm run dev`

Runs the app in development mode with Vite.

Open `http://localhost:5173` to view it in the browser.

### `npm run build`

Builds the app for production.

### `npm run preview`

Serves the production build locally for preview.

## Local Development

1. Start the backend API first:

```bash
cd ../server
node app.js
```

2. Start the frontend:

```bash
cd ../frontend
npm run dev
```

3. Open the URL shown by Vite (usually `http://localhost:5173`).

## Notes

- The frontend expects the backend API to be available at `http://localhost:5000/api/convert`.
- The backend uses an `.env` file for the ExchangeRate API key.
- Keep frontend and backend running separately during development.
