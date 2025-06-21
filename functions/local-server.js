const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// Copy your Firebase function logic here
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from local Express server!' });
});

// Add more routes here if needed

app.listen(PORT, () => {
  console.log(`🚀 Local API running at http://localhost:${PORT}`);
});
