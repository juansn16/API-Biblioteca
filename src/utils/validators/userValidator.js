import { z } from 'zod';

//registro de usuario
export const registerSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  email: z
    .string({ required_error: 'El email es obligatorio' })
    .email('Email inválido'),

  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener mínimo 6 caracteres')
});


// inicio de sesión
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'El email es obligatorio' })
    .email('Email inválido'),

  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(1, 'La contraseña no puede estar vacía')
});


// actualización parcial de perfil
export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Nombre muy corto')
      .max(100, 'Nombre muy largo')
      .optional(),

    email: z.string().email('Email inválido').optional(),

    password: z.string().min(6, 'Contraseña muy corta').optional()
  })
  .refine(
    data => Object.keys(data).length > 0,
    { message: 'Debes enviar al menos un campo para actualizar' }
  );