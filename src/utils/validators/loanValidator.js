import { z } from 'zod';

//Crear préstamo
export const createLoanSchema = z.object({
  book_id: z
    .string({ required_error: 'El libro es obligatorio' })
    .uuid('ID de libro inválido'),

  due_date: z
    .string({ required_error: 'Fecha de devolución obligatoria' })
    .refine(
      val => !isNaN(Date.parse(val)),
      { message: 'Fecha no válida' }
    )
});

//Devolver préstamo
export const returnLoanSchema = z.object({
  return_date: z
    .string({ required_error: 'La fecha de devolución es obligatoria' })
    .refine(
      val => !isNaN(Date.parse(val)),
      { message: 'Fecha no válida' }
    )
});