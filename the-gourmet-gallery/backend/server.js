const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(cors({
    orgin: 'http://localhost:3000/'
}))

// Routes
app.use('/api/auth', authRoutes);

// db
sequelize.sync({ force: false })
  .then(() => console.log('Database synced'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
