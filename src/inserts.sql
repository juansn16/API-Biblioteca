-- Insertar usuarios (con IDs UUID)
INSERT INTO users (id, name, email, password_hash, role) VALUES
(UUID(), 'Admin Principal', 'admin@biblioteca.com', '$2y$10$HhidzQa/R1Z5YH8QO9wZ.OUYQrWZU7z5z5d5Jk5J5k5J5k5J5k5J5', 'admin'),
(UUID(), 'Juan Pérez', 'juan.perez@email.com', '$2y$10$HhidzQa/R1Z5YH8QO9wZ.OUYQrWZU7z5z5d5Jk5J5k5J5k5J5k5J5', 'user'),
(UUID(), 'María García', 'maria.garcia@email.com', '$2y$10$HhidzQa/R1Z5YH8QO9wZ.OUYQrWZU7z5z5d5Jk5J5k5J5k5J5k5J5', 'user'),
(UUID(), 'Carlos López', 'carlos.lopez@email.com', '$2y$10$HhidzQa/R1Z5YH8QO9wZ.OUYQrWZU7z5z5d5Jk5J5k5J5k5J5k5J5', 'user');

-- Insertar autores
INSERT INTO authors (name, bio) VALUES
('Gabriel García Márquez', 'Escritor colombiano, premio Nobel de Literatura en 1982, conocido por obras como "Cien años de soledad".'),
('Jorge Luis Borges', 'Escritor argentino, una de las figuras más destacadas de la literatura en español del siglo XX.'),
('Isabel Allende', 'Escritora chilena, conocida por obras como "La casa de los espíritus".'),
('Julio Cortázar', 'Escritor argentino, figura clave del boom latinoamericano.'),
('Mario Vargas Llosa', 'Escritor peruano, premio Nobel de Literatura en 2010.');

-- Insertar libros
INSERT INTO books (author_id, title, publish_year, copies) VALUES
(1, 'Cien años de soledad', 1967, 5),
(1, 'El amor en los tiempos del cólera', 1985, 3),
(2, 'Ficciones', 1944, 4),
(2, 'El Aleph', 1949, 2),
(3, 'La casa de los espíritus', 1982, 3),
(3, 'Paula', 1994, 2),
(4, 'Rayuela', 1963, 3),
(4, 'Bestiario', 1951, 1),
(5, 'La ciudad y los perros', 1963, 4),
(5, 'La fiesta del chivo', 2000, 2),
(NULL, 'Libro sin autor conocido', 1999, 1);

-- Insertar préstamos (usando IDs reales de usuarios y libros)
-- Primero obtenemos algunos IDs de usuarios y libros
SET @admin_id = (SELECT id FROM users WHERE email = 'admin@biblioteca.com');
SET @juan_id = (SELECT id FROM users WHERE email = 'juan.perez@email.com');
SET @maria_id = (SELECT id FROM users WHERE email = 'maria.garcia@email.com');
SET @carlos_id = (SELECT id FROM users WHERE email = 'carlos.lopez@email.com');

SET @cien_anios_id = (SELECT id FROM books WHERE title = 'Cien años de soledad');
SET @ficciones_id = (SELECT id FROM books WHERE title = 'Ficciones');
SET @casa_espiritus_id = (SELECT id FROM books WHERE title = 'La casa de los espíritus');
SET @rayuela_id = (SELECT id FROM books WHERE title = 'Rayuela');
SET @ciudad_perros_id = (SELECT id FROM books WHERE title = 'La ciudad y los perros');
SET @amor_colera_id = (SELECT id FROM books WHERE title = 'El amor en los tiempos del cólera');

-- Ahora insertamos los préstamos
INSERT INTO loans (user_id, book_id, loan_date, due_date, return_date) VALUES
(@juan_id, @cien_anios_id, '2023-01-10 10:00:00', '2023-01-24 10:00:00', '2023-01-20 15:30:00'),
(@juan_id, @ficciones_id, '2023-02-05 11:00:00', '2023-02-19 11:00:00', NULL),
(@maria_id, @casa_espiritus_id, '2023-02-15 09:30:00', '2023-03-01 09:30:00', '2023-02-28 16:45:00'),
(@carlos_id, @rayuela_id, '2023-03-01 14:00:00', '2023-03-15 14:00:00', NULL),
(@juan_id, @ciudad_perros_id, '2023-03-10 16:00:00', '2023-03-24 16:00:00', NULL),
(@maria_id, @amor_colera_id, '2023-03-12 10:30:00', '2023-03-26 10:30:00', NULL);

-- Insertar tokens de refresco (ejemplo)
INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES
(@admin_id, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', '2023-12-31 23:59:59'),
(@juan_id, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikp1YW4gUGVyZXoiLCJpYXQiOjE1MTYyMzkwMjJ9.4d8eF6tQ3J9Z7v8x2y1w0u9r4e5t6y7u8i9o0p1l2k3', '2023-06-30 23:59:59');