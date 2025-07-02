export const UserQueries = {
  createUser: `
    INSERT INTO users (id, name, email, password_hash, role)
    VALUES (?, ?, ?, ?, ?)
  `,

  getUserByEmail: `
    SELECT * FROM users WHERE email = ?
  `,

  getUserById: `
    SELECT * FROM users WHERE id = ?
  `
};

export const TokenQueries = {
  insertRefreshToken: `
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES (?, ?, ?)
  `,

  getRefreshToken: `
    SELECT * FROM refresh_tokens WHERE token = ?
  `,

  deleteRefreshToken: `
    DELETE FROM refresh_tokens WHERE token = ?
  `
};

export const BookQueries = {
  getAll: `SELECT * FROM books`,
  getById: `SELECT * FROM books WHERE id = ?`,
  create: `
    INSERT INTO books (id, title, author_id, publish_year, copies)
    VALUES (?, ?, ?, ?, ?)
  `,
  update: `
    UPDATE books
    SET title = ?, author_id = ?, publish_year = ?, copies = ?
    WHERE id = ?
  `,
  delete: `DELETE FROM books WHERE id = ?`
};

export const LoanQueries = {
  create: `
    INSERT INTO loans (user_id, book_id, loan_date, due_date)
    VALUES (?, ?, NOW(), ?)
  `,

  returnLoan: `
    UPDATE loans
    SET return_date = ?
    WHERE id = ?
  `,

  getUserLoans: `
    SELECT l.*, b.title
    FROM loans l
    JOIN books b ON l.book_id = b.id
    WHERE l.user_id = ?
  `
};