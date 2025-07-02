export const validate = schema => (req, res, next) => {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return res.status(400).json({ errors });
  }

  // Datos validados
  req.body = parsed.data;
  next();
};