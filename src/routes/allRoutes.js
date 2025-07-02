import express from 'express';
import authRoutes from './authRoutes.js';
import bookRoutes from './bookRoutes.js';
import loanRoutes from './loanRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);   
router.use('/books', bookRoutes);  
router.use('/loans', loanRoutes);  

export default router;