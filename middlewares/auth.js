const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('dotenv').config().parsed;

const authenticateJWT = (req, res, next) => {
  // console.log(req.header('Authorization'));
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Missing token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateJWT;
