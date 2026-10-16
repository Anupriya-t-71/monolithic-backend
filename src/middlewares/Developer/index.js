import jwt from 'jsonwebtoken';
import { User } from '../../models/Developers/index.js';


const authenticateUser = async (req, res, next) => {
   const token = req.header('Authorization')?.replace('Token ', ''); // Extract token

  if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
  }
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.secret_key); 
    req.user = decoded; 
    console.log("decoded",decoded);

    next(); 
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.status(401).json({ status: 'failed', message: 'Unauthorized' });
  }
};

export default authenticateUser;
