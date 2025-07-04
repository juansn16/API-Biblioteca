import express from 'express';
import authRoutes from './authRoutes.js';
import bookRoutes from './bookRoutes.js';
import loanRoutes from './loanRoutes.js';
import authorRoutes from './authorRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);   
router.use('/books', bookRoutes);  
router.use('/loans', loanRoutes);  
router.use('/author', authorRoutes);  

export default router;