import { pool } from '../config/db.js';
import { LoanQueries, BookQueries } from '../utils/queries.js';

export async function createLoan(req, res) {
  const userId = req.user.id;
  const { book_id, due_date } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[book]] = await conn.execute(BookQueries.getById, [book_id]);
    if (!book) {
      await conn.rollback();
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    if (book.copies < 1) {
      await conn.rollback();
      return res.status(400).json({ message: 'Sin copias disponibles' });
    }

    await conn.execute(LoanQueries.create, [userId, book_id, due_date]);

    await conn.execute('UPDATE books SET copies = copies - 1 WHERE id = ?', [book_id]);

    await conn.commit();
    res.status(201).json({ message: 'Préstamo registrado' });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error al crear préstamo' });
  } finally {
    conn.release();
  }
}

export async function returnLoan(req, res) {
  const { id } = req.params;
  const { return_date } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.execute(LoanQueries.returnLoan,
      [return_date, id]);

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Préstamo no encontrado o ya devuelto' });
    }

    const [[loan]] = await conn.execute('SELECT book_id FROM loans WHERE id = ?', [id]);
    await conn.execute('UPDATE books SET copies = copies + 1 WHERE id = ?', [loan.book_id]);

    await conn.commit();
    res.json({ message: 'Libro devuelto' });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error al devolver libro' });
  } finally {
    conn.release();
  }
}

export async function getUserLoans(req, res) {
  try {
    const userId = req.user.id;
    const [rows] = await pool.execute(LoanQueries.getUserLoans, [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener préstamos' });
  }
}