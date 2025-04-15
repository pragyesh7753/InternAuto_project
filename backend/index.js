const express = require('express');
const cors = require('cors');

const app = express();

const allowedOrigins = ['https://internauto.pragyesh.tech', 'http://localhost:5173'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});