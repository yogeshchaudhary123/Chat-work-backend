import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Only if you're storing hashed passwords
import header from '../connection/apiHeader';

const JWT_SECRET = process.env.JWT_SECRET || 'my-super-secret-key-12345';

const login = async (req: Request, res: Response) : Promise<void> =>  {
  const { email, password } = req.body;

  if (!email || !password) {
     res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    // Query user by email
    const sql = `SELECT * FROM users WHERE email = $1 LIMIT 1`;
    const result = await header.query(sql, [email]);
    const users = result.rows;

    if (!Array.isArray(users) || users.length === 0) {
       res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = users[0];

    // If you store hashed passwords (recommended)
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
       res.status(401).json({ success: false, message: 'Invalid email or password.' });
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

export default { login };
