# Currency Converter API Backend

A Node.js/Express API for real-time currency conversion using the ExchangeRate-API.

## Features

- Real-time currency conversion
- Support for multiple currencies (USD, EUR, GBP, JPY, CAD, NGN, GHS, XOF)
- Rate limiting to prevent abuse
- CORS enabled for frontend integration
- Error handling and validation

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- ExchangeRate-API key (get one at https://exchangerate-api.com/)

## Installation

1. Clone the repository and navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory and add your API key:
```env
API_KEY=your_exchangerate_api_key_here
PORT=5000
```

## Usage

Start the development server:
```bash
node app.js
```

The server will run on `http://localhost:5000`

## API Endpoints

### POST /api/convert

Convert currency from one currency to another.

**Request Body:**
```json
{
  "from": "USD",
  "to": "EUR",
  "amount": 100
}
```

**Response:**
```json
{
  "base": "USD",
  "target": "EUR",
  "conversionRate": 0.85,
  "convertedAmount": 85
}
```

**Error Response:**
```json
{
  "message": "Error converting currency",
  "details": "Error details here"
}
```

## Supported Currencies

- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- JPY (Japanese Yen)
- CAD (Canadian Dollar)
- NGN (Nigerian Naira)
- GHS (Ghanaian Cedi)
- XOF (West African CFA Franc)

## Rate Limiting

The API is protected with rate limiting:
- 100 requests per 15 minutes per IP address

## CORS Configuration

The API allows requests from:
- `http://localhost:5173` (Vite development server)
- `http://localhost:5000` (for testing)

## Dependencies

- **express**: Web framework for Node.js
- **axios**: HTTP client for API requests
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **express-rate-limit**: Rate limiting middleware

## Environment Variables

- `API_KEY`: Your ExchangeRate-API key (required)
- `PORT`: Server port (default: 5000)

## Error Handling

The API includes comprehensive error handling for:
- Invalid currency codes
- API failures
- Network errors
- Rate limiting violations

## Development

To run the server in development mode:
```bash
node app.js
```

## Production Deployment

1. Set environment variables in your production environment
2. Update CORS origins for your production frontend URL
3. Use a process manager like PM2 for production deployment

## API Documentation

For more information about the ExchangeRate-API, visit: https://exchangerate-api.com/

## License

ISC