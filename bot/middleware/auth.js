import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SESSION_SECRET = process.env.SESSION_SECRET || 'super-secret-key-for-sauna-dev';

export const authMiddleware = (req, res, next) => {
  // Support both Authorization header and cookies
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.adminToken) {
    token = req.cookies.adminToken;
  }

  if (!token) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }

  try {
    const decoded = jwt.verify(token, SESSION_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Недействительный или просроченный токен' });
  }
};

export const generateToken = (payload) => {
  // Token expires in 24 hours
  return jwt.sign(payload, SESSION_SECRET, { expiresIn: '24h' });
};
