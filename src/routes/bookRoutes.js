import express from 'express';
import { createBookSchema, updateBookSchema } from '../utils/validators/bookValidator.js'
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';
import { validate } from '../middlewares/validateMiddleware.js';

const router = express.Router();

router.get('/', getAllBooks);         
router.get('/:id', getBookById);     
router.post('/', validate(createBookSchema), createBook);  
router.put('/:id', validate(updateBookSchema), updateBook);     
router.delete('/:id', deleteBook);

export default router;
