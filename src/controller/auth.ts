import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Only if you're storing hashed passwords
import header from '../connection/apiHeader';

const JWT_SECRET = process.env.JWT_SECRET || 'my-super-secret-key-12345';

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required.' });
    return;
  }

  try {
    // Query user by email
    const sql = `SELECT * FROM users WHERE email = $1 LIMIT 1`;
    const result = await header.query(sql, [email]);
    const users = result.rows;

    if (!Array.isArray(users) || users.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const user = users[0];

    // If you store hashed passwords (recommended)
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        token: token,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ success: false, message: 'All fields are required.' });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`;
    const result = await header.query(sql, [name, email, hashedPassword]);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ success: false, message: 'Email is required.' });
    return;
  }

  try {
    const sql = `SELECT * FROM users WHERE email = $1 LIMIT 1`;
    const result = await header.query(sql, [email]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // In a real app, generate a unique token, save it to DB with expiry, and send email
    const token = Math.random().toString(36).substr(2, 10);
    
    res.json({
      success: true,
      message: 'Password reset instructions sent to your email (simulated)',
      token: token // Sending token for development/demo purposes
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ success: false, message: 'Token and password are required.' });
    return;
  }

  try {
    // In a real app, you would verify the token from the database
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // For simulation, we'll just return success. 
    // Ideally, you'd find the user by token and update their password.
    
    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default { login, signup, forgotPassword, resetPassword };
