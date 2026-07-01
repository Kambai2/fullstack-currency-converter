require('dotenv').config();
const axios = require('axios');
const cors = require("cors");
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();

const API_URL = 'https://v6.exchangerate-api.com/v6';
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error('Missing API_KEY in backend configuration. Set it in Vercel environment variables.');
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

//! Middleware
app.use(express.json());
app.use(apiLimiter);
app.use(cors());

//! Note: In production, narrow this to your frontend origin for better security.

//! conversation routes
app.get('/api/convert', (req, res) => {
  res.status(200).json({
    message: 'This endpoint expects a POST request with JSON body: { from, to, amount }',
  });
});

app.post('/api/convert', async (req, res) => {
    try {
      const { from, to, amount } = req.body;

      if (!from || !to || !amount) {
        return res.status(400).json({ message: 'Missing required fields: from, to, amount' });
      }

      if (!API_KEY) {
        return res.status(500).json({ message: 'Server misconfigured: missing API_KEY' });
      }

      console.log({ from, to, amount, apiKeyPresent: !!API_KEY });

      const url = `${API_URL}/${API_KEY}/pair/${from}/${to}/${amount}`;
      const response = await axios.get(url);

      if (response.data && response.data.result === 'success') {
        return res.json({
          base: from,
          target: to,
          conversionRate: response.data.conversion_rate,
          convertedAmount: response.data.conversion_result,
        });
      }

      const status = response.status || 502;
      return res.status(status).json({ message: 'Error converting currency', details: response.data });
    } catch (error) {
      console.error(error.response?.data || error.message);
      const status = error.response?.status || 500;
      const details = error.response?.data || error.message;
      return res.status(status).json({ message: 'Error converting currency', details });
    }
});


//! start server when run directly
if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;