# Fullstack Currency Converter

A modern fullstack currency converter with a React + Vite frontend and a Node.js + Express backend.

## Overview

This repository includes a fullstack application for converting currency values across multiple currencies. The frontend provides a polished user interface while the backend handles live exchange rate lookup and conversion logic.

### What’s included

- `frontend/`: React application built with Vite
- `server/`: Express API backend that communicates with the ExchangeRate-API

## Features

- Convert between supported currencies in real time
- Responsive and polished UI with dark glassmorphism styling
- Backend validation, error handling, and rate limiting
- CORS-enabled backend for local frontend access
- Separation of frontend and backend concerns for easier development

## Supported Currencies

- USD
- EUR
- GBP
- JPY
- CAD
- NGN
- GHS
- XOF

## Prerequisites

- Node.js 14 or higher
- npm
- ExchangeRate-API key

## Local Setup

### 1. Install backend dependencies

```bash
cd server
npm install
```

### 2. Configure the backend

Create a `.env` file inside `server/`:

```env
API_KEY=your_exchangerate_api_key_here
PORT=5000
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Running Locally

Start the backend API first:

```bash
cd server
node app.js
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Open the URL shown by Vite (typically `http://localhost:5173`).

## Repository Layout

```text
frontend/
  src/
    app.jsx
    CurrencyConverter.css
    main.jsx
  package.json
server/
  app.js
  package.json
  README.md
  .env (not tracked)
README.md
```

## Additional Documentation

- `frontend/README.md` — frontend-specific usage and scripts
- `server/README.md` — backend-specific setup and API details

## Notes

- Keep `.env` files private; they are ignored by `.gitignore`.
- The API key must be valid for exchange rate lookups.
- When deploying the frontend, set `VITE_API_URL` to your backend deployment URL so the app can reach the correct API.
- For Vercel, add `API_KEY` in the backend project environment variables and `VITE_API_URL` in the frontend project environment variables.
- This setup is intended for local development.

## License

This project is provided as-is with no license specified.
