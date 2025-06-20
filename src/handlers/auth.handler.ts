import { Request, Response } from "express";
import logger from "../utils/logger";
import AuthService  from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {

      const { email, password} = req.body;

      const user = await AuthService.registerUser(email, password);
      res.status(201).json({ 
        message: 'User registered successfully',
        user: { id: user.id, email: user.email, role: user.role_id }
      });
    } catch (error: any) {
      logger.error('Registration error:', error);
      if (error.code === '23505') { // Unique constraint violation
        res.status(409).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Registration failed' });
      }
    }
  }

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const { user, token } = await AuthService.loginUser(email, password);
      res.json({ 
        message: 'Login successful',
        user,
        token
      });
    } catch (error: any) {
      logger.error('Login error:', error);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }