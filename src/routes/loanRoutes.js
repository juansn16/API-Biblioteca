import express from 'express';
import { createLoanSchema, returnLoanSchema } from '../utils/validators/loanValidator.js'
import { validate } from '../middlewares/validateMiddleware.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import {
  getUserLoans,
  createLoan,
  returnLoan
} from '../controllers/loanController.js';

const router = express.Router();

router.get('/my', authenticateToken, authorizeRoles('user', 'admin'), getUserLoans);
router.post('/', authenticateToken, authorizeRoles('user', 'admin'), validate(createLoanSchema), createLoan);
router.put('/:id/return', authenticateToken, authorizeRoles('user', 'admin'), validate(returnLoanSchema), returnLoan);   

export default router;