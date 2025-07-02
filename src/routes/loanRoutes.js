import express from 'express';
import { createLoanSchema, returnLoanSchema } from '../utils/validators/loanValidator.js'
import { validate } from '../middlewares/validateMiddleware.js';
import {
  getUserLoans,
  createLoan,
  returnLoan
} from '../controllers/loanController.js';

const router = express.Router();

router.get('/my', getUserLoans);          
router.post('/', validate(createLoanSchema), createLoan);             
router.put('/:id/return', validate(returnLoanSchema), returnLoan);    

export default router;