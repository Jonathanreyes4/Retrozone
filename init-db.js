require("dotenv").config();

const fs = require("fs");
const mysql = require("mysql2/promise");

async function iniciarBaseDatos() {
  const conexion = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    multipleStatements: true
  });

  const sql = fs.readFileSync("database-aiven.sql", "utf8");
  await conexion.query(sql);
  await conexion.end();

  console.log("Base de datos preparada correctamente");
}

iniciarBaseDatos().catch(function(error) {
  console.log("Error preparando la base de datos");
  console.log(error);
});
