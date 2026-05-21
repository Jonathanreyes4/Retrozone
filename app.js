const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    if (usuario === "admin" && password === "1234") {
      window.location.href = "dashboard.html";
    } else {
      alert("Usuario o contrasena incorrectos");
    }
  });
}

const calcularVenta = document.getElementById("calcularVenta");
const productoVenta = document.getElementById("productoVenta");
const registrarVenta = document.getElementById("registrarVenta");

async function cargarProductosVenta() {
  if (!productoVenta) {
    return;
  }

  const respuesta = await fetch("/api/inventario");
  const productos = await respuesta.json();

  productoVenta.innerHTML = "";

  productos.forEach(function(producto) {
    productoVenta.innerHTML += `
      <option value="${producto.precio}" data-id="${producto.id}" data-stock="${producto.stock}" data-nombre="${producto.nombre}">
        ${producto.nombre} - $${Number(producto.precio).toLocaleString("es-CO")}
      </option>
    `;
  });

  mostrarStockVenta();
  cargarHistorialVentas();
}

function mostrarStockVenta() {
  if (!productoVenta) {
    return;
  }

  const opcion = productoVenta.options[productoVenta.selectedIndex];
  const stock = opcion.getAttribute("data-stock");
  document.getElementById("stockVenta").textContent = "Stock disponible: " + stock;
}

if (productoVenta) {
  cargarProductosVenta();
  productoVenta.addEventListener("change", mostrarStockVenta);
}

if (calcularVenta) {
  calcularVenta.addEventListener("click", function() {
    const precio = Number(document.getElementById("productoVenta").value);
    const cantidad = Number(document.getElementById("cantidadVenta").value);
    const total = precio * cantidad;

    document.getElementById("totalVenta").textContent = "Total: $" + total.toLocaleString("es-CO");
  });
}

if (registrarVenta) {
  registrarVenta.addEventListener("click", async function() {
    const opcion = productoVenta.options[productoVenta.selectedIndex];
    const id = opcion.getAttribute("data-id");
    const producto = opcion.getAttribute("data-nombre");
    const precio = Number(productoVenta.value);
    const cantidad = Number(document.getElementById("cantidadVenta").value);
    const mensaje = document.getElementById("mensajeVenta");

    mensaje.textContent = "Registrando venta...";

    const respuesta = await fetch("/api/ventas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id, producto: producto, precio: precio, cantidad: cantidad })
    });

    const resultado = await respuesta.json();
    mensaje.textContent = resultado.mensaje;

    if (!respuesta.ok) {
      return;
    }

    cargarProductosVenta();
    cargarHistorialVentas();
  });
}

async function cargarHistorialVentas() {
  const tabla = document.getElementById("tablaVentas");

  if (!tabla) {
    return;
  }

  const respuesta = await fetch("/api/ventas");
  const ventas = await respuesta.json();

  tabla.innerHTML = "";

  ventas.forEach(function(venta) {
    tabla.innerHTML += `
      <tr>
        <td>${venta.producto}</td>
        <td>${venta.cantidad}</td>
        <td>$${Number(venta.total).toLocaleString("es-CO")}</td>
        <td>${new Date(venta.fecha).toLocaleDateString("es-CO")}</td>
      </tr>
    `;
  });
}

const btnCargarInventario = document.getElementById("btnCargarInventario");

async function cargarInventario() {
    const mensaje = document.getElementById("mensajeInventario");
    const tabla = document.getElementById("tablaInventario");

    if (!tabla) {
      return;
    }

    mensaje.textContent = "Intentando conectar con la base de datos...";

    try {
      const respuesta = await fetch("/api/inventario");
      const datos = await respuesta.json();

      tabla.innerHTML = "";

      datos.forEach(function(producto) {
        let estado = "Disponible";
        let clase = "ok";

        if (producto.stock == 0) {
          estado = "Agotado";
          clase = "mal";
        } else if (producto.stock <= 2) {
          estado = "Bajo stock";
          clase = "alerta";
        }

        tabla.innerHTML += `
          <tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>${producto.stock}</td>
            <td class="${clase}">${estado}</td>
          </tr>
        `;
      });

      mensaje.textContent = "Conexion correcta. Productos encontrados: " + datos.length;
    } catch (error) {
      mensaje.textContent = "No se pudo conectar. Debe estar ejecutandose server.js";
    }
}

if (btnCargarInventario) {
  btnCargarInventario.addEventListener("click", cargarInventario);
  cargarInventario();
}

const formProducto = document.getElementById("formProducto");

async function cargarProductos() {
  const tabla = document.getElementById("tablaProductos");
  const mensaje = document.getElementById("mensajeProducto");

  if (!tabla) {
    return;
  }

  try {
    const respuesta = await fetch("/api/inventario");
    const productos = await respuesta.json();

    tabla.innerHTML = "";

    productos.forEach(function(producto) {
      tabla.innerHTML += `
        <tr>
          <td>${producto.nombre}</td>
          <td>${producto.consola}</td>
          <td>$${Number(producto.precio).toLocaleString("es-CO")}</td>
          <td>${producto.stock}</td>
          <td>
            <button>Editar</button>
            <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    mensaje.textContent = "No se pudieron cargar los productos";
  }
}

if (formProducto) {
  cargarProductos();

  formProducto.addEventListener("submit", async function(event) {
    event.preventDefault();

    const producto = {
      nombre: document.getElementById("nombreProducto").value,
      categoria: document.getElementById("categoriaProducto").value,
      consola: document.getElementById("consolaProducto").value,
      precio: document.getElementById("precioProducto").value,
      stock: document.getElementById("stockProducto").value
    };

    const respuesta = await fetch("/api/productos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(producto)
    });

    const resultado = await respuesta.json();

    if (respuesta.ok) {
      document.getElementById("mensajeProducto").textContent = resultado.mensaje;
    } else {
      document.getElementById("mensajeProducto").textContent = resultado.mensaje;
      return;
    }

    formProducto.reset();
    cargarProductos();
  });
}

async function eliminarProducto(id) {
  const respuesta = await fetch("/api/productos/" + id, {
    method: "DELETE"
  });

  const resultado = await respuesta.json();
  document.getElementById("mensajeProducto").textContent = resultado.mensaje;
  cargarProductos();
}

const formCliente = document.getElementById("formCliente");

async function cargarClientes() {
  const tabla = document.getElementById("tablaClientes");

  if (!tabla) {
    return;
  }

  const respuesta = await fetch("/api/clientes");
  const clientes = await respuesta.json();

  tabla.innerHTML = "";

  clientes.forEach(function(cliente) {
    tabla.innerHTML += `
      <tr>
        <td>${cliente.nombre}</td>
        <td>${cliente.telefono}</td>
        <td>${cliente.correo}</td>
      </tr>
    `;
  });
}

if (formCliente) {
  cargarClientes();

  formCliente.addEventListener("submit", async function(event) {
    event.preventDefault();

    const cliente = {
      nombre: document.getElementById("nombreCliente").value,
      telefono: document.getElementById("telefonoCliente").value,
      correo: document.getElementById("correoCliente").value
    };

    const respuesta = await fetch("/api/clientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cliente)
    });

    const resultado = await respuesta.json();
    document.getElementById("mensajeCliente").textContent = resultado.mensaje;

    if (respuesta.ok) {
      formCliente.reset();
      cargarClientes();
    }
  });
}
