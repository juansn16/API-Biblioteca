import { pool } from '../config/db.js';
import { BookQueries } from '../utils/queries.js';
import { v4 as uuidv4 } from 'uuid';

/* ---------- GET /books ---------- */
export async function getAllBooks(req, res) {
  try {
    const [rows] = await pool.execute(BookQueries.getAll);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener libros' });
  }
}

/* ---------- GET /books/:id ---------- */
export async function getBookById(req, res) {
  try {
    const { id } = req.params;
    const [[book]] = await pool.execute(BookQueries.getById, [id]);
    if (!book) return res.status(404).json({ message: 'Libro no encontrado' });
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener libro' });
  }
}

/* ---------- POST /books ---------- */
export async function createBook(req, res) {
  try {
    const { title, author_id, publish_year, copies } = req.body;
    const bookId = uuidv4();

    await pool.execute(BookQueries.create,
      [bookId, title, author_id, publish_year, copies]);

    res.status(201).json({ id: bookId, title, author_id, publish_year, copies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear libro' });
  }
}

/* ---------- PUT /books/:id ---------- */
export async function updateBook(req, res) {
  try {
    const { id } = req.params;
    const { title, author_id, publish_year, copies } = req.body;

    const [result] = await pool.execute(BookQueries.update,
      [title, author_id, publish_year, copies, id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Libro no encontrado' });

    res.json({ message: 'Libro actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar libro' });
  }
}

/* ---------- DELETE /books/:id ---------- */
export async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(BookQueries.delete, [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Libro no encontrado' });

    res.json({ message: 'Libro eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar libro' });
  }
}