import { pool } from '../config/db.js';
import { AuthorQueries } from '../utils/queries.js';
import { v4 as uuidv4 } from "uuid";

/* ---------- GET /authors ---------- */
export async function getAllAuthors(req, res) {
  try {
    const [authors] = await pool.execute(AuthorQueries.getAll);
    
    res.json({
      success: true,
      message: authors.length > 0 
        ? 'Autores obtenidos exitosamente' 
        : 'No se encontraron autores registrados',
      count: authors.length,
      data: authors,
      details: authors.length > 0
        ? `Se encontraron ${authors.length} autor(es) en el sistema`
        : 'La base de datos no contiene autores actualmente'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener autores',
      error: err.message,
      details: 'Ocurrió un error al intentar recuperar el listado de autores'
    });
  }
}

/* ---------- GET /authors/:id ---------- */
export async function getAuthorById(req, res) {
  try {
    const { id } = req.params;
    const [[author]] = await pool.execute(AuthorQueries.getById, [id]);
    
    if (!author) {
      return res.status(404).json({ 
        success: false,
        message: 'Autor no encontrado',
        details: `No existe un autor con ID ${id}`
      });
    }

    res.json({
      success: true,
      message: 'Autor obtenido exitosamente',
      data: author,
      details: `Detalles del autor "${author.name}" (ID: ${id})`,
      booksCount: author.books_count || 0 // Asumiendo que la query podría incluir este dato
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener autor',
      error: err.message,
      details: `Ocurrió un error al buscar el autor con ID ${req.params.id}`
    });
  }
}

/* ---------- POST /authors ---------- */
export async function createAuthor(req, res) {
  try {
    const { name, bio } = req.body;
    const authorId = uuidv4();

    await pool.execute(AuthorQueries.create, [authorId, name, bio]);

    res.status(201).json({ 
      success: true,
      message: 'Autor creado exitosamente',
      data: {
        id: authorId,
        name,
        bio,
        status: 'active'
      },
      details: `El autor "${name}" ha sido registrado en el sistema`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Error al crear autor',
      error: err.message,
      details: 'Ocurrió un error al intentar registrar el nuevo autor'
    });
  }
}

/* ---------- PUT /authors/:id ---------- */
export async function updateAuthor(req, res) {
  try {
    const { id } = req.params;
    const { name, bio } = req.body;

    // Primero obtenemos el autor actual para mostrar cambios
    const [[currentAuthor]] = await pool.execute(AuthorQueries.getById, [id]);
    if (!currentAuthor) {
      return res.status(404).json({ 
        success: false,
        message: 'Autor no encontrado',
        details: `No existe un autor con ID ${id} para actualizar`
      });
    }

    const [result] = await pool.execute(AuthorQueries.update, [name, bio, id]);

    // Obtenemos el autor actualizado para la respuesta
    const [[updatedAuthor]] = await pool.execute(AuthorQueries.getById, [id]);

    res.json({
      success: true,
      message: 'Autor actualizado exitosamente',
      data: updatedAuthor,
      changes: {
        name: { from: currentAuthor.name, to: name },
        bio: { from: currentAuthor.bio, to: bio }
      },
      details: `El autor "${currentAuthor.name}" (ID: ${id}) ha sido actualizado`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Error al actualizar autor',
      error: err.message,
      details: `Ocurrió un error al intentar actualizar el autor con ID ${req.params.id}`
    });
  }
}

/* ---------- DELETE /authors/:id ---------- */
export async function deleteAuthor(req, res) {
  try {
    const { id } = req.params;
    
    // Primero obtenemos el autor para mostrar información en la respuesta
    const [[author]] = await pool.execute(AuthorQueries.getById, [id]);
    if (!author) {
      return res.status(404).json({ 
        success: false,
        message: 'Autor no encontrado',
        details: `No existe un autor con ID ${id} para eliminar`
      });
    }

    const [result] = await pool.execute(AuthorQueries.delete, [id]);

    res.json({
      success: true,
      message: 'Autor eliminado exitosamente',
      deletedAuthor: {
        id,
        name: author.name,
        booksCount: author.books_count || 0 // Asumiendo que la query podría incluir este dato
      },
      details: `El autor "${author.name}" (ID: ${id}) ha sido eliminado del sistema`,
      warning: author.books_count > 0 
        ? 'Este autor tenía libros asociados. Verifique el estado de los mismos.'
        : undefined
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: 'Error al eliminar autor',
      error: err.message,
      details: `Ocurrió un error al intentar eliminar el autor con ID ${req.params.id}`
    });
  }
}