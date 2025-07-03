// server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow requests from frontend

const PORT = 5000;

app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
