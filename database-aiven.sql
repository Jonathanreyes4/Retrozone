CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  consola VARCHAR(50),
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL
);

INSERT INTO productos (nombre, categoria, consola, precio, stock) VALUES
('Super Mario World', 'Videojuego', 'Super Nintendo', 120000, 5),
('Crash Bandicoot', 'Videojuego', 'PlayStation 1', 90000, 8),
('Nintendo 64', 'Consola', 'Nintendo 64', 150000, 3),
('Memory Card PS1', 'Accesorio', 'PlayStation 1', 40000, 0),
('Pokemon Yellow', 'Videojuego', 'Game Boy', 180000, 1);

CREATE TABLE IF NOT EXISTS ventas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto VARCHAR(100) NOT NULL,
  cantidad INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(30),
  correo VARCHAR(100)
);

INSERT INTO clientes (nombre, telefono, correo) VALUES
('Ana Torres', '3001234567', 'ana@email.com'),
('Camilo Ruiz', '3119876543', 'camilo@email.com');
