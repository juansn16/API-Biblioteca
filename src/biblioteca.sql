/* ---------- Base de datos ---------- */
CREATE DATABASE IF NOT EXISTS biblioteca CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE biblioteca;

/* ---------- Tabla: users ---------- */
CREATE TABLE users (
  id            CHAR(36) PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin','user') NOT NULL DEFAULT 'user',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* ---------- Tabla: refresh_tokens ---------- */
CREATE TABLE refresh_tokens (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     CHAR(36) NOT NULL,  -- Cambiado a CHAR(36) para coincidir con users.id
  token       VARCHAR(500) NOT NULL,
  expires_at  DATETIME NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_token (token),
  CONSTRAINT fk_rt_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

/* ---------- Tabla: authors ---------- */
CREATE TABLE authors (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  bio        TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

/* ---------- Tabla: books ---------- */
CREATE TABLE books (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  author_id     INT UNSIGNED,
  title         VARCHAR(255)      NOT NULL,
  publish_year  INT,
  copies        INT UNSIGNED      NOT NULL DEFAULT 1,        -- total de ejemplares
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_book_author
    FOREIGN KEY (author_id) REFERENCES authors(id)
    ON DELETE SET NULL                            -- si eliminas autor, libro queda "sin autor"
) ENGINE=InnoDB;

/* ---------- Tabla: loans ---------- */
CREATE TABLE loans (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      CHAR(36) NOT NULL,  -- Asegúrate que coincida con users.id
  book_id      INT UNSIGNED NOT NULL,
  loan_date    DATETIME DEFAULT CURRENT_TIMESTAMP,
  due_date     DATETIME,
  return_date  DATETIME,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_loan_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_loan_book
    FOREIGN KEY (book_id) REFERENCES books(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
