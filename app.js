const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const todoRoutes = require('./api/routes/todos');
const userRoutes = require('./api/routes/users');

mongoose.connect('mongodb+srv://raniket:'
  + process.env.MONGO_ATLAS_PASSWORD +
  '@ricky-dev-mongodb-63hk6.mongodb.net/test?retryWrites=true',
  {
    useNewUrlParser: true
  }
);

// Logger middleware.
app.use(morgan('dev'));

// Parse request body middleware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS middleware.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-MethodS', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});

// Different routes for handeling requests.
app.use('/todo', todoRoutes);
app.use('/user', userRoutes);

// Handeling errors.
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message || 'Internal server error'
    }
  });
});

module.exports = app;