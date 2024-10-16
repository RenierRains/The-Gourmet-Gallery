require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const reservationRoutes = require('./routes/reservationRoutes'); 
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');

const app = express();

// Middleware test
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*',cors({
  origin: 'http://localhost:3000', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// static images test
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes); 
app.use('/api/admin', adminRoutes); 

// sync
sequelize.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch(err => console.log(err));

// start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));