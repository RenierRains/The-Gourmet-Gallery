const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('Headers in authMiddleware:', req.headers);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log('Authentication token missing');
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request
    req.user = user;
    console.log('Authenticated user:', req.user);
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

module.exports = authMiddleware;