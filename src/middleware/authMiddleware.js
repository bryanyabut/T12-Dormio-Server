const jwt = require('jsonwebtoken');
const { UserRole } = require('../generated/prisma');

const authenticateToken = (req, res, next) => {
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = user;
    
    next();
  });
};

const requireRole = (role) => {
  return (req, res, next) => {
    // Check if user has the specified role or is an admin(for full access)
    if (!req.user || (req.user.role !== role && req.user.role !== UserRole.ADMIN)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

const requireAdmin = requireRole(UserRole.ADMIN);

module.exports = { authenticateToken, requireRole, requireAdmin };
