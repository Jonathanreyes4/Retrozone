# RetroZone

Proyecto universitario sencillo para una tienda de videojuegos retro.

## Paginas del sistema

- `index.html`: login
- `dashboard.html`: pagina principal
- `productos.html`: registro de productos
- `inventario.html`: control de inventario
- `ventas.html`: calculo basico de ventas
- `alquileres.html`: lista de alquileres
- `clientes.html`: clientes registrados
- `factura.html`: ejemplo de factura

## Conexion a base de datos con Aiven

El proyecto incluye un backend sencillo en `server.js` para conectarse a MySQL en Aiven.

Pasos:

1. Crear el archivo `.env` con los datos de conexion de Aiven.
2. Instalar dependencias:

```bash
npm install
```

3. Crear la tabla y datos de prueba:

```bash
npm run setup-db
```

4. Iniciar el servidor:

```bash
npm start
```

5. Abrir `inventario.html` y presionar el boton para cargar el inventario desde la base de datos.

La pagina `productos.html` permite listar, registrar y eliminar productos usando la misma tabla `productos`.
La pagina `ventas.html` carga los productos desde la base de datos, calcula ventas, descuenta el stock del inventario y muestra un historial simple de ventas.
La pagina `clientes.html` permite registrar y consultar clientes desde la base de datos.

Tambien se puede probar la conexion abriendo:

```text
http://localhost:3000/api/inventario
```

## Usuario de prueba

- Usuario: `admin`
- Contrasena: `1234`
