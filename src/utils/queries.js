/* --- USERS -------------------------------------------------------------- */
export const UserQueries = {
  createUser: `
    INSERT INTO users (id, name, email, password_hash, role)
    VALUES (?, ?, ?, ?, ?)
  `,
  getUserByEmail: `SELECT * FROM users WHERE email = ?`,
  getUserById:    `SELECT * FROM users WHERE id = ?`
};

/* --- TOKENS ------------------------------------------------------------- */
export const TokenQueries = {
  insertRefreshToken: `
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES (?, ?, ?)
  `,
  getRefreshToken:    `SELECT * FROM refresh_tokens WHERE token = ?`,
  deleteRefreshToken: `DELETE FROM refresh_tokens WHERE token = ?`
};

/* --- BOOKS -------------------------------------------------------------- */
export const BookQueries = {
  getAll:      `SELECT * FROM books`,
  getById:     `SELECT * FROM books WHERE id = ?`,
  create: `
    INSERT INTO books (id, title, author_id, publish_year, copies)
    VALUES (?, ?, ?, ?, ?)
  `,
  update: `
    UPDATE books
    SET title = ?, author_id = ?, publish_year = ?, copies = ?
    WHERE id = ?
  `,
  delete: `DELETE FROM books WHERE id = ?`,

  decrementCopies: `
    UPDATE books
    SET copies = copies - 1
    WHERE id = ?
  `,
  incrementCopies: `
    UPDATE books
    SET copies = copies + 1
    WHERE id = ?
  `
};

/* --- LOANS -------------------------------------------------------------- */
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
  `,

  getBookIdByLoan: `
    SELECT book_id
    FROM loans
    WHERE id = ?
  `
};

/* --- Author -------------------------------------------------------------- */
export const AuthorQueries = {
  getAll: 'SELECT * FROM authors',
  getById: 'SELECT * FROM authors WHERE id = ?',
  create: 'INSERT INTO authors (id, name, bio) VALUES (?, ?, ?)',
  update: 'UPDATE authors SET name = ?, bio = ? WHERE id = ?',
  delete: 'DELETE FROM authors WHERE id = ?'
};