const express = require('express');
const cors = require('cors');
const folderRoute = require('./routes/Folder');
const questionsRoute = require('./routes/Question');
const authRoute = require('./routes/Auth');
const publicRoute = require('./routes/Public');
const db = require('./connection');
const auth = require('./middleware/auth');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/noauth', publicRoute);
app.use('/api', authRoute); // Includes /auth/* and /profile
app.use('/api', auth, folderRoute);
app.use('/api', auth, questionsRoute);

// Connect to MongoDB
db();

app.listen(3000, () => console.log('Server running on port 3000'));