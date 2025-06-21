const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// Example endpoint (copy your Firebase functions here)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from local Express server!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend API is running at http://localhost:${PORT}`);
});
