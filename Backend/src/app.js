const express = require('express');
const cors = require('cors');
const frontRoutes = require('./routes/front.routes');
const studentsRoutes = require('./routes/students.routes');
const quizzesRoutes = require('./routes/quizzes.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://147.185.221.31:16800",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', frontRoutes);
app.use('/', studentsRoutes);
app.use('/api/pract', quizzesRoutes);

app.use(errorHandler);

module.exports = app;