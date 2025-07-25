import { pool } from '../config/db.js';
import { BookQueries } from '../utils/queries.js';
import { v4 as uuidv4 } from 'uuid';

/* ---------- GET /books ---------- */
export async function getAllBooks(req, res) {
  try {
    const [books] = await pool.execute(BookQueries.getAll);
    
    res.json({
      success: true,
      message: books.length > 0 
        ? 'Libros obtenidos exitosamente' 
        : 'No se encontraron libros registrados',
      count: books.length,
      data: books,
      details: books.length > 0
        ? `Se encontraron ${books.length} libro(s) en el sistema`
        : 'La base de datos no contiene libros actualmente'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener libros',
      error: err.message,
      details: 'Ocurrió un error al intentar recuperar el listado de libros'
    });
  }
}

/* ---------- GET /books/:id ---------- */
export async function getBookById(req, res) {
  try {
    const { id } = req.params;
    const [[book]] = await pool.execute(BookQueries.getById, [id]);
    
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: 'Libro no encontrado',
        details: `No existe un libro con ID ${id}`
      });
    }

    res.json({
      success: true,
      message: 'Libro obtenido exitosamente',
      data: book,
      details: `Detalles del libro "${book.title}" (ID: ${id})`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener libro',
      error: err.message,
      details: `Ocurrió un error al buscar el libro con ID ${req.params.id}`
    });
  }
}

/* ---------- POST /books ---------- */
export async function createBook(req, res) {
  try {
    const { title, author_id, publish_year, copies, cover_url } = req.body;
    const bookId = uuidv4();

    await pool.execute(BookQueries.create,
      [bookId, title, author_id, publish_year, copies, cover_url]);

    res.status(201).json({ 
      success: true,
      message: 'Libro creado exitosamente',
      data: {
        id: bookId,
        title,
        author_id,
        publish_year,
        copies,
        cover_url,
        status: 'active'
      },
      details: `El libro "${title}" ha sido registrado en el sistema con ${copies} copias disponibles`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Error al crear libro',
      error: err.message,
      details: 'Ocurrió un error al intentar registrar el nuevo libro'
    });
  }
}

/* ---------- PUT /books/:id ---------- */
export async function updateBook(req, res) {
  try {
    const { id } = req.params;
    const { title, author_id, publish_year, copies, cover_url } = req.body;

    // Primero obtenemos el libro actual para mostrar cambios
    const [[currentBook]] = await pool.execute(BookQueries.getById, [id]);
    if (!currentBook) {
      return res.status(404).json({ 
        success: false,
        message: 'Libro no encontrado',
        details: `No existe un libro con ID ${id} para actualizar`
      });
    }

    const [result] = await pool.execute(BookQueries.update,
      [title, author_id, publish_year, copies, cover_url, id]);

    // Obtenemos el libro actualizado para la respuesta
    const [[updatedBook]] = await pool.execute(BookQueries.getById, [id]);

    res.json({
      success: true,
      message: 'Libro actualizado exitosamente',
      data: updatedBook,
      changes: {
        title: { from: currentBook.title, to: title },
        author_id: { from: currentBook.author_id, to: author_id },
        publish_year: { from: currentBook.publish_year, to: publish_year },
        copies: { from: currentBook.copies, to: copies },
        cover_url: { from: currentBook.cover_url, to: cover_url }
      },
      details: `El libro "${currentBook.title}" (ID: ${id}) ha sido actualizado`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Error al actualizar libro',
      error: err.message,
      details: `Ocurrió un error al intentar actualizar el libro con ID ${req.params.id}`
    });
  }
}

/* ---------- DELETE /books/:id ---------- */
export async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    
    // Primero obtenemos el libro para mostrar información en la respuesta
    const [[book]] = await pool.execute(BookQueries.getById, [id]);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: 'Libro no encontrado',
        details: `No existe un libro con ID ${id} para eliminar`
      });
    }

    const [result] = await pool.execute(BookQueries.delete, [id]);

    res.json({
      success: true,
      message: 'Libro eliminado exitosamente',
      deletedBook: {
        id,
        title: book.title,
        author_id: book.author_id
      },
      details: `El libro "${book.title}" (ID: ${id}) ha sido eliminado del sistema`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Error al eliminar libro',
      error: err.message,
      details: `Ocurrió un error al intentar eliminar el libro con ID ${req.params.id}`
    });
  }
}