# Currency Converter Frontend

This frontend is part of the Fullstack Currency Converter project. It provides the UI for entering currency values, selecting conversion pairs, and displaying conversion results.

For full project setup and backend configuration, see the top-level `README.md`.

## Overview

The frontend is built with React and Vite. It connects to the backend API to perform live currency conversions and displays results in a responsive dark-themed interface.

## Features

- Convert currency values between supported currencies
- Responsive layout for desktop and mobile
- Styled using dark glassmorphism and gradient accents
- Communicates with the backend via `axios`

## Available Scripts

In the `frontend/` directory, run:

### `npm install`

Install frontend dependencies.

### `npm run dev`

Run the frontend in development mode.

### `npm run build`

Build the production-ready frontend.

### `npm run preview`

Preview the production build locally.

## Local Development

1. Start the backend API:

```bash
cd ../server
node app.js
```

2. Start the frontend:

```bash
cd frontend
npm run dev
```

3. Open the URL shown by Vite (usually `http://localhost:5173`).

## Notes

- The frontend expects the backend API at `http://localhost:5000/api/convert`.
- The backend requires an `.env` file with `API_KEY` and `PORT`.
- For full setup instructions, use the root `README.md`.
- When deploying to Vercel, set `VITE_API_URL` to your backend production URL so the frontend calls the correct API endpoint.
