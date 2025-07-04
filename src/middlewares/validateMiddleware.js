// middlewares/validateMiddleware.js
import { ZodError } from 'zod';

export function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = {};

        for (const issue of err.errors) {
          // Muestra "path.join('.')", útil para campos anidados o normales
          const field = issue.path.length > 0 ? issue.path.join('.') : 'form';
          errors[field] = issue.message;
        }

        return res.status(400).json({ errors });
      }

      console.error('Error inesperado en validación:', err);
      return res.status(500).json({ message: 'Error interno de validación' });
    }
  };
}
