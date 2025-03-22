import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
  console.log('Received Token in isAuthenticated:', token);
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, 'demoDA');
    console.log('Decoded Token in isAuthenticated:', decoded);
    req.user = decoded; // Gán lại req.user
    console.log('req.user after decode:', req.user);
    next();
  } catch (error) {
    console.error('JWT Error in isAuthenticated:', error.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};
export const getUserFromToken = (req, res, next) => {
  if (req.user) return next(); // Không ghi đè nếu req.user đã tồn tại
  const token = req.cookies.token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
  if (token) {
    try {
      const decoded = jwt.verify(token, 'demoDA');
      req.user = decoded;
    } catch (error) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};