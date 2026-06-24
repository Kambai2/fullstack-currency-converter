require('dotenv').config();
const axios = require('axios');
const cors = require("cors");
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();

const API_URL = 'https://v6.exchangerate-api.com/v6';
const API_KEY = process.env.API_KEY;

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
app.post('/api/convert', async (req, res) => {
    try {
       // get the user data
        const  { from, to, amount } = req.body;
    console.log({ from, to, amount });
    // construct the api222
    const url = `${API_URL}/${API_KEY}/pair/${from}/${to}/${amount}`;
      const response = await axios.get(url);
      if (response.data && response.data.result === 'success') {
        res.json({
          base: from,
          target: to,
          conversionRate: response.data.conversion_rate,
          convertedAmount: response.data.conversion_result,
         });
      }else{
          res.json({ message: "Error converting currency", details: response.data });
    } 
  }catch (error){
     res.json({ message: "Error converting currency", details: error.message });
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