import express from 'express';
import { createAuthorSchema, updateAuthorSchema } from '../utils/validators/authorValidator.js'
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from '../controllers/authorController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getAllAuthors); 
router.get('/:id', authenticateToken, getAuthorById);

router.post(
  '/',
  authenticateToken,
  authorizeRoles('admin'),  
  validate(createAuthorSchema),
  createAuthor
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  validate(updateAuthorSchema),
  updateAuthor
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('admin'),
  deleteAuthor
);

export default router;