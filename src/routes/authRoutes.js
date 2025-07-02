import express from 'express';
import { registerSchema, loginSchema } from '../utils/validators/userValidator.js';
import { validate } from '../middlewares/validateMiddleware.js';
import {
  register,
  login,
  refreshToken
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);       
router.post('/login', validate(loginSchema), login);             
router.post('/refresh', refreshToken);    

export default router;
