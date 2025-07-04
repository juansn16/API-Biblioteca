-- Insertar usuarios
INSERT INTO users (id, name, email, password_hash, role) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin Principal', 'admin@biblioteca.com', '$2a$10$XH8Q5z5J5U6Z5Y7W8V9G0e1F2G3H4I5J6K7L8M9N0O1P2Q3R4S5T6U7V8W9', 'admin'),
('22222222-2222-2222-2222-222222222222', 'Usuario Normal', 'usuario@biblioteca.com', '$2a$10$A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9', 'user'),
('33333333-3333-3333-3333-333333333333', 'Lector Frecuente', 'lector@biblioteca.com', '$2a$10$D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9', 'user');

-- Insertar tokens de refresco (opcional, para pruebas de autenticación)
INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES
('11111111-1111-1111-1111-111111111111', 'token_admin_123456', '2025-08-04 00:00:00'),
('22222222-2222-2222-2222-222222222222', 'token_user_123456', '2025-08-04 00:00:00');

-- Insertar autores
INSERT INTO authors (id, name, bio) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Gabriel García Márquez', 'Escritor colombiano, premio Nobel de Literatura en 1982.'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'J.K. Rowling', 'Escritora británica, autora de la serie Harry Potter.'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'J.R.R. Tolkien', 'Escritor británico, autor de El Señor de los Anillos.'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Jane Austen', 'Novelista británica del siglo XIX.');

-- Insertar libros
INSERT INTO books (id, author_id, title, publish_year, copies) VALUES
('10000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Cien años de soledad', 1967, 5),
('10000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'El amor en los tiempos del cólera', 1985, 3),
('10000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Harry Potter y la piedra filosofal', 1997, 8),
('10000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Harry Potter y la cámara secreta', 1998, 6),
('10000000-0000-0000-0000-000000000005', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'El Hobbit', 1937, 4),
('10000000-0000-0000-0000-000000000006', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'El Señor de los Anillos: La Comunidad del Anillo', 1954, 3),
('10000000-0000-0000-0000-000000000007', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Orgullo y prejuicio', 1813, 2),
('10000000-0000-0000-0000-000000000008', NULL, 'Libro sin autor asignado', 2000, 1);

-- Insertar préstamos (con fechas actuales 2025-07-04)
INSERT INTO loans (user_id, book_id, loan_date, due_date, return_date) VALUES
-- Préstamos activos (sin return_date)
('22222222-2222-2222-2222-222222222222', '10000000-0000-0000-0000-000000000001', '2025-06-20 10:00:00', '2025-07-18 23:59:59', NULL),
('33333333-3333-3333-3333-333333333333', '10000000-0000-0000-0000-000000000003', '2025-06-25 15:30:00', '2025-07-23 23:59:59', NULL),
('22222222-2222-2222-2222-222222222222', '10000000-0000-0000-0000-000000000005', '2025-07-01 09:15:00', '2025-07-29 23:59:59', NULL),

-- Préstamos devueltos
('22222222-2222-2222-2222-222222222222', '10000000-0000-0000-0000-000000000002', '2025-05-10 11:00:00', '2025-06-07 23:59:59', '2025-06-05 14:30:00'),
('33333333-3333-3333-3333-333333333333', '10000000-0000-0000-0000-000000000004', '2025-05-15 16:45:00', '2025-06-12 23:59:59', '2025-06-10 10:20:00'),

-- Préstamo vencido pero no devuelto
('33333333-3333-3333-3333-333333333333', '10000000-0000-0000-0000-000000000006', '2025-06-01 14:00:00', '2025-06-29 23:59:59', NULL),

-- Préstamo recién hecho hoy (2025-07-04)
('22222222-2222-2222-2222-222222222222', '10000000-0000-0000-0000-000000000007', '2025-07-04 09:00:00', '2025-08-01 23:59:59', NULL);