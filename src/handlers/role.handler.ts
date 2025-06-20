import { Request, Response } from "express";
import logger from "../utils/logger";


const createRole = async (req: Request, res: Response): Promise<void> => {
    try {

    //   const { email, password, role = 'employee' } = req.body;

    //   const user = await AuthService.registerUser(email, password, role);
    //   res.status(201).json({ 
    //     message: 'User registered successfully',
    //     user: { id: user.id, email: user.email, role: user.role }
    //   });
    } catch (error: any) {
      logger.error('Registration error:', error);

      res.status(500).json({ error: 'Registration failed' });
    }
  }