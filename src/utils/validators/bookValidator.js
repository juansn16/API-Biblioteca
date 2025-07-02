import { z } from 'zod';

//Crear libro
export const createBookSchema = z.object({
  title: z
    .string({ required_error: 'El título es obligatorio' })
    .trim()
    .min(2, 'El título es muy corto')
    .max(255, 'El título es muy largo'),

  author_id: z
    .string({ required_error: 'El autor es obligatorio' })
    .uuid('ID de autor inválido'),

  publish_year: z
    .number({ invalid_type_error: 'El año debe ser numérico' })
    .int('El año debe ser un número entero')
    .min(1000, 'Año no válido')
    .max(new Date().getFullYear(), 'Año en el futuro'),

  copies: z
    .number({ invalid_type_error: 'Las copias deben ser numéricas' })
    .int('Debe ser un número entero')
    .min(1, 'Debe haber al menos una copia disponible')
});

//Actualizar libro
export const updateBookSchema = z
  .object({
    title: z.string().trim().min(2).max(255).optional(),
    author_id: z.string().uuid('ID de autor inválido').optional(),
    publish_year: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
    copies: z.number().int().min(1).optional()
  })
  .refine(obj => Object.keys(obj).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar'
  });