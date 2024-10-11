const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes'); // Import menu routes
const path = require('path');

const app = express();


app.use(cors());
app.use(express.json());

// Serve static files for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);

// Database synchronization
sequelize.sync({ force: false })
  .then(() => console.log('Database synced'))
  .catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));