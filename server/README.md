# Currency Converter Backend

This is the Node.js + Express backend for the Fullstack Currency Converter project.

## Overview

The backend provides a simple API that accepts currency conversion requests and returns real-time exchange results using the ExchangeRate-API service.

## Features

- Convert currency amounts between supported currencies
- Real-time exchange rate lookup
- Rate limiting to reduce abuse
- CORS support for local frontend integration
- Validation and error handling for API requests

## Prerequisites

- Node.js 14 or higher
- npm
- ExchangeRate-API key

## Setup

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure environment variables

Create a `.env` file in the `server` folder with:

```env
API_KEY=your_exchangerate_api_key_here
PORT=5000
```

## Running the Server

Start the backend API:

```bash
cd server
node app.js
```

The backend will listen on `http://localhost:5000` by default.

## API Endpoint

### POST `/api/convert`

Convert one currency to another.

**Request Body:**

```json
{
  "from": "USD",
  "to": "EUR",
  "amount": 100
}
```

**Successful Response:**

```json
{
  "base": "USD",
  "target": "EUR",
  "conversionRate": 0.85,
  "convertedAmount": 85
}
```

## Supported Currencies

- USD
- EUR
- GBP
- JPY
- CAD
- NGN
- GHS
- XOF

## Notes

- The frontend expects the API at `http://localhost:5000/api/convert`.
- Keep the `.env` file private; it is not tracked by git.
- Adjust CORS origins if deploying to a production frontend URL.

## Dependencies

- `express`
- `axios`
- `cors`
- `dotenv`
- `express-rate-limit`

## License

ISC
