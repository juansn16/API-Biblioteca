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
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getAllBooks); 
router.get('/:id', authenticateToken, getBookById);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),  
  validate(createBookSchema),
  createBook
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  validate(updateBookSchema),
  updateBook
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  deleteBook
);

export default router;
