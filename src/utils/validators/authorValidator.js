import { z } from 'zod';

// Crear autor
export const createAuthorSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres'),

  bio: z
    .string()
    .trim()
    .max(2000, 'La biografía no puede exceder los 2000 caracteres')
    .optional()
});

// Actualizar autor
export const updateAuthorSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    bio: z
      .string()
      .trim()
      .max(2000)
      .optional()
  })
  .refine(obj => Object.keys(obj).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar'
  });