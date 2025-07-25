import { pool } from '../config/db.js';
import { LoanQueries, BookQueries } from '../utils/queries.js';

export async function createLoan(req, res) {
  const userId = req.user.id;
  const { book_id, due_date } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    /* 1. Verificar existencia y stock del libro */
    const [[book]] = await conn.execute(BookQueries.getById, [book_id]);
    if (!book) {
      await conn.rollback();
      return res.status(404).json({ 
        success: false,
        message: 'Libro no encontrado',
        details: `No existe un libro con ID ${book_id}`
      });
    }
    if (book.available_copies < 1) {
      await conn.rollback();
      return res.status(400).json({ 
        success: false,
        message: 'Sin copias disponibles',
        details: {
          bookId: book_id,
          title: book.title,
          availableCopies: book.available_copies
        }
      });
    }

    /* 2. Crear el préstamo */
    const [loanResult] = await conn.execute(LoanQueries.create, [userId, book_id, due_date]);
    const loanId = loanResult.insertId;

    // Ya no se descuenta una copia del total, solo se crea el préstamo

    await conn.commit();
    res.status(201).json({ 
      success: true,
      message: 'Préstamo registrado exitosamente',
      data: {
        loanId,
        bookId: book_id,
        bookTitle: book.title,
        userId,
        dueDate: due_date,
        status: 'active',
        devuelto: false,
        availableCopies: book.available_copies - 1
      }
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Error al crear préstamo',
      error: err.message 
    });
  } finally {
    conn.release();
  }
}

export async function returnLoan(req, res) {
  const { id } = req.params;          // id del préstamo
  const { return_date } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    /* 1. Marcar el préstamo como devuelto */
    const [result] = await conn.execute(LoanQueries.returnLoan, [return_date, id]);
    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ 
        success: false,
        message: 'Préstamo no encontrado o ya devuelto',
        details: `No se encontró el préstamo con ID ${id} o ya estaba marcado como devuelto`
      });
    }

    /* 2. Averiguar qué libro corresponde al préstamo */
    const [[loan]] = await conn.execute(LoanQueries.getBookIdByLoan, [id]);

    // Ya no se suma una copia al total, solo se marca como devuelto

    // Obtener información actualizada del libro
    const [[book]] = await conn.execute(BookQueries.getById, [loan.book_id]);

    await conn.commit();
    res.json({ 
      success: true,
      message: 'Libro devuelto exitosamente',
      data: {
        loanId: id,
        bookId: loan.book_id,
        bookTitle: book.title,
        returnDate: return_date,
        availableCopies: book.available_copies,
        status: 'returned',
        devuelto: true
      }
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Error al devolver libro',
      error: err.message 
    });
  } finally {
    conn.release();
  }
}

export async function getUserLoans(req, res) {
  const userId = req.user?.id;
  
  // Validación del userId
  if (!userId) {
    return res.status(400).json({  
      success: false,
      message: 'ID de usuario no proporcionado o inválido',
      details: 'Se requiere un ID de usuario válido para consultar los préstamos'
    });
  }

  try {
    const [loans] = await pool.execute(LoanQueries.getUserLoans, [userId]);
    
    // Verificar si hay préstamos
    if (!loans || loans.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No se encontraron préstamos para este usuario',
        data: [],
        details: `El usuario con ID ${userId} no tiene préstamos registrados`
      });
    }

    // Respuesta exitosa con los préstamos
    // Se puede incluir el campo devuelto en la respuesta si se desea
    res.json({
      success: true,
      message: 'Préstamos obtenidos exitosamente',
      count: loans.length,
      data: loans,
      details: `Se encontraron ${loans.length} préstamo(s) para el usuario con ID ${userId}`
    });

  } catch (err) {
    console.error('Error al obtener préstamos:', err);
    res.status(500).json({
      success: false,
      message: 'Error interno al procesar la solicitud de préstamos',
      error: err.message,
      details: 'Ocurrió un error al intentar recuperar los préstamos del usuario'
    });
  }
}