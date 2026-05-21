require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const conexion = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "retrozone",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined
});

conexion.connect(function(error) {
  if (error) {
    console.log("Error al conectar con MySQL");
    console.log(error);
  } else {
    console.log("Conexion a MySQL correcta");
  }
});

app.get("/api/inventario", function(req, res) {
  const sql = "SELECT * FROM productos";

  conexion.query(sql, function(error, resultados) {
    if (error) {
      console.log("Error consultando inventario");
      console.log(error);
      res.status(500).json({ mensaje: "Error consultando inventario" });
    } else {
      res.json(resultados);
    }
  });
});

app.post("/api/productos", function(req, res) {
  const producto = req.body;

  if (!producto.nombre || !producto.precio || !producto.stock) {
    res.status(400).json({ mensaje: "Faltan datos del producto" });
    return;
  }

  const sql = "INSERT INTO productos (nombre, categoria, consola, precio, stock) VALUES (?, ?, ?, ?, ?)";
  const datos = [
    producto.nombre,
    producto.categoria || "Videojuego",
    producto.consola || "Sin consola",
    Number(producto.precio),
    Number(producto.stock)
  ];

  conexion.query(sql, datos, function(error) {
    if (error) {
      console.log("Error guardando producto");
      console.log(error);
      res.status(500).json({ mensaje: "Error guardando producto" });
    } else {
      res.json({ mensaje: "Producto guardado correctamente" });
    }
  });
});

app.delete("/api/productos/:id", function(req, res) {
  const id = req.params.id;
  const sql = "DELETE FROM productos WHERE id = ?";

  conexion.query(sql, [id], function(error) {
    if (error) {
      console.log("Error eliminando producto");
      console.log(error);
      res.status(500).json({ mensaje: "Error eliminando producto" });
    } else {
      res.json({ mensaje: "Producto eliminado correctamente" });
    }
  });
});

app.post("/api/ventas", function(req, res) {
  const id = req.body.id;
  const cantidad = Number(req.body.cantidad);
  const precio = Number(req.body.precio);
  const producto = req.body.producto;
  const total = precio * cantidad;

  const buscar = "SELECT stock FROM productos WHERE id = ?";

  conexion.query(buscar, [id], function(error, resultados) {
    if (error || resultados.length === 0) {
      res.status(500).json({ mensaje: "No se encontro el producto" });
      return;
    }

    const stockActual = resultados[0].stock;

    if (cantidad > stockActual) {
      res.status(400).json({ mensaje: "No hay suficiente stock" });
      return;
    }

    const actualizar = "UPDATE productos SET stock = stock - ? WHERE id = ?";

    conexion.query(actualizar, [cantidad, id], function(errorActualizar) {
      if (errorActualizar) {
        console.log("Error registrando venta");
        console.log(errorActualizar);
        res.status(500).json({ mensaje: "Error registrando venta" });
      } else {
        const guardarVenta = "INSERT INTO ventas (producto, cantidad, total) VALUES (?, ?, ?)";

        conexion.query(guardarVenta, [producto, cantidad, total], function(errorVenta) {
          if (errorVenta) {
            res.status(500).json({ mensaje: "Stock actualizado, pero no se guardo la venta" });
          } else {
            res.json({ mensaje: "Venta registrada y stock actualizado" });
          }
        });
      }
    });
  });
});

app.get("/api/ventas", function(req, res) {
  const sql = "SELECT * FROM ventas ORDER BY id DESC";

  conexion.query(sql, function(error, resultados) {
    if (error) {
      res.status(500).json({ mensaje: "Error consultando ventas" });
    } else {
      res.json(resultados);
    }
  });
});

app.get("/api/clientes", function(req, res) {
  const sql = "SELECT * FROM clientes ORDER BY id DESC";

  conexion.query(sql, function(error, resultados) {
    if (error) {
      res.status(500).json({ mensaje: "Error consultando clientes" });
    } else {
      res.json(resultados);
    }
  });
});

app.post("/api/clientes", function(req, res) {
  const cliente = req.body;

  if (!cliente.nombre) {
    res.status(400).json({ mensaje: "El nombre es obligatorio" });
    return;
  }

  const sql = "INSERT INTO clientes (nombre, telefono, correo) VALUES (?, ?, ?)";
  const datos = [cliente.nombre, cliente.telefono, cliente.correo];

  conexion.query(sql, datos, function(error) {
    if (error) {
      res.status(500).json({ mensaje: "Error guardando cliente" });
    } else {
      res.json({ mensaje: "Cliente guardado correctamente" });
    }
  });
});

const puerto = process.env.PORT || 3000;

app.listen(puerto, function() {
  console.log("Servidor RetroZone en http://localhost:" + puerto);
});
