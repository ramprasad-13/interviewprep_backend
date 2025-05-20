const express = require('express');
const cors = require('cors');
const folderRoute = require('./routes/Folder');
const questionsRoute = require('./routes/Question');
const authRoute = require('./routes/Auth');
const publicRoute = require('./routes/Public');
const db = require('./connection');
const auth = require('./middleware/auth');

const app = express();

// Define allowed origins
const allowedOrigins = [
  'https://interviewprep-frontend.vercel.app',
  'http://localhost:5173', // For local development
];

// CORS configuration with dynamic origin handling
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., server-to-server or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, origin); // Reflect the request origin
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  credentials: true,
}));

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

app.get('/',(req,res)=>{
  res.status(200).json({message:'App is Running!'});
})

app.listen(3000, () => console.log('Server running on port 3000'));


module.exports= app;
